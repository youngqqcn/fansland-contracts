// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

function mySleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test_all() {
  // 部署 NFT合约
  console.log("开始测试FanslandNFT合约mintBatch");

  let nft = await hre.ethers.getContractAt(
    "FanslandNFT",
    "0x2033Fa536723A1c2080a183D9D3D412bD2cd78d4" // mumbai
    // "0xD1be31D2dDd5F9A64f40f7453A5ead3aE34A247d" // bsc_test
  );

  let erc20_usdt = await hre.ethers.getContractAt(
    "TetherToken",
    "0x6F5732407FDAB0315E2F700fAa252ccAD5639EE4" // mumbai
    // "0xF28306eb22F757Ab913fc47910276a5bcF8f88eC" // bsc_test
  );

  let usdt = await hre.ethers.getContractAt(
    "USDT",
    "0x13879eE6f8D1422e177fC9CE90b77288B0db9fD8" // mumbai
    // "0x8c9Bddcc57B8FF582690538327092Bf12937AE73" // bsc_test
  );
  let usdc = await hre.ethers.getContractAt(
    "USDC",
    "0xA318E7E95E0925a7f84e038895b0E5bDD641f63E" // mumbai
    // "0xA4533E4d7B685217D24444De3725041aDdfaf421" // bsc_test
  );

  //   let tx0 = await erc20_usdt.approve(nft.target, "1000000000");
  //   console.log(tx0.hash);

  //   let tx1 = await usdt.approve(nft.target, "1000000000");
  //   console.log(tx1.hash);

  //   let tx2 = await usdc.approve(nft.target, "1000000000");
  //   console.log(tx2.hash);

  let tx3 = await nft.mintBatch(
    usdt.target,
    [0, 1],
    [1, 1],
    // "0x0000000000000000000000000000000000000000"
    // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8"
    "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  );
  console.log(tx3.hash);

  let tx4 = await nft.mintBatch(
    erc20_usdt.target,
    [0, 1],
    [1, 1],
    //   "0x0000000000000000000000000000000000000000"
    // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8"
    "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  );
  console.log(tx4.hash);

  let tx5 = await nft.mintBatch(
    usdc.target,
    [0, 1],
    [1, 1],
    // "0x0000000000000000000000000000000000000000"
    // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8"
    "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  );
  console.log(tx5.hash);
}

test_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
