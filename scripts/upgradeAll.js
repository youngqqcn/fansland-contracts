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
    "0x2033Fa536723A1c2080a183D9D3D412bD2cd78d4", // polygon_test
    // "0xD1be31D2dDd5F9A64f40f7453A5ead3aE34A247d", // bsc_test
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
