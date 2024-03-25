// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract FanslandNFT is
    Initializable,
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IERC20;

    struct NftType {
        uint256 id;
        string name;
        string uri;
        uint256 maxSupply;
        uint256 totalSupply;
        uint256 price;
        bool isSaleActive;
    }

    bool public openSale;
    string public baseURI;
    bool public allowTransfer;

    mapping(uint256 => NftType) public nftTypeMap;
    uint256[] public nftTypeIds;
    mapping(uint256 => uint256) public tokenIdTypeMap;
    address[] public tokenRecipients;

    struct Whitelist {
        uint256 mintedCounts; // the minted count of this type
        uint256 maxCounts; // the max count of of this type
    }

    mapping(uint256 => mapping(address => Whitelist)) whitelists;

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
        __ERC721_init("X Layer", "X Layer");
        __ERC721Enumerable_init();
        __ReentrancyGuard_init();
        __Ownable_init(msg.sender);

        allowTransfer = true;
        openSale = true;
        baseURI = "";
        nftTypeIds = new uint256[](0);
        tokenRecipients = new address[](0);
    }

    function addWhitelists(
        uint256[] memory typeIds,
        address[] memory addrs,
        uint256[] memory counts
    ) public onlyOwner {
        require(
            typeIds.length == addrs.length && addrs.length == counts.length,
            "invalid args"
        );

        for (uint i = 0; i < addrs.length; i++) {
            Whitelist memory old = whitelists[typeIds[i]][addrs[i]];
            require(
                counts[i] >= old.mintedCounts,
                "new max count must GE than minted count"
            );
            whitelists[typeIds[i]][addrs[i]] = Whitelist(
                old.mintedCounts,
                counts[i]
            );
        }
    }

    function getNftTypeTypeIds() public view returns (uint256[] memory) {
        return nftTypeIds;
    }

    function updateAllowTransfer(bool status) public onlyOwner {
        allowTransfer = status;
    }

    function _checkTypeIdExists(uint256 id) internal view returns (bool) {
        for (uint i = 0; i < nftTypeIds.length; i++) {
            if (id == nftTypeIds[i]) {
                return true;
            }
        }
        return false;
    }

    function addNftType(
        uint256 id,
        string memory typeName,
        string memory uri,
        uint256 maxSupply,
        uint256 price,
        bool saleActive
    ) public onlyOwner {
        require(!_checkTypeIdExists(id), "Id already exists");
        require(
            maxSupply > 0 && bytes(typeName).length > 0,
            "Invalid parameters"
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
        nftTypeIds.push(id);
    }

    function updateNftTypeURI(uint8 id, string memory uri) public onlyOwner {
        require(_checkTypeIdExists(id), "Id not exists");
        nftTypeMap[id].uri = uri;
    }

    function updateNftTypeName(
        uint8 id,
        string memory typeName
    ) public onlyOwner {
        require(_checkTypeIdExists(id), "Id not exists");
        require(bytes(typeName).length > 0, "Invalid typeName");
        nftTypeMap[id].name = typeName;
    }

    function updateNftTypeMaxSupply(
        uint8 id,
        uint256 maxSupply
    ) public onlyOwner {
        require(_checkTypeIdExists(id), "Id not exists");
        require(
            maxSupply > 0 && maxSupply >= nftTypeMap[id].totalSupply,
            "Invalid maxSupply"
        );
        nftTypeMap[id].maxSupply = maxSupply;
    }

    function updateNftTypeSaleActive(uint8 id, bool sale) public onlyOwner {
        require(_checkTypeIdExists(id), "Id not exists");
        nftTypeMap[id].isSaleActive = sale;
    }

    function updateNftTypePrice(uint8 id, uint256 price) public onlyOwner {
        require(_checkTypeIdExists(id), "Id not exists");
        require(price > 0 && price < 100_000_000 ether);
        nftTypeMap[id].price = price;
    }

    function mintBatch(
        address recipient,
        uint256[] calldata typeIds,
        uint256[] calldata quantities
    ) public whenOpenSale nonReentrant {
        require(typeIds.length == quantities.length, "invalid arguments");

        if (recipient == address(0x0)) {
            recipient = _msgSender();
        }

        for (uint i = 0; i < typeIds.length; i++) {
            // whitelist check
            Whitelist memory w = whitelists[typeIds[i]][_msgSender()];
            require(
                w.mintedCounts + quantities[i] <= w.maxCounts,
                "out of limit count"
            );

            _mintNFT(typeIds[i], recipient, quantities[i]);

            whitelists[typeIds[i]][_msgSender()] = Whitelist(
                w.mintedCounts + quantities[i],
                w.maxCounts
            );
        }
    }

    function _mintNFT(uint256 typeId, address to, uint256 quantity) private {
        require(_checkTypeIdExists(typeId), "Id not exists");

        uint256 tokenId = totalSupply();
        NftType memory nftType = nftTypeMap[typeId];
        require(nftType.isSaleActive, "Not on sale");
        for (uint i = 0; i < quantity; i++) {
            uint256 curTokenId = tokenId + i;
            _safeMint(to, curTokenId);
            tokenIdTypeMap[curTokenId] = typeId;
        }

        nftTypeMap[typeId].totalSupply += quantity;
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721EnumerableUpgradeable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function tokensOfOwner(
        address _owner
    ) public view returns (uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);

            for (uint256 index = 0; index < tokenCount; index++) {
                result[index] = tokenOfOwnerByIndex(_owner, index);
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
        if (tokenId >= totalSupply()) {
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
            revert("DO NOT deposit");
        }
    }
}
