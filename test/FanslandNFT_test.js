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
    "0xb223E9b09F1Ebf7abd904B89a7794D9481c4B08B" // mumbai
    // "0xd43C9799288311356aF329f3cBeB4Aa015cC5cEd" // bsc_test
  );

  let tx0 = await nft.setDevAddress(
    "0xDEe74737Aa7C9E75cc782419D97DE18Eb2918e81"
  );
  console.log(tx0.hash);

  //   let erc20_usdt = await hre.ethers.getContractAt(
  //     "TetherToken",
  //     // "0x6F5732407FDAB0315E2F700fAa252ccAD5639EE4" // mumbai
  //     "0xc5FFbD7D153e8aEf47245E72182DcAa138081bE2" // bsc_test
  //   );

  //   let usdt = await hre.ethers.getContractAt(
  //     "USDT",
  //     // "0x13879eE6f8D1422e177fC9CE90b77288B0db9fD8" // mumbai
  //     "0x2Ea1019AEb6d3aFC41d2AbfA54DF2e1B91a359Fc" // bsc_test
  //   );
  //   let usdc = await hre.ethers.getContractAt(
  //     "USDC",
  //     // "0xA318E7E95E0925a7f84e038895b0E5bDD641f63E" // mumbai
  //     "0xba3eF55E09f5Fb397ce4D05fe5499D3dA228e016" // bsc_test
  //   );

  //   let tx0 = await erc20_usdt.approve(nft.target, "1000000000");
  //   console.log(tx0.hash);

  //   let tx1 = await usdt.approve(nft.target, "1000000000");
  //   console.log(tx1.hash);

  //   let tx2 = await usdc.approve(nft.target, "1000000000");
  //   console.log(tx2.hash);
  //     return

  //   let tx3 = await nft.mintBatch(
  //     usdt.target,
  //     [0, 1],
  //     [1, 1],
  //     // "0x0000000000000000000000000000000000000000"
  //     // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8"
  //     "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  //   );
  //   console.log(tx3.hash);

  //   let tx4 = await nft.mintBatch(
  //     erc20_usdt.target,
  //     [0, 1],
  //     [1, 1],
  //     //   "0x0000000000000000000000000000000000000000"
  //     // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8"
  //     "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  //   );
  //   console.log(tx4.hash);

  //   let tx5 = await nft.mintBatch(
  //     usdc.target,
  //     [0, 1],
  //     [1, 1],
  //     // "0x0000000000000000000000000000000000000000"
  //     // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8"
  //     "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  //   );
  //   console.log(tx5.hash);

  //   let tx6 = await nft.redeemAirdrop(
  //     0,
  //     90001,
  //     "0x274848a43f6afdDEed6623FB45c8B3e369936B5E"
  //   );
  //   console.log(tx6.hash);

  // let ret = await nft.tokensOfOwner("0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8");
  // console.log(ret);
}

test_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
