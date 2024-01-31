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

    uint256 public userPointsRewardRate;
    mapping(address => uint256) public superKolRewardRates;
    mapping(address => bool) public superKols;
    uint256 public generalKolRewardRate;
    address public root;
    mapping(address => uint256) public kolInviteSuccessTimes;

    struct Record {
        uint8 typeId; //   typeid: 1: mint, 2: sale , 3: airdrop
        uint256 value;
        uint256 timestamp;
    }
    mapping(uint256 => Record) public recordsMap;
    mapping(address => uint256[]) public recordsIndexs;
    uint256 public totalRecords;

    event Invite(
        address indexed user,
        address indexed inviter,
        uint256 indexed amount
    );

    modifier onlyFanslandNftContract() {
        require(msg.sender == fanslandNftContract, "only banker");
        _;
    }

    modifier whenAllowTransfer() {
        require(allowTransfer, "transfer is not permitted");
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("FanslandPoint", "FPT");
        __Ownable_init(msg.sender);

        userPointsRewardRate = 1000; // 1000%
        generalKolRewardRate = 100; // 100%
        root = address(0);

        // super
        superKols[root] = true;
        superKolRewardRates[root] = 0;
    }


    /// @dev get reward records by page, page start from 0
    function getRewardRecords(
        address addr,
        uint page,
        uint pageSize
    ) public view returns (Record[] memory) {
        require(pageSize > 0, "invalid pageSize");
        uint256[] memory indexes = recordsIndexs[addr];
        uint256 recordsLen = indexes.length;
        uint256 start = page * pageSize;
        uint256 end = start + pageSize > recordsLen
            ? recordsLen
            : start + pageSize;

        Record[] memory result = new Record[](end - start);

        for (uint256 i = start; i < end; i++) {
            result[i - start] = recordsMap[indexes[i]];
        }
        return result;
    }

    /// @dev return the length
    function getAddressRewardRecordsLength(
        address addr
    ) public view returns (uint256) {
        return recordsIndexs[addr].length;
    }

    ///@dev point rewards
    function rewardPoints(
        uint256 usdValue,
        address user,
        address kol
    ) public onlyFanslandNftContract {
        // 1. the kol is super KOL, such as public chain , exchange, media
        // 2. the kol is the holder
        if (superKols[kol] || balanceOf(kol) > 0) {
            // reward user
            uint256 userPoints = 0;
            uint256 kolPoints = 0;
            if (userPointsRewardRate > 0) {
                userPoints = (usdValue * userPointsRewardRate) / 100;
            }

            // reward kol
            uint256 kolRate = superKolRewardRates[kol];
            if (kolRate == 0 && !superKols[kol]) {
                // general kol rewards rate
                kolRate = generalKolRewardRate;
            }
            if (kolRate > 0) {
                kolPoints = (usdValue * kolRate) / 100;
            }

            _reward(user, userPoints, kol, kolPoints);

            // records
            kolInviteSuccessTimes[kol] += 1;
        }
    }

    ///@dev dispatch mint reward
    function _reward(
        address user,
        uint256 userValue,
        address kol,
        uint256 kolValue
    ) internal {
        // reward user for minting
        if (userValue + kolValue > 0) {
            _mint(user, userValue + kolValue);

            // record
            recordsIndexs[user].push(totalRecords);
            recordsMap[totalRecords] = Record(1, userValue, block.timestamp);
            totalRecords += 1;

            if (kolValue > 0) {
                // reward kol for sale
                _transfer(user, kol, kolValue);

                // record
                recordsIndexs[kol].push(totalRecords);
                recordsMap[totalRecords] = Record(2, kolValue, block.timestamp);
                totalRecords += 1;
            }
        }
    }

    /// @dev set kol's points rewards rate
    function updateKolRewardsRates(address kol, uint256 rate) public onlyOwner {
        superKolRewardRates[kol] = rate;
        superKols[kol] = true;
    }

    /// @dev set user points rewards rate
    function setUserPointsRewardRate(uint8 rate) public onlyOwner {
        userPointsRewardRate = rate;
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

    // airdrop
    function airdrop(
        address[] memory addrs,
        uint256[] memory values
    ) public onlyOwner {
        require(addrs.length == values.length, "invalid params");
        for (uint i = 0; i < addrs.length; i++) {
            _mint(addrs[i], values[i]);

            // record
            recordsIndexs[addrs[i]].push(totalRecords);
            recordsMap[totalRecords] = Record(3, values[i], block.timestamp);
            totalRecords += 1;
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
