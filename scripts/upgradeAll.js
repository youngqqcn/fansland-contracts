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

async function upgrade_all() {
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  let nft = await hre.upgrades.upgradeProxy(
    "0x89E1e3a55A198485B8B9f37D244a0E8498e961d4",
    FanslandNFT,
    []
  );
  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);
}

upgrade_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
