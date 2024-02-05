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
//   const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
//   let nft = await hre.upgrades.upgradeProxy(
//     // "0x1898948C0738f552aBF4a6e2aB523a000366eDCD",
//     // "0x1ae803334c2Bd896ea1d80bb5fF2f3500A239E75",
//     // "0x502Dcb70ff92bdf81dFeF82Ae3f2e87d1eD16800",
//     // "0xcBA5E94b5d96E3716149Ae3E2eB3Fc4005fb21F5",
//     // "0xcBA5E94b5d96E3716149Ae3E2eB3Fc4005fb21F5",
//     "0x2232878Aa2d7C2a975FE12EAA0DAA37b3692d380",
//     FanslandNFT,
//     []
//   );
//   await nft.waitForDeployment();
//   console.log(`FanslandNFT contract: ${nft.target}`);

  const FanslandPoint = await hre.ethers.getContractFactory("FanslandPoint");
  let point = await hre.upgrades.upgradeProxy(
    // "0x756a49E314B98e6d750C022a3aB34F8Eddd83e4e",
    // "0x03CF1Bc96FEbb5490c0c9825d434668C5a25692c",
    // "0xcBA5E94b5d96E3716149Ae3E2eB3Fc4005fb21F5",
    // "0xf3B835E8F58E0a46A4683Fa5CB82CddCC0d5841D",
    // "0xf3B835E8F58E0a46A4683Fa5CB82CddCC0d5841D",
    "0x84a2c78fde923b32470037fF094E0e89598E99ab",
    FanslandPoint,
    []
  );
  await point.waitForDeployment();
  console.log(`FanslandPoint contract: ${point.target}`);
}

upgrade_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
