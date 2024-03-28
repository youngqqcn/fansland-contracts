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
    // "0x2033Fa536723A1c2080a183D9D3D412bD2cd78d4", // polygon_test
    // "0xD1be31D2dDd5F9A64f40f7453A5ead3aE34A247d", // bsc_test
    // "0xf310C3f033AFe83038590c7671D4F0b3F8325850", // bsc_main_UAT
    //   "0xBf36aB3AeD81Bf8553B52c61041904d98Ee882C2", // bsc_main_PRO
    // "0xd43C9799288311356aF329f3cBeB4Aa015cC5cEd",
    // "0xb223E9b09F1Ebf7abd904B89a7794D9481c4B08B",
    FanslandNFT,
    []
  );

  //   let nft = await hre.ethers.getContractAt(
  //     "FanslandNFT",
  //     "0xBf36aB3AeD81Bf8553B52c61041904d98Ee882C2"
  //   );

  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  //   let tx1 = await nft.setTypeIdTokenUriTypeMap(0, 100);
  //   console.log(tx1.hash);

  //   mySleep(5000);
  //   let tx2 = await nft.updateNftTypeURI(
  //     0,
  //     "ipfs://bafybeidu7nmjce2g5f2wmytv2gp7nmitryswev2jesu74jvxxgaxknsapy/"
  //   );
  //   console.log(tx2.hash);

  //   mySleep(5000);
  //   let r = await nft.tokenURI(0);
  //   console.log(r);
}

upgrade_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
