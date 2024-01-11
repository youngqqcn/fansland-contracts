// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract FanslandNFT is
    Initializable,
    ERC1155Upgradeable,
    ERC1155URIStorageUpgradeable,
    ERC1155PausableUpgradeable,
    OwnableUpgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155SupplyUpgradeable,
    UUPSUpgradeable
{
    // Contract private variables
    string public name;
    string public symbol;
    uint256 public tokenIdCounter;
    bool public isSaleActive;
    uint256 public nftPrice;
    uint256 public maxSupply;
    string public baseURI;
    uint256[] public nftIds;

    /**
     * @dev Emitted when the base URI is changed.
     */
    event UriChanged();

    error SaleNotActive();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function initialize(
        string memory baseTokenURI,
        uint256 maxTokenSupply,
        uint256 tokenPrice
    ) public initializer {
        __ERC1155_init(
           "https://token-cdn-domain/{id}.json"
        );
        __ERC1155URIStorage_init();
        __ERC1155Pausable_init();
        __Ownable_init(msg.sender);
        __ERC1155Burnable_init();

        isSaleActive = true;
        baseTokenURI = baseTokenURI;
        maxSupply = maxTokenSupply;
        nftPrice = tokenPrice;
        symbol = "Fansland";
        name = "Fansland";
    }

    // function initialize() public initializer {
    //     __ERC1155_init(
    //         "ipfs://QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/"
    //     );
    //     __ERC1155URIStorage_init();
    //     __ERC1155Pausable_init();
    //     __Ownable_init(msg.sender);
    //     __ERC1155Burnable_init();

    //     isSaleActive = true;
    //     baseURI = "ipfs://QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo/";
    //     maxSupply = 100000;
    //     nftPrice = 0;
    // symbol = "Fansland";
    // name = "Fansland";
    // }

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
            _mint(to, tokenId + i, 1, ""); // TODO: fix
        }
        tokenIdCounter += quantity;

        // TODO:
        // _setTokenURI(1, "TODO");
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    )
        internal
        override(
            ERC1155PausableUpgradeable,
            ERC1155Upgradeable,
            ERC1155SupplyUpgradeable
        )
    {
        // TODO: more check add here
        return super._update(from, to, ids, values);
    }

    /// @notice Returns a list of all NFT IDs assigned to an address.
    /// @param _owner The owner whose NFTs we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Kitty array looking for cats belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(
        address _owner
    ) public view returns (uint256[] memory, uint256[] memory) {
        uint256 len = nftIds.length;
        uint256[] memory ids = new uint256[](len);
        uint256[] memory balances = new uint256[](len);
        for (uint i = 0; i < len; i++) {
            uint256 id = nftIds[i];
            ids[i] = id;
            balances[i] = balanceOf(_owner, id);
        }

        return (ids, balances);
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

    function uri(
        uint256 id
    )
        public
        view
        override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable)
        returns (string memory)
    {
        return string(abi.encodePacked(baseURI, id));
    }

    function tokenURI(uint256 id) external view returns (string memory) {
        return uri(id);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155Upgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /// @dev set token price
    function setNftPrice(uint256 price) public onlyOwner {
        nftPrice = price;
    }
}
