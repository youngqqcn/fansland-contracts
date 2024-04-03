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
  nft = await hre.upgrades.deployProxy(FanslandNFT, ["TestNft", "TNT"]);
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);

  //   let nft = await hre.ethers.getContractAt(
  //     "FanslandNFT",
  //     //   "0x583ff68E18E27C612D63B591c54273D65C3cB5ef"
  //     "0x9A977596330e567c35F8Dbcd4d3e1554b3EFF8A9"
  //   );
  //   await nft.waitForDeployment();
  //   console.log(`FanslandNFT contract: ${nft.target}`);

  //   let tx0 = await nft.setDevAddress(
  //     "0x8d39F5882F1F49714612FF06328189aAc9915728"
  //   );
  //   console.log("设置开发者地址：", tx0.hash);
  //   //   return;

  //   console.log("增加票型");
  //   const tx11 = await nft.addNftType(
  //     "0",
  //     "Early Bird 2 Days Ticket(May 4-5)",
  //     "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/0",
  //     "1000",
  //     "990000000000000000", // 0.99
  //     true
  //   );
  //   console.log(tx11.hash);
  //   await mySleep(5000);

  //   const tx2 = await nft.addNftType(
  //     "1",
  //     "Advance 2 Days Ticket(May 4-5)",
  //     "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/1",
  //     "1000",
  //     "1280000000000000000", // 1.28
  //     true
  //   );
  //   console.log(tx2.hash);
  //   await mySleep(5000);

  //   const tx3 = await nft.addNftType(
  //     "2",
  //     "Regular 1 Day Ticket (May 4)",
  //     "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/1",
  //     "1000",
  //     "1280000000000000000", // 1.28
  //     true
  //   );
  //   console.log(tx3.hash);
  //   await mySleep(5000);

  //   const tx4 = await nft.addNftType(
  //     "3",
  //     "Regular 1 Day Ticket (May 5)",
  //     "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/1",
  //     "1000",
  //     "1280000000000000000", // 1.28
  //     true
  //   );
  //   console.log(tx4.hash);
  //   await mySleep(5000);

  //   const tx5 = await nft.addNftType(
  //     "4",
  //     "Regular 2 Days Ticket(May 4-5)",
  //     "ipfs://bafybeif6qumbfl6y75o2gortc4w4f2m5ksjmvypa5zwlgcxec5l4x2r3ya/1",
  //     "1000",
  //     "1690000000000000000", // 1.69
  //     true
  //   );
  //   console.log(tx5.hash);
  //   await mySleep(5000);

  //   console.log("设置收款地址");
  //   const tx1 = await nft.appendTokenRecipients([
  //     "0x02667A747142A4bF6E6C10d6b4C3FA931A1889FB",
  //   ]);
  //   console.log(tx1.hash);

  console.log("设置NFT合约的支付USDT/USDC/ERC20USDT合约");
  const r1 = await nft.updatePaymentTokens(
    [
      "0x55d398326f99059ff775485246999027b3197955", // bsc USDT
      "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // bsc USDC

      //   "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // polygon usdt
      //   "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // polygon usdc
      //   "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // polygon usdc.e
    ],
    [true, true]
  );
  console.log(r1.hash);
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
