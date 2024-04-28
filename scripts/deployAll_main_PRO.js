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
  //   console.log("部署FanslandNFT合约");
  //   const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  //   nft = await hre.upgrades.deployProxy(FanslandNFT, [
  //     "Fansland Web3.0 Music Festival 2024",
  //     "Fansland",
  //   ]);
  //   await nft.waitForDeployment();
  //   console.log(`FanslandNFT合约: ${nft.target}`);

  let nft = await hre.ethers.getContractAt(
    "FanslandNFT",
    // "0xFE37761bD825498A54eAD59573b42020c5B7c139"  // opBNB pro
    "0xbf36ab3aed81bf8553b52c61041904d98ee882c2" // bsc pro
  );
  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  //   if (true) {
  //     let tx0 = await nft.setDevAddress(
  //       "0x7691cd47462D7659e69DAD7561878e2A31b41cfB"
  //     );
  //     console.log("设置开发者地址：", tx0.hash);
  //   }

  let tx = await nft.kolAirdrop(
    [
      "0x1872fb82d0b809779a976d3cf283dbc2cfa840cb",
      "0x0a94f278a4b97dea39ad5e22314008112c29dd42",
      "0x8378f16DAd92B8aDe9024A2FE692a1F08beA6A6F",
    ],
    [18, 19, 20]
  );
  console.log(tx.hash);

  //   console.log("增加票型");
  //   if (true) {
  //     let tx = await nft.updateNftTypeName(0, "Early Bird 2-Day Ticket(4-5 May)");
  //     console.log(tx.hash);
  //   }

  //   if (true) {
  //     const tx1 = await nft.addNftType(
  //       "0",
  //       "Early Bird 2-Day Ticket(4-5 May)",
  //       "ipfs://bafybeiba7edo7urwpqgqypnmumjgj23yp7ws4jtrtytvwrm7ykzs7gowdm/",
  //       "1000", // 1000
  //       "99000000000000000000", // 99 USD
  //       true
  //     );
  //     console.log(tx1.hash);
  //   }

  // 新增票型
  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1000",
  //       "Queen Package(4-5 May)",
  //       "",
  //       "10",
  //       "100000000000000000000000", // 100000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }
  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1001",
  //       "Queen Package(5 May)",
  //       "",
  //       "10",
  //       "60000000000000000000000", // 60000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1001",
  //       "Queen Package(4 May)",
  //       "",
  //       "10",
  //       "60000000000000000000000", // 60000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "7",
  //       "Fansland X HPOS10I(4-5 May)",
  //       "",
  //       "100",
  //       "169000000000000000000", // 169
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "8",
  //       "Fansland X IOST(4-5 May)",
  //       "",
  //       "50",
  //       "169000000000000000000", // 169
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "9",
  //       "Fansland X Hape(4-5 May)",
  //       "",
  //       "50",
  //       "169000000000000000000", // 169
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "10",
  //       "Fansland X NFTGo(4-5 May)",
  //       "",
  //       "50",
  //       "169000000000000000000", // 169
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "11",
  //       "Fansland X Gonesis(4-5 May)",
  //       "",
  //       "50",
  //       "169000000000000000000", // 169
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   console.log("增加票型结束");
  //   console.log("更新名字");

  //   // 更新名字
  //   if (true) {
  //     let tx = await nft.updateNftTypeName("1006", "Silver Package(4-5 May)");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }

  //   if (true) {
  //     let tx = await nft.updateNftTypeName("1007", "Silver Package(4 May)");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }

  //   if (true) {
  //     let tx = await nft.updateNftTypeName("1008", "Silver Package(5 May)");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypeName("1002", "Queen Package(5 May)");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }

  //   // 更新价格
  //   console.log("更新价格");
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1003", "40000000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1004", "25000000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1005", "25000000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1006", "6000000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1007", "3999000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1008", "3999000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1009", "15000000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1010", "9800000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }
  //   if (true) {
  //     let tx = await nft.updateNftTypePrice("1011", "9800000000000000000000");
  //     console.log(tx.hash);
  //     await mySleep(3000);
  //   }

  // console.log("设置收款地址");
  // nft.appendTokenRecipients([
  //   "0x48f80C21fc9bCB6F75E12dE9C6bc30E0aDEA86Ee", // Mars 1
  //   "0xc4Ef6dCbA83465872db63A034Ad1D943f832fDBd", // Mars 2
  //   "0x80e8837856F0b68c7a0776E608339203e6AdE733", // Mars 3
  // ]);

  // console.log("设置NFT合约的支付USDT/USDC合约");
  // const r1 = await nft.updatePaymentTokens(
  //   [
  //     "0x55d398326f99059ff775485246999027b3197955", // bsc USDT
  //     "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // bsc USDC
  //   ],
  //   [true, true]
  // );
  // console.log(r1.hash)
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
