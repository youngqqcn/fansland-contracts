// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
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
    UUPSUpgradeable
{
    // using Math for uint256;

    // Contract private variables
    uint256 public tokenIdCounter;
    bool public isSaleActive;
    uint256 public nftPrice;
    uint256 public maxSupply;
    string public baseURI;

    /**
     * @dev Emitted when the base URI is changed.
     */
    event UriChanged();

    error SaleNotActive();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize() public initializer {
        __ERC721_init("Fansland", "Fansland");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init(msg.sender);
        __ERC721Burnable_init();

        isSaleActive = true;
        baseURI = "ipfs://QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/";
        maxSupply = 100000;
        nftPrice = 0;
    }

    modifier whenSaleActive() {
        // require(isSaleActive, "Sale must be active to mint NFT");
        if (!isSaleActive) {
            revert SaleNotActive();
        }
        _;
    }

    /// @dev This method should be invoked from web3 for minting a new NFT
    function mint() public payable whenNotPaused whenSaleActive {
        _mintNFT(msg.sender, 1);
    }

    /// @dev batch mint
    function mintBatch(
        address to,
        uint256 quantity
    ) public payable whenNotPaused whenSaleActive {
        _mintNFT(to, quantity);
    }

    /// @dev  batch mint
    function _mintNFT(address to, uint256 quantity) internal {
        uint256 tokenId = tokenIdCounter;
        (bool overflowsAdd, uint256 resultAdd) = Math.tryAdd(tokenId, quantity);
        require(
            !overflowsAdd && resultAdd <= maxSupply,
            "Purchase would exceed max supply of NFTs"
        );

        (bool overflowsMul, uint256 resultAmount) = Math.tryMul(
            nftPrice,
            quantity
        );
        require(
            !overflowsMul && resultAmount <= msg.value,
            "Ether value sent is not correct"
        );
        for (uint i = 0; i < quantity; i++) {
            _mint(to, tokenId + i);
        }
        tokenIdCounter += quantity;


        // TODO:
        // _setTokenURI(1, "TODO");
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

    /// @param isActive Sale status param.
    /// @dev This method should be invoked from WEB3 for setting sale active status
    function setSaleActive(bool isActive) public onlyOwner {
        isSaleActive = isActive;
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
        return super.tokenURI(tokenId);
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
