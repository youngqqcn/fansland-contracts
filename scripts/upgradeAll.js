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
    // "0xBCB16afD0dDD58c849F3521db53De8BE5dd6BEd1", // bsc_UAT
    // "0xBf36aB3AeD81Bf8553B52c61041904d98Ee882C2", // bsc_main_PRO
    // "0x3130c0C931aA3FA07634283Bdf7200adC03C6DfB", // bsc_test

    // "0x2232878Aa2d7C2a975FE12EAA0DAA37b3692d380", // opBNB test
    // "0x41A0bd8aC35FD934453F19183e6622CE0C207F96", // opBNB UAT
    "0xFE37761bD825498A54eAD59573b42020c5B7c139", // opBNB PRO
    FanslandNFT,
    ["Fansland Web3.0 Music Festival 2024", "Fansland"]
  );

  //   let nft = await hre.ethers.getContractAt(
  //     "FanslandNFT",
  //     "0xBf36aB3AeD81Bf8553B52c61041904d98Ee882C2"
  //   );

  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  // let tx1 = await nft.setTypeIdTokenUriTypeMap(0, 100);
  // console.log(tx1.hash);

  //   mySleep(5000);
  //   let tx2 = await nft.updateNftTypeURI(
  //     0,
  //     "ipfs://bafybeiba7edo7urwpqgqypnmumjgj23yp7ws4jtrtytvwrm7ykzs7gowdm/"
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
