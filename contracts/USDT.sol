// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    constructor() ERC20("Test USDT", "USDT") {
        _mint(msg.sender, 10000000 * 10 ** 6);
        _mint(0x70997970C51812dc3A010C7d01b50e0d17dc79C8, 1000000 * 10 ** 6);
        _mint(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC, 100000 * 10 ** 6);
        _mint(0x90F79bf6EB2c4f870365E785982E1f101E93b906, 100000 * 10 ** 6);
        _mint(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65, 100000 * 10 ** 6);
        _mint(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc, 100000 * 10 ** 6);
        _mint(0x976EA74026E726554dB657fA54763abd0C3a0aa9, 100000 * 10 ** 6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
