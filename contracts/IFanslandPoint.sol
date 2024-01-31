// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFanslandPoint {
    function decimals() external pure returns (uint8);

    function fanslandNftContract() external pure returns (address);

    function rewardPoints(uint256 usdValue, address user, address kol) external;
}
