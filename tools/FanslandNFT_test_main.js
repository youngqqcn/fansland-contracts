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
    // "0xEC974e150205d52F626622e2422203D940d63F86" // polygon
    "0xf310C3f033AFe83038590c7671D4F0b3F8325850" // bsc_main
  );

  //   let erc20_usdt = await hre.ethers.getContractAt(
  //     "USDT",
  //     "" // polygon
  //     // "" // bsc_main
  //   );

  let usdt = await hre.ethers.getContractAt(
    "USDT",
    // "0xc2132d05d31c914a87c6611c10748aeb04b58e8f" // polygon

    "0x55d398326f99059ff775485246999027b3197955" // bsc_main
    // "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // bsc_main usdc
  );
  //   let usdc = await hre.ethers.getContractAt(
  //     "USDC",
  //     "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // polygon
  //     // "" // bsc_main
  //   );

  // let tx1 = await usdt.approve(nft.target, "1099999999998900000");
  // console.log(tx1.hash);

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
}

test_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
