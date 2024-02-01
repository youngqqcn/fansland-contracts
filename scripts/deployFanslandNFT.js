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

  let tx = await token.setFansPointContract(
    "0xF011c95cBeDa9075a1034ee391dd26C32c060Faa"
  );
  console.log("tx:", tx);

  //   const r = await token.updatePaymentToken(
  //     "0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e",
  //     true
  //   );
  //   console.log(r.hash);
}

async function deploy_ex() {
  // 部署积分合约
  const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  point = await hre.upgrades.deployProxy(FanslandPoint, []);
  await point.waitForDeployment();
  console.log(`FanslandPoint contract: ${point.target}`);

  // 部署 NFT合约
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, []);
  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  // 设置NFT合约的积分合约
  console.log("设置NFT合约的积分合约");
  let tx = await nft.setFansPointContract(point.target);
  console.log(tx.hash);

  // 设置NFT合约的支付USDT合约
  console.log("设置NFT合约的支付USDT合约");
  const r = await nft.updatePaymentToken(
    // "0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e", // polygon_test
    // "0x5e98CA9b49850650334AfE857D1d568Eb3edF1FA", // bsc_test
    // "0xd972adf456a25673ade530c4b190db0ac1e5de75", // eth_test
    // "0xd972adf456a25673ade530c4b190db0ac1e5de75", // optimism_test
    // "0xd972adf456a25673ade530c4b190db0ac1e5de75", // arbitrum_test
    "0xd972adf456a25673ade530c4b190db0ac1e5de75", // avalanche_test
    true
  );
  console.log(r.hash);

  // 设置积分合约的操作合约
  console.log("设置积分合约的操作合约:");
  const tx1 = await point.setFanslandNftContract(nft.target);
  console.log(tx1.hash);
}

async function fix() {
  // const FanslandNFT =
  let token = await hre.ethers.getContractAt(
    "FanslandNFT",
    // "0xBd207F330CD3fEd7fE7F84D8a69311067e5F293d" // polygon-test
    // "0x97Dc353eB0bc9885850630939E99e4A896b43F75" // bsc-test
    // "0x4E360cF41d53e65c424c9A62f44A7B50eB8e9bC5" // eth-test
    // "0x4E360cF41d53e65c424c9A62f44A7B50eB8e9bC5" // opt-test
    // "0x4E360cF41d53e65c424c9A62f44A7B50eB8e9bC5" // arb-test
    "0x97Dc353eB0bc9885850630939E99e4A896b43F75" // avax-test
  );
  // await token.waitForDeployment();

  console.log(`FanslandNFT contract: ${token.target}`);
  console.log("owner()" + (await token.owner()));

  const r = await token.updatePaymentToken(
    // "0xBF424B16D70942Ee910fB44Db41afEd705F623eb", // polygon-test
    // "0x84A723E865f823D66Efdcd797C6a39fb422921B8", // bsc-test
    // "0x51716F5783Ac7D2E6943232f8691DBA16EdeE186", // eth-test
    // "0x7068E856D7b496E2dABEF79de07B6bBd41d2b556", // opt-test
    // "0x63564E7525985879e7C48B35BF0Be310A9Ba9867", // arb-test
    "0xf3B835E8F58E0a46A4683Fa5CB82CddCC0d5841D", // avax-test
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

  let tx = await token.setFansPointContract(
    "0xF011c95cBeDa9075a1034ee391dd26C32c060Faa"
  );
  console.log("tx:", tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// deploy_ex().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

fix().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// upgrade().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// fix().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// deploy_usdt_and_nft().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
