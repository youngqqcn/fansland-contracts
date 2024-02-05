// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
// const { Upgrades } = require("@openzeppelin/upgrades");
// const { getProxyFactory } = Upgrades;

function mySleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function deploy_all() {
  console.log("部署USDT合约");
  // polygon
  //   const usdt = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  //   const usdc = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

  // bsc
  const usdt = "0x55d398326f99059ff775485246999027b3197955";
  const usdc = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

  // 部署积分合约
  console.log("部署FanslandPoint合约");
  //   const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  //   point = await hre.upgrades.deployProxy(FanslandPoint, [], {
  //     timeout: 100000,
  //     pollingInterval: 1,
  //   });
  //   await point.waitForDeployment();

  let point = await hre.ethers.getContractAt(
    "FanslandPoint",
    "0x65F1315e137B3338a2c9141af4fcC77F9De8Db84"
  );
  console.log(`FanslandPoint合约: ${point.target}`);
  await mySleep(5000);

  console.log("初始化FanslandPoint合约");
  //   let tx = await point.init();
  //   console.log(tx.hash);
  //   await mySleep(5000);

  //   部署 NFT合约
  //   console.log("部署FanslandNFT合约");
  //   const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  //   nft = await hre.upgrades.deployProxy(FanslandNFT, [], {
  //     timeout: 100000,
  //     pollingInterval: 1,
  //   });
  //   await nft.waitForDeployment();
  //   console.log(`FanslandNFT合约: ${nft.target}`);
  let nft = await hre.ethers.getContractAt(
    "FanslandNFT",
    "0x2437C35F5106619f2e4226DC126C240149e569e8"
  );
  await mySleep(5000);

  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);
  await mySleep(5000);

  //   let tx2 = await nft.init();
  //   console.log(tx2.hash);
  //   await mySleep(5000);

  //   设置NFT合约的支付USDT合约;
  //   console.log("设置NFT合约的支付USDT合约");
  //   const r1 = await nft.updatePaymentToken(usdt, true);
  //   console.log(r1.hash);
  //   await mySleep(5000);

  //   console.log("设置NFT合约的支付USDC合约");
  //   const r2 = await nft.updatePaymentToken(usdc, true);
  //   console.log(r2.hash);
  //   await mySleep(5000);

  //   设置NFT合约的积分合约;
//   console.log("设置NFT合约的积分合约");
//   let r0 = await nft.setFansPointContract(point.target);
//   console.log(r0.hash);
//   await mySleep(5000);

  //   设置积分合约的操作合约;
  console.log("设置积分合约的操作合约:");
  const tx1 = await point.setFanslandNftContract(nft.target);
  console.log(tx1.hash);
  await mySleep(5000);

  // 设置KOL
  //   console.log("设置KOL邀请积分返拥比例");
  //   let tx3 = await point.setKolsRewardsRates(
  //     [
  //       "0x0000000000000000000000000000000000000001",
  //       "0x0000000000000000000000000000000000000002",
  //       "0x0000000000000000000000000000000000000003",
  //       "0x0000000000000000000000000000000000000004",
  //       "0x875C60A2bA16E738A4F4a0175Fcdc0335fc68728",
  //     ],
  //     [
  //       100, // 10%
  //       200,
  //       300,
  //       400, // 40%
  //       200,
  //     ]
  //   );

  //   console.log(tx3.hash);
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
