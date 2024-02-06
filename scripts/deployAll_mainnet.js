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
  //   const usdt = "0x55d398326f99059ff775485246999027b3197955";
  //   const usdc = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";

  // arbitrum one
  //   const usdt = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
  //   const usdc = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";

  // op
  //   const usdt = "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58";
  //   const usdc = "0x7F5c764cBc14f9669B88837ca1490cCa17c31607";

  // avax
  //   const usdt = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7";
  //   const usdc = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E";
  //// const usdc_e = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664";

  // eth
  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  // 部署积分合约
  console.log("部署FanslandPoint合约");
  const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  point = await hre.upgrades.deployProxy(FanslandPoint, [], {
    timeout: 100000,
    pollingInterval: 1,
  });
  await point.waitForDeployment();

  //   let point = await hre.ethers.getContractAt(
  //     "FanslandPoint",
  //     "0x65F1315e137B3338a2c9141af4fcC77F9De8Db84"
  //   );
  console.log(`FanslandPoint合约: ${point.target}`);
  await mySleep(5000);

  console.log("初始化FanslandPoint合约");
  let tx = await point.init();
  console.log(tx.hash);
  await mySleep(5000);

  //   部署 NFT合约
  console.log("部署FanslandNFT合约");
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, [], {
    timeout: 100000,
    pollingInterval: 1,
  });
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);
  await mySleep(5000);
  //   let nft = await hre.ethers.getContractAt(
  //     "FanslandNFT",
  //     "0x2437C35F5106619f2e4226DC126C240149e569e8"
  //   );

  let tx2 = await nft.init();
  console.log(tx2.hash);
  await mySleep(5000);

  //   设置NFT合约的支付USDT合约;
  console.log("设置NFT合约的支付USDT合约");
  const r1 = await nft.updatePaymentToken(usdt, true);
  console.log(r1.hash);
  await mySleep(5000);

  //   console.log("设置NFT合约的支付USDC合约");
  const r2 = await nft.updatePaymentToken(usdc, true);
  console.log(r2.hash);
  await mySleep(5000);

  //   设置NFT合约的积分合约;
  console.log("设置NFT合约的积分合约");
  let r0 = await nft.setFansPointContract(point.target);
  console.log(r0.hash);
  await mySleep(5000);

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
