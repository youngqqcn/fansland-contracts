// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract FanslandPoint is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address public fanslandNftContract;
    bool public allowTransfer;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("FanslandPoint", "FPT");
        __Ownable_init(msg.sender);
    }

    modifier onlyFanslandNftContract() {
        require(msg.sender == fanslandNftContract, "only banker");
        _;
    }

    modifier whenAllowTransfer() {
        require(allowTransfer, "transfer is not permitted");
        _;
    }

    function setAllowTransfer(bool allow) public onlyOwner {
        allowTransfer = allow;
    }

    function setFanslandNftContract(address nft) public onlyOwner {
        fanslandNftContract = nft;
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // mint reward
    function reward(address to, uint256 value) public onlyFanslandNftContract {
        _mint(to, value);
    }

    // airdrop
    function airdrop(
        address[] memory addrs,
        uint256[] memory values
    ) public onlyOwner {
        require(addrs.length == values.length, "invalid params");
        for (uint i = 0; i < addrs.length; i++) {
            _mint(addrs[i], values[i]);
        }
    }

    function transfer(
        address to,
        uint256 value
    ) public override whenAllowTransfer returns (bool) {
        address _owner = _msgSender();
        _transfer(_owner, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public override whenAllowTransfer returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override {}
}
