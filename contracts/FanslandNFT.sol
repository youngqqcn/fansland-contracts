// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract FanslandNFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721PausableUpgradeable,
    OwnableUpgradeable,
    ERC721BurnableUpgradeable,
    ERC721HolderUpgradeable,
    UUPSUpgradeable
{
    // using Math for uint256;

    // Contract private variables
    uint256 public tokenIdCounter;
    bool public openSale; // open sale
    uint256 public maxSupply;
    string public baseURI;

    struct NftType {
        uint256 id; // ticket type id
        string name; // type name
        string uri; // uri
        uint256 maxSupply; // maxsupply
        uint256 totalSupply; // totalSupply
        uint256 price; // price
        bool isSaleActive; // sale staus
    }

    mapping(uint256 => NftType) public nftTypeMap;
    mapping(uint256 => bool) public nftTypeExistsMap;
    uint256[] public nftTypeIds;
    mapping(uint256 => uint256) public tokenIdTypeMap;

    // payment tokens
    mapping(address => bool) _paymentTokensMap;
    address[] public paymentTokens;

    // token receivers
    address[] _tokenReceivers;
    mapping(address => bool) _tokenReceiversMap;

    /**
     * @dev Emitted when the base URI is changed.
     */
    event UriChanged();

    /// @dev Emitted typeId to record
    event MintNft(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId,
        uint256 typeId
    );

    // transfer switch
    bool public allowTransfer;

    /// @custom:oz-upgrades-unsafe-allow constructor
    // constructor() initializer {
    //     _disableInitializers();
    // }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize() public initializer {
        __ERC721_init("Fansland", "Fansland");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init(msg.sender);
        __ERC721Burnable_init();

        // allow transfer by default
        allowTransfer = true;

        openSale = true;
        baseURI = "https://mynft.com/";
        maxSupply = 100000;

        // TODO: init with some data
        nftTypeMap[0] = NftType({
            id: 0,
            name: "Fansland type 0",
            uri: "uri/0",
            maxSupply: 100,
            totalSupply: 0,
            price: 0.0001 ether,
            isSaleActive: true
        });
        nftTypeExistsMap[0] = true;
        nftTypeIds.push(0);

        nftTypeMap[1] = NftType({
            id: 1,
            name: "Fansland type 1",
            uri: "uri/1",
            maxSupply: 10,
            totalSupply: 0,
            price: 0.0003 ether,
            isSaleActive: true
        });
        nftTypeExistsMap[1] = true;
        nftTypeIds.push(1);

        // TODO:
        _tokenReceivers.push(owner());
        _tokenReceiversMap[owner()] = true;
    }

    /// @dev open sale
    modifier whenOpenSale() {
        require(openSale, "Sale must be active to mint NFT");
        _;
    }

    /// @dev allow transfer
    modifier whenAllowTransfer() {
        require(allowTransfer, "transfer is not permitted");
        _;
    }

    /// @dev update allowTransfer status
    function updateAllowTransfer(bool status) public onlyOwner {
        allowTransfer = status;
    }

    // @dev add token receivers
    function addTokenReceivers(address[] calldata receivers) public onlyOwner {
        for (uint i = 0; i < receivers.length; i++) {
            address addr = receivers[i];
            if (!_tokenReceiversMap[addr]) {
                _tokenReceivers.push(addr);
                _tokenReceiversMap[addr] = true;
            }
        }
    }

    /// @dev add allowed tokens
    function updatePaymentToken(address token, bool active) public onlyOwner {
        _paymentTokensMap[token] = active;
        if (active) {
            paymentTokens.push(token);
        } else {
            // remove token
            for (uint i = 0; i < paymentTokens.length; i++) {
                if (paymentTokens[i] == token) {
                    paymentTokens[i] = paymentTokens[paymentTokens.length - 1];
                    paymentTokens.pop();
                    break;
                }
            }
        }
    }

    /// @dev check if token is allowed
    function tokenIsAllowed(address token) public view returns (bool) {
        return _paymentTokensMap[token];
    }

    /// @dev update nft type
    function addNftType(
        uint256 id,
        string calldata typeName,
        string calldata uri,
        uint256 maxsupply,
        uint256 curSupply,
        uint256 price,
        bool saleActive
    ) public onlyOwner {
        nftTypeMap[id] = NftType({
            id: id,
            name: typeName,
            uri: uri,
            maxSupply: maxsupply,
            totalSupply: curSupply,
            price: price,
            isSaleActive: saleActive
        });

        if (!nftTypeExistsMap[id]) {
            nftTypeIds.push(id);
            nftTypeExistsMap[id] = true;
        }
    }

    /// @dev delete nft type
    function removeNftType(uint256 id) public onlyOwner {
        delete nftTypeMap[id];
        nftTypeExistsMap[id] = false;

        // remove nft typeid from nftTypeIds
        for (uint i = 0; i < nftTypeIds.length; i++) {
            if (nftTypeIds[i] == id) {
                nftTypeIds[i] = nftTypeIds[nftTypeIds.length - 1];
                nftTypeIds.pop();
                break;
            }
        }
    }

    /// @dev aggregate all price and quantity
    function calculateTotal(
        address payToken,
        uint256[] calldata typeIds,
        uint256[] calldata quantities
    ) public view returns (uint256) {
        require(typeIds.length == quantities.length, "args length not match");
        require(tokenIsAllowed(payToken), "payment token not support");

        // get the total price of all NFT
        uint256 totalPrice = 0;
        for (uint i = 0; i < typeIds.length; i++) {
            uint256 typeId = typeIds[i];
            require(nftTypeExistsMap[typeId], "invalid typeId");

            bool ok = false;
            uint256 result = 0;
            (ok, result) = Math.tryAdd(
                nftTypeMap[typeId].totalSupply,
                quantities[i]
            );
            require(ok, "quantity overflow");
            require(
                nftTypeMap[typeId].maxSupply >= result,
                "Purchase would exceed max supply of NFTs"
            );

            (ok, result) = Math.tryMul(nftTypeMap[typeId].price, quantities[i]);
            require(ok, "mul overflow");

            (ok, result) = Math.tryAdd(result, totalPrice);
            require(ok, "add overflow");

            totalPrice = result;
        }

        // convert decimals
        bool okDiv = false;
        uint256 tokenAmount = 0;
        (okDiv, tokenAmount) = Math.tryDiv(
            totalPrice,
            10 ** (18 - IERC20Metadata(payToken).decimals())
        );
        require(okDiv, "div overflow");

        return tokenAmount;
    }

    /// @dev mint NFT with ERC20 token paymentToken
    // if openSale is true, it's mintable
    function mintBatchByErc20(
        address payToken,
        uint256[] calldata typeIds,
        uint256[] calldata quantities
    ) public whenOpenSale {
        require(
            typeIds.length > 0 &&
                quantities.length > 0 &&
                typeIds.length == quantities.length,
            "args length not match"
        );
        require(tokenIsAllowed(payToken), "payment token not support");

        IERC20Metadata erc20Token = IERC20Metadata(payToken);
        uint256 tokenAmount = calculateTotal(payToken, typeIds, quantities);

        require(
            erc20Token.allowance(msg.sender, address(this)) >= tokenAmount,
            "allowance token is not enough"
        );

        // transfer ERC20 token
        address tokenReceiver = _tokenReceivers[
            (block.timestamp +
                uint256(uint160(msg.sender)) +
                uint256(uint160(payToken)) +
                tokenAmount) % _tokenReceivers.length
        ];
        if (tokenReceiver == address(0)) {
            tokenReceiver = owner();
        }

        // ethereum mainnet USDT  https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7#code
        // transferFrom doesn't have return value:
        //      function transferFrom(address from, address to, uint value) public;
        if (payToken == address(0xdAC17F958D2ee523a2206206994597C13D831ec7)) {
            erc20Token.transferFrom(msg.sender, tokenReceiver, tokenAmount);
        } else {
            require(
                erc20Token.transferFrom(msg.sender, tokenReceiver, tokenAmount),
                "transferFrom failed"
            );
        }

        for (uint i = 0; i < typeIds.length; i++) {
            _mintNFT(typeIds[i], _msgSender(), quantities[i]);
        }
    }

    /// @dev  batch mint
    function _mintNFT(uint256 typeId, address to, uint256 quantity) internal {
        require(nftTypeExistsMap[typeId], "invalid typeId");

        uint256 tokenId = tokenIdCounter;
        NftType memory nftType = nftTypeMap[typeId];
        require(nftType.isSaleActive, "not open sale ticket");
        for (uint i = 0; i < quantity; i++) {
            uint256 curTokenId = tokenId + i;
            _mint(to, curTokenId);

            tokenIdTypeMap[curTokenId] = typeId;

            _setTokenURI(curTokenId, nftType.uri);
        }

        tokenIdTypeMap[typeId] = typeId;
        nftTypeMap[typeId].totalSupply += quantity;
        require(
            nftTypeMap[typeId].totalSupply <= maxSupply,
            "tickets are not enough"
        );
        tokenIdCounter += quantity;
    }

    /// @param account account
    /// @param value value
    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(
            ERC721PausableUpgradeable,
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable
        )
        whenNotPaused
        returns (address)
    {
        // TODO: more check add here
        return super._update(to, tokenId, auth);
    }

    /// @notice Returns a list of all NFT IDs assigned to an address.
    /// @param _owner The owner whose NFTs we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Kitty array looking for cats belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(
        address _owner
    ) public view returns (uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                result[resultIndex] = tokenOfOwnerByIndex(_owner, index);
                resultIndex++;
            }
            return result;
        }
    }

    /// @dev allows owner to withdraw ethers
    // function withdraw() public onlyOwner {
    //     uint balance = address(this).balance;
    //     payable(owner()).transfer(balance);
    // }

    /// @param isOpenSale Sale status param.
    /// @dev This method should be invoked from WEB3 for setting sale active status
    function setSaleActive(bool isOpenSale) public onlyOwner {
        openSale = isOpenSale;
    }

    /// @param newBaseTokenURI New base token URI.
    /// @dev This method should be invoked from WEB3 for setting base token URI
    function setBaseURI(string memory newBaseTokenURI) public onlyOwner {
        baseURI = newBaseTokenURI;
        emit UriChanged();
    }

    /// @dev This method should be invoked from WEB3 from owner's account to PAUSE the smart contract
    ///
    /// disallow NFT transfer
    function pause() public onlyOwner {
        _pause();
    }

    /// @dev This method should be invoked from WEB3 from owner's account to UNPAUSE the smart contract
    ///
    /// allow NFT transfer
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721Upgradeable, IERC721) whenAllowTransfer {
        super.transferFrom(from, to, tokenId);
    }

    /**
     * @dev See {ERC721Upgradeable-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override(ERC721Upgradeable, IERC721) whenAllowTransfer {
        super.safeTransferFrom(from, to, tokenId, data);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        if (tokenId > tokenIdCounter) {
            revert ERC721NonexistentToken(tokenId);
        }

        return string.concat(baseURI, nftTypeMap[tokenIdTypeMap[tokenId]].uri);
        // return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721EnumerableUpgradeable,
            ERC721URIStorageUpgradeable,
            ERC721Upgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    ///@dev fallback
    receive() external payable {
        if (msg.value > 0) {
            revert("do not send eth to this contract directly");
        }
    }
}
