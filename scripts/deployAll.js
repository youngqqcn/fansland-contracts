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

async function deploy_all() {
  console.log("部署USDT合约");
  const usdt = await hre.ethers.deployContract("USDT");
  await usdt.waitForDeployment();
  console.log(`USDT合约: ${usdt.target}`);
  await mySleep(5000);

  console.log("部署USDC合约");
  const usdc = await hre.ethers.deployContract("USDC");
  await usdc.waitForDeployment();
  console.log(`USDC合约: ${usdc.target}`);
  await mySleep(5000);

  // 部署积分合约
  console.log("部署FanslandPoint合约");
  const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  point = await hre.upgrades.deployProxy(FanslandPoint, []);
  await point.waitForDeployment();
  console.log(`FanslandPoint合约: ${point.target}`);
  await mySleep(5000);

  console.log("初始化FanslandPoint合约");
  let tx = await point.init();
  console.log(tx.hash);
  await mySleep(5000);

  // 部署 NFT合约
  console.log("部署FanslandNFT合约");
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, []);
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);
  await mySleep(5000);

  let tx2 = await nft.init();
  console.log(tx2.hash);
  await mySleep(5000);

  // 设置NFT合约的支付USDT合约
  console.log("设置NFT合约的支付USDT合约");
  const r1 = await nft.updatePaymentToken(usdt.target, true);
  console.log(r1.hash);
  await mySleep(5000);

  console.log("设置NFT合约的支付USDC合约");
  const r2 = await nft.updatePaymentToken(usdc.target, true);
  console.log(r2.hash);
  await mySleep(5000);

  // 设置NFT合约的积分合约
  console.log("设置NFT合约的积分合约");
  let r0 = await nft.setFansPointContract(point.target);
  console.log(r0.hash);
  await mySleep(5000);

  // 设置积分合约的操作合约
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
