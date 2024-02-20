// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7#code
interface IERC20Usdt {
    function decimals() external view returns (uint);

    function transferFrom(address _from, address _to, uint _value) external;

    function allowance(
        address owner,
        address spender
    ) external view returns (uint);
}