// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function deploy() {
  //   const usdt = await hre.ethers.deployContract("USDT");

  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  token = await hre.upgrades.deployProxy(FanslandNFT, []);
//   token = await hre.upgrades.upgradeProxy("0x4325741592F0c7892A1B61F18be6A1f4967bE6f8", FanslandNFT, []);
  await token.waitForDeployment();

  console.log(`FanslandNFT contract: ${token.target}`);

  const r = await token.updatePaymentToken(
    "0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e",
    true
  );
  console.log(r.hash);
}

async function upgrade() {
    //   const usdt = await hre.ethers.deployContract("USDT");

    const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
    // token = await hre.upgrades.deployProxy(FanslandNFT, []);
    token = await hre.upgrades.upgradeProxy("0x1ae803334c2Bd896ea1d80bb5fF2f3500A239E75", FanslandNFT, []);
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
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// upgrade().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });