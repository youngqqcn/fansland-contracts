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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
