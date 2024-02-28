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
  //   await mySleep(5000);

  console.log("部署USDC合约");
  const usdc = await hre.ethers.deployContract("USDC");
  await usdc.waitForDeployment();
  console.log(`USDC合约: ${usdc.target}`);
  await mySleep(5000);

  console.log("部署Eer20USDT合约");
  const erc20Usdt = await hre.ethers.deployContract("TetherToken");
  await erc20Usdt.waitForDeployment();
  console.log(`Erc20 USDT合约: ${erc20Usdt.target}`);
  await mySleep(5000);

  // 部署 NFT合约
  console.log("部署FanslandNFT合约");
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, []);
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);

  console.log("增加票型");
  const tx1 = await nft.addNftType(
    "0",
    "Fansland Type 0",
    "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/0",
    "1000",
    "100000000000000000", // 0.1
    true
  );
  console.log(tx1.hash);

  const tx2 = await nft.addNftType(
    "1",
    "Fansland Type 1",
    "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/1",
    "1000",
    "1000000000000000000", // 1
    true
  );
  console.log(tx2.hash);

  console.log("设置收款地址");
  nft.appendTokenRecipients([
    "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
    "0x624C87ab2ccb5cB8fA3054984a9B3F6b97017751",
    "0x274848a43f6afdDEed6623FB45c8B3e369936B5E",
  ]);

  console.log("设置NFT合约的支付USDT/USDC/ERC20USDT合约");
  const r1 = await nft.updatePaymentTokens(
    [
      usdt.target, //"0x13879eE6f8D1422e177fC9CE90b77288B0db9fD8",
      usdc.target, //"0xA318E7E95E0925a7f84e038895b0E5bDD641f63E",
      erc20Usdt.target, //"0x6F5732407FDAB0315E2F700fAa252ccAD5639EE4",
    ],
    [true, true, true]
  );
  console.log(r1.hash);
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
