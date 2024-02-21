// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "./IERC20Usdt.sol";

contract FanslandNFT is
    Initializable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    struct NftType {
        uint8 id;
        string name;
        string uri;
        uint256 maxSupply;
        uint256 totalSupply;
        uint256 price;
        bool isSaleActive;
    }

    uint256 public tokenIdCounter;
    bool public openSale;
    string public baseURI;
    bool public allowTransfer;

    mapping(uint256 => NftType) public nftTypeMap;
    mapping(uint256 => bool) public nftTypeExistsMap;
    uint256[] public nftTypeIds;
    mapping(uint256 => uint256) public tokenIdTypeMap;

    mapping(address => bool) _paymentTokensMap;
    address[] public paymentTokens;

    address[] _tokenReceivers;
    mapping(address => bool) _tokenReceiversMap;

    // https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7#code
    address private ethErc20Usdt;

    event MintNft(
        address indexed user,
        address indexed kol,
        uint256 totalUsdx1000,
        uint256 timestamp
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize() public initializer {
        __ERC721_init("Fansland", "Fansland");
        __ERC721Enumerable_init();
        __Ownable_init(msg.sender);
        // ethErc20Usdt = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
        ethErc20Usdt = 0x6F5732407FDAB0315E2F700fAa252ccAD5639EE4;
    }

    function init() public onlyOwner {
        allowTransfer = true;

        openSale = true;
        baseURI = "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/";

        updateNftType(0, "Fansland type 0", "0", 100, 0, 0.1 ether, true);
        updateNftType(1, "Fansland type 1", "1", 100, 0, 1 ether, true);
    }

    modifier whenOpenSale() {
        require(openSale, "Sale must be active to mint NFT");
        _;
    }

    modifier whenAllowTransfer() {
        require(allowTransfer, "transfer is not permitted");
        _;
    }

    function getAllTypeTypeIds() public view returns (uint256[] memory) {
        return nftTypeIds;
    }

    function updateAllowTransfer(bool status) public onlyOwner {
        allowTransfer = status;
    }

    function updateTokenReceivers(
        address[] calldata receivers,
        bool[] calldata bools
    ) public onlyOwner {
        require(receivers.length == bools.length, "invalid arguments");
        for (uint i = 0; i < receivers.length; i++) {
            address addr = receivers[i];
            require(uint160(addr) > 0xFFFFFFFF, "invalid receive address");
            if (bools[i]) {
                if (!_tokenReceiversMap[addr]) {
                    _tokenReceivers.push(addr);
                }
            } else {
                // remove
                for (uint j = 0; j < _tokenReceivers.length; j++) {
                    if (_tokenReceivers[j] == addr) {
                        _tokenReceivers[j] = _tokenReceivers[
                            _tokenReceivers.length - 1
                        ];
                        _tokenReceivers.pop();
                        break;
                    }
                }
            }
            _tokenReceiversMap[addr] = bools[i];
        }
    }

    function updatePaymentToken(
        address[] calldata tokens,
        bool[] calldata actives
    ) public onlyOwner {
        require(tokens.length == actives.length, "invalid arguments");
        for (uint n = 0; n < tokens.length; n++) {
            address token = tokens[n];
            bool active = actives[n];
            _paymentTokensMap[token] = active;
            if (active) {
                paymentTokens.push(token);
            } else {
                // remove token
                for (uint i = 0; i < paymentTokens.length; i++) {
                    if (paymentTokens[i] == token) {
                        paymentTokens[i] = paymentTokens[
                            paymentTokens.length - 1
                        ];
                        paymentTokens.pop();
                        break;
                    }
                }
            }
        }
    }

    function tokenIsAllowed(address token) public view returns (bool) {
        return _paymentTokensMap[token];
    }

    function updateNftType(
        uint8 id,
        string memory typeName,
        string memory uri,
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

    function _isEthErc20Usdt(address payToken) internal view returns (bool) {
        return address(payToken) == address(ethErc20Usdt);
    }

    function calculateTotal(
        address payToken,
        uint256[] calldata typeIds,
        uint256[] calldata quantities
    ) public view returns (uint256) {
        require(typeIds.length == quantities.length, "args length not match");
        require(tokenIsAllowed(payToken), "payment token not support");
        uint256 decimals = 0;
        if (_isEthErc20Usdt(payToken)) {
            decimals = IERC20Usdt(payToken).decimals();
        } else {
            decimals = IERC20Metadata(payToken).decimals();
        }

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
        (okDiv, tokenAmount) = Math.tryDiv(totalPrice, 10 ** (18 - decimals));
        require(okDiv, "div overflow");

        return tokenAmount;
    }

    function mintBatch(
        address payToken,
        uint256[] calldata typeIds,
        uint256[] calldata quantities,
        address kol
    ) public whenOpenSale {
        require(
            typeIds.length > 0 &&
                quantities.length > 0 &&
                typeIds.length == quantities.length,
            "args length not match"
        );
        require(tokenIsAllowed(payToken), "payment token not support");
        uint256 decimals = 0;
        address user = _msgSender();
        uint256 tokenAmount = calculateTotal(payToken, typeIds, quantities);

        address tokenReceiver = owner();
        if (_tokenReceivers.length > 0) {
            tokenReceiver = _tokenReceivers[
                (tokenAmount + uint256(uint160(user))) % _tokenReceivers.length
            ];
        }

        if (_isEthErc20Usdt(payToken)) {
            IERC20Usdt usdt = IERC20Usdt(payToken);
            decimals = usdt.decimals();
            require(
                usdt.allowance(user, address(this)) >= tokenAmount,
                "allowance token is not enough"
            );
            usdt.transferFrom(user, tokenReceiver, tokenAmount);
        } else {
            IERC20Metadata erc20Token = IERC20Metadata(payToken);
            decimals = erc20Token.decimals();
            require(
                erc20Token.allowance(user, address(this)) >= tokenAmount,
                "allowance token is not enough"
            );
            require(
                erc20Token.transferFrom(user, tokenReceiver, tokenAmount),
                "transferFrom failed"
            );
        }

        for (uint i = 0; i < typeIds.length; i++) {
            _mintNFT(typeIds[i], user, quantities[i]);
        }

        // point rewards
        (bool ok, uint256 usdPricex1000) = Math.tryDiv(
            tokenAmount * 1000,
            10 ** decimals
        );
        if (ok) {
            emit MintNft(user, kol, usdPricex1000, block.timestamp);
        }
    }

    function _mintNFT(uint256 typeId, address to, uint256 quantity) internal {
        require(nftTypeExistsMap[typeId], "invalid typeId");

        uint256 tokenId = tokenIdCounter;
        NftType memory nftType = nftTypeMap[typeId];
        require(nftType.isSaleActive, "not open sale ticket");
        for (uint i = 0; i < quantity; i++) {
            uint256 curTokenId = tokenId + i;
            _mint(to, curTokenId);

            tokenIdTypeMap[curTokenId] = typeId;
        }

        tokenIdTypeMap[typeId] = typeId;
        nftTypeMap[typeId].totalSupply += quantity;
        require(
            nftTypeMap[typeId].totalSupply <= nftTypeMap[typeId].maxSupply,
            "tickets are not enough"
        );
        tokenIdCounter += quantity;
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    /// @dev _update
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721EnumerableUpgradeable) returns (address) {
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
            // sequentially up to the total count.
            for (uint256 index = 0; index < tokenCount; index++) {
                result[resultIndex] = tokenOfOwnerByIndex(_owner, index);
                resultIndex++;
            }
            return result;
        }
    }

    function setSaleActive(bool isOpenSale) public onlyOwner {
        openSale = isOpenSale;
    }

    function setBaseURI(string memory newBaseTokenURI) public onlyOwner {
        baseURI = newBaseTokenURI;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721Upgradeable, IERC721) whenAllowTransfer {
        super.transferFrom(from, to, tokenId);
    }

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
    ) public view override(ERC721Upgradeable) returns (string memory) {
        if (tokenId > tokenIdCounter) {
            revert ERC721NonexistentToken(tokenId);
        }

        return string.concat(baseURI, nftTypeMap[tokenIdTypeMap[tokenId]].uri);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721EnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    receive() external payable {
        if (msg.value > 0) {
            revert("do not send eth to this contract directly");
        }
    }
}
