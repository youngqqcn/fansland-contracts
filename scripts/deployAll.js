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
//   console.log("部署USDT合约");
//   const usdt = await hre.ethers.deployContract("USDT");
//   await usdt.waitForDeployment();
//   console.log(`USDT合约: ${usdt.target}`);
//   //   await mySleep(5000);

//   console.log("部署USDC合约");
//   const usdc = await hre.ethers.deployContract("USDC");
//   await usdc.waitForDeployment();
//   console.log(`USDC合约: ${usdc.target}`);
  //   await mySleep(5000);

  //   console.log("部署Eer20USDT合约");
  //   const erc20Usdt = await hre.ethers.deployContract("TetherToken");
  //   await erc20Usdt.waitForDeployment();
  //   console.log(`Erc20 USDT合约: ${erc20Usdt.target}`);
  //   await mySleep(5000);

  // 部署 NFT合约
  console.log("部署FanslandNFT合约");
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, []);
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);
  //   await mySleep(5000);

  let tx2 = await nft.init();
  console.log(tx2.hash);
  //   await mySleep(5000);

  // 设置NFT合约的支付USDT合约
  console.log("设置NFT合约的支付USDT/USDC/ERC20USDT合约");
  const r1 = await nft.updatePaymentToken(
    // [usdt.target, usdc.target, "0x6F5732407FDAB0315E2F700fAa252ccAD5639EE4"],
    ["0x13879eE6f8D1422e177fC9CE90b77288B0db9fD8", "0xA318E7E95E0925a7f84e038895b0E5bDD641f63E", "0x6F5732407FDAB0315E2F700fAa252ccAD5639EE4"],
    [true, true, true]
  );
  console.log(r1.hash);
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
