// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
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
    uint256 public nftPrice;
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
    mapping(uint256 => bool) public typeExists;
    mapping(uint256 => uint256) public tokenIdTypeMap;

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

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize() public initializer {
        __ERC721_init("Fansland", "FANS");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init(msg.sender);
        __ERC721Burnable_init();

        openSale = true;
        baseURI = "https://mynft.com/";
        maxSupply = 100000;
        // nftPrice = 0;

        // TODO: init with some data
        nftTypeMap[0] = NftType({
            id: 0,
            name: "Fansland first NFT",
            uri: "uri/0",
            maxSupply: 10000,
            totalSupply: 0,
            price: 0.001 ether,
            isSaleActive: true
        });
        typeExists[0] = true;
    }

    modifier whenOpenSale() {
        // if (!openSale) {
        // revert OpenSaleNotActive();
        // }
        require(openSale, "Sale must be active to mint NFT");

        _;
    }

    /// @dev update nft type
    function updateNftType(
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
        typeExists[id] = true;
    }

    /// @dev delete nft type
    function removeNftType(uint256 id) public onlyOwner {
        delete nftTypeMap[id];
        typeExists[id] = false;
    }

    /// @dev batch mint
    /// @param typeIds  nft types
    /// @param quantities quantitys
    function mintBatch(
        uint256[] calldata typeIds,
        uint256[] calldata quantities
    ) public payable whenNotPaused whenOpenSale {
        require(typeIds.length == quantities.length, "args length not match");
        for (uint i = 0; i < typeIds.length; i++) {
            _mintNFT(typeIds[i], _msgSender(), quantities[i]);
        }
    }

    /// @dev  batch mint
    function _mintNFT(uint256 typeId, address to, uint256 quantity) internal {
        require(typeExists[typeId], "invalid typeId");

        uint256 tokenId = tokenIdCounter;
        NftType memory nftType = nftTypeMap[typeId];

        (bool okAdd, uint256 resultAdd) = Math.tryAdd(tokenId, quantity);
        require(
            okAdd && resultAdd <= nftType.maxSupply,
            "Purchase would exceed max supply of NFTs"
        );

        (bool okMul, uint256 resultAmount) = Math.tryMul(
            nftType.price,
            quantity
        );
        require(
            okMul && resultAmount <= msg.value,
            "Ether value sent is not correct"
        );
        for (uint i = 0; i < quantity; i++) {
            uint256 curTokenId = tokenId + i;
            _mint(to, curTokenId);

            // set nft type
            tokenIdTypeMap[curTokenId] = typeId;

            // set nft type uri as tokenURI for this tokenId
            _setTokenURI(curTokenId, nftType.uri);

            // emit MintNft event
            emit MintNft(address(0), to, curTokenId, typeId);
        }

        tokenIdTypeMap[typeId] += quantity;
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
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

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
    function pause() public onlyOwner {
        _pause();
    }

    /// @dev This method should be invoked from WEB3 from owner's account to UNPAUSE the smart contract
    function unpause() public onlyOwner {
        _unpause();
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

    /// @dev set token price
    function setNftPrice(uint256 price) public onlyOwner {
        nftPrice = price;
    }
}
