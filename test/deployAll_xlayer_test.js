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
  // 部署 NFT合约
  console.log("部署FanslandNFT合约");
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, []);
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);

  console.log("增加票型");
  const tx1 = await nft.addNftType(
    "0",
    "Regular Ticket",
    "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/0",
    "1000",
    "0", // 0
    true
  );
  console.log(tx1.hash);

  const tx2 = await nft.addNftType(
    "1",
    "VIP Ticket",
    "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/1",
    "1000",
    "0", // 0
    true
  );
  console.log(tx2.hash);

  const tx3 = await nft.addWhitelists(
    [0, 1],
    [
      "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
      "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
    ],
    [1, 5]
  );

  console.log(tx3.hash);
}

async function mint() {
  let nft = await hre.ethers.getContractAt(
    "FanslandNFT",
    "0xb61c1913ba2bfd685f84a03d6a3bba00db0ad832"
  );

    // const tx3 = await nft.addWhitelists(
    //   [0, 1],
    //   [
    //     "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
    //     "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
    //   ],
    //   [3, 6]
    // );
    // console.log(tx3.hash);

  let tx = await nft.mintBatch(
    "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
    [0, 1],
    [2, 1]
  );
  console.log(tx.hash);
}

// deploy_all().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

mint().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
