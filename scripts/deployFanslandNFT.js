// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deploy_usdt_and_nft() {
  const usdt = await hre.ethers.deployContract("USDT");
  await usdt.waitForDeployment();

  console.log(`USDT contract: ${usdt.target}`);

  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  token = await hre.upgrades.deployProxy(FanslandNFT, []);
  await token.waitForDeployment();

  console.log(`FanslandNFT contract: ${token.target}`);

  const r = await token.updatePaymentToken(usdt.target, true);
  console.log(r.hash);
}

async function deploy() {
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  token = await hre.upgrades.deployProxy(FanslandNFT, []);
  await token.waitForDeployment();

  console.log(`FanslandNFT contract: ${token.target}`);

  const r = await token.updatePaymentToken(
    "0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e",
    true
  );
  console.log(r.hash);
}

async function fix() {
  // const FanslandNFT =
  let token = await hre.ethers.getContractAt(
    "FanslandNFT",
    "0x8251D9B3a30c5c96391C5bCF7f531C227BEfDe2d"
  );
  // await token.waitForDeployment();

  console.log(`FanslandNFT contract: ${token.target}`);

  console.log("owner()" + (await token.owner()));

  // 设置USDT地址: https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f
  const r = await token.updatePaymentToken(
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    true
  );
  console.log(r.hash);
}

async function upgrade() {
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  token = await hre.upgrades.upgradeProxy(
    "0x1bc55f47140154ce86593f033523Ad701482Ded4",
    FanslandNFT,
    []
  );
  await token.waitForDeployment();

  console.log(`FanslandNFT contract: ${token.target}`);

  // const r = await token.updatePaymentToken(
  //   "0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e",
  //   true
  // );
  // console.log(r.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// deploy().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// upgrade().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });

// fix().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

deploy_usdt_and_nft().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
