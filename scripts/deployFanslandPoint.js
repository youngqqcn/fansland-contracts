// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  token = await hre.upgrades.deployProxy(FanslandPoint, []);
  await token.waitForDeployment();

  console.log(`FanslandPoint contract: ${token.target}`);

  const r = await token.setFanslandNftContract(
    "0x1bc55f47140154ce86593f033523Ad701482Ded4"
  );
  console.log(r.hash);

  //   let token = await hre.ethers.getContractAt(
  //     "FanslandPoint",
  //     "0xa81cca5eda3ef0ef7ef225a983341b2af094b09c"
  //   );

  console.log(await token.owner());
}

async function upgrade_fansland_point() {
  const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  token = await hre.upgrades.upgradeProxy(
    "0xf011c95cbeda9075a1034ee391dd26c32c060faa",
    FanslandPoint,
    []
  );
  await token.waitForDeployment();
  console.log(`FanslandPoint contract: ${token.target}`);

  // let tx = await token.setFansPointContract(
  //   "0xF011c95cBeDa9075a1034ee391dd26C32c060Faa"
  // );
  // console.log("tx:", tx);
}

async function set_kol() {
  // const FanslandNFT =
  let token = await hre.ethers.getContractAt(
    "FanslandPoint",
    // "0xc5FFbD7D153e8aEf47245E72182DcAa138081bE2" // polygon_test
    // "0x67D008e6C9f77c9D9830435E080384FC68FB2924" // bsc_test
    // "0xde5cB2d8FE351A8003A30702d52fb231b1cDFc6d" // eth_test
    // "0xde5cB2d8FE351A8003A30702d52fb231b1cDFc6d" // op_test
    // "0xde5cB2d8FE351A8003A30702d52fb231b1cDFc6d" // arb_test
    "0x67D008e6C9f77c9D9830435E080384FC68FB2924" // avax_test
  );

  console.log(`FanslandNFT contract: ${token.target}`);
  console.log("owner()" + (await token.owner()));

  // 设置USDT地址: https://polygonscan.com/token/0xc2132d05d31c914a87c6611c10748aeb04b58e8f
  const r = await token.updateKolRewardsRates(
    "0x0000000000000000000000000000000000000001",
    100 // 10%
  );
  console.log(r.hash);

  const r2 = await token.updateKolRewardsRates(
    "0x0000000000000000000000000000000000000002",
    200 // 20%
  );
  console.log(r2.hash);
  const r3 = await token.updateKolRewardsRates(
    "0x0000000000000000000000000000000000000003",
    300 // 30%
  );
  console.log(r3.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// upgrade_fansland_point().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

set_kol().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
