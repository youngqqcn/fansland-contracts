// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract FanslandNFT is
    Initializable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;
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
    uint256[] public nftTypeIds;
    mapping(uint256 => uint256) public tokenIdTypeMap;
    mapping(address => bool) paymentTokensMap;

    address[] _tokenReceivers;

    // https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7#code
    address private ethErc20Usdt;

    event MintNft(
        address indexed user,
        address indexed kol,
        uint256 totalUsdx1000,
        uint256 timestamp
    );

    modifier whenOpenSale() {
        require(openSale, "Not on sale");
        _;
    }

    modifier whenAllowTransfer() {
        require(allowTransfer, "Transfer is not permitted");
        _;
    }

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
        allowTransfer = true;
        openSale = true;
        baseURI = "";
    }

    function getNftTypeTypeIds() public view returns (uint256[] memory) {
        return nftTypeIds;
    }

    function updateAllowTransfer(bool status) public onlyOwner {
        allowTransfer = status;
    }

    function updatePaymentToken(
        address[] calldata tokens,
        bool[] calldata actives
    ) public onlyOwner {
        require(tokens.length == actives.length, "invalid arguments");
        for (uint n = 0; n < tokens.length; n++) {
            paymentTokensMap[tokens[n]] = actives[n];
        }
    }

    function addNftType(
        uint8 id,
        string memory typeName,
        string memory uri,
        uint256 maxSupply,
        uint256 price,
        bool saleActive
    ) public onlyOwner {
        require(
            maxSupply > 0 && bytes(typeName).length > 0,
            "Invalid parameters"
        );
        require(
            nftTypeMap[id].maxSupply == 0 &&
                bytes(nftTypeMap[id].name).length == 0,
            "Id already exists"
        );

        nftTypeMap[id] = NftType({
            id: id,
            name: typeName,
            uri: uri,
            maxSupply: maxSupply,
            totalSupply: 0,
            price: price,
            isSaleActive: saleActive
        });
    }

    function updateNftTypeURI(uint8 id, string memory uri) public onlyOwner {
        nftTypeMap[id].uri = uri;
    }

    function updateNftTypeName(
        uint8 id,
        string memory typeName
    ) public onlyOwner {
        require(bytes(typeName).length > 0, "Invalid typeName");
        nftTypeMap[id].name = typeName;
    }

    function updateNftTypeMaxSupply(
        uint8 id,
        uint256 maxSupply
    ) public onlyOwner {
        require(
            maxSupply > 0 && maxSupply >= nftTypeMap[id].totalSupply,
            "Invalid maxSupply"
        );
        nftTypeMap[id].maxSupply = maxSupply;
    }

    function updateNftTypeSaleActive(uint8 id, bool sale) public onlyOwner {
        nftTypeMap[id].isSaleActive = sale;
    }

    function updateNftTypePrice(uint8 id, uint256 price) public onlyOwner {
        require(price > 0 && price < 100_000_000 ether);
        nftTypeMap[id].price = price;
    }

    function _isEthErc20Usdt(address payToken) internal view returns (bool) {
        return address(payToken) == address(ethErc20Usdt);
    }

    function calculateTotal(
        address payToken,
        uint256[] calldata typeIds,
        uint256[] calldata quantities
    ) public view returns (uint256) {
        require(typeIds.length == quantities.length, "Invalid parameters");
        require(paymentTokensMap[payToken], "Invalid payment token");

        uint256 totalPrice = 0;
        for (uint i = 0; i < typeIds.length; i++) {
            uint256 typeId = typeIds[i];
            require(nftTypeMap[typeId].maxSupply > 0, "Unavailable NFT type");

            bool ok = false;
            uint256 result = 0;
            (ok, result) = Math.tryAdd(
                nftTypeMap[typeId].totalSupply,
                quantities[i]
            );
            require(ok, "Quantity overflow");
            require(
                nftTypeMap[typeId].maxSupply >= result,
                "Exceed max supply of this type"
            );

            (ok, result) = Math.tryMul(nftTypeMap[typeId].price, quantities[i]);
            require(ok, "Mul overflow");

            (ok, result) = Math.tryAdd(result, totalPrice);
            require(ok, "TotalPrice overflow");

            totalPrice = result;
        }

        // convert decimals
        bool okDiv = false;
        uint256 tokenAmount = 0;
        (okDiv, tokenAmount) = Math.tryDiv(
            totalPrice,
            10 ** (18 - IERC20Metadata(payToken).decimals())
        );
        require(okDiv, "Div overflow");

        return tokenAmount;
    }

    function mintBatch(
        address payToken,
        uint256[] calldata typeIds,
        uint256[] calldata quantities,
        address kol
    ) public whenOpenSale {
        uint256 tokenAmount = calculateTotal(payToken, typeIds, quantities);
        address user = _msgSender();

        address tokenReceiver = owner();
        if (_tokenReceivers.length > 0) {
            tokenReceiver = _tokenReceivers[
                (tokenAmount + uint256(uint160(user)) + tokenIdCounter) %
                    _tokenReceivers.length
            ];
        }

        IERC20 erc20Token = IERC20(payToken);

        require(
            erc20Token.allowance(user, address(this)) >= tokenAmount,
            "Allowance token is not enough"
        );
        erc20Token.safeTransferFrom(user, tokenReceiver, tokenAmount);

        for (uint i = 0; i < typeIds.length; i++) {
            _mintNFT(typeIds[i], user, quantities[i]);
        }

        // point rewards
        (bool ok, uint256 usdPricex1000) = Math.tryDiv(
            tokenAmount * 1000,
            10 ** uint256(IERC20Metadata(payToken).decimals())
        );
        if (ok) {
            emit MintNft(user, kol, usdPricex1000, block.timestamp);
        }
    }

    function _mintNFT(uint256 typeId, address to, uint256 quantity) internal {
        uint256 tokenId = tokenIdCounter;
        NftType memory nftType = nftTypeMap[typeId];
        require(nftType.isSaleActive, "not open sale ticket");
        for (uint i = 0; i < quantity; i++) {
            uint256 curTokenId = tokenId + i;
            _safeMint(to, curTokenId);

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
