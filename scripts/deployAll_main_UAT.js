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
  //   nft = await hre.upgrades.deployProxy(FanslandNFT, ["TestNft", "TNT"]);
  //   await nft.waitForDeployment();
  //   console.log(`FanslandNFT合约: ${nft.target}`);

  let nft = await hre.ethers.getContractAt(
    "FanslandNFT",
    "0xBCB16afD0dDD58c849F3521db53De8BE5dd6BEd1" // BSC_UAT
  );
  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  //   let tx0 = await nft.setDevAddress(
  //     "0x8d39F5882F1F49714612FF06328189aAc9915728"
  //   );
  //   console.log("设置开发者地址：", tx0.hash);
  //   //   return;

  console.log("增加票型");
  //   if (true) {
  //     const tx1 = await nft.addNftType(
  //       "0",
  //       "Early Bird 2-Day Ticket(4-5 May)",
  //       "ipfs://bafkreic4ffkdf4he4flyx4skbe77452radqeom6c6uig4ndir4tjqtgism",
  //       "1000",
  //       "990000000000000000", // 0.99
  //       true
  //     );
  //     console.log(tx1.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx2 = await nft.addNftType(
  //       "1",
  //       "Advance 2-Day Ticket(4-5 May)",
  //       "ipfs://bafkreibylfdxl3zk45qyrk2ovx6wld2wcu6qwk5awn4zfpwdscgvgvdxle",
  //       "1000",
  //       "1280000000000000000", // 1.28
  //       true
  //     );
  //     console.log(tx2.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx3 = await nft.addNftType(
  //       "2",
  //       "Regular 1-Day Ticket (4 May)",
  //       "ipfs://bafkreiedwy7gojsbodgnxqnyo3nlofdzxb7emlcn4kzzttykjnqgqukdbu",
  //       "1000",
  //       "1280000000000000000", // 1.28
  //       true
  //     );
  //     console.log(tx3.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx4 = await nft.addNftType(
  //       "3",
  //       "Regular 1-Day Ticket (5 May)",
  //       "ipfs://bafkreifaspcgs6faf4dbpg7lwutzkkizxovlv2zqijsg7zassfobp3acpi",
  //       "1000",
  //       "1280000000000000000", // 1.28
  //       true
  //     );
  //     console.log(tx4.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "4",
  //       "Regular 2-Day Ticket(4-5 May)",
  //       "ipfs://bafkreieixd6ysvfe6avt7wc5yc5habj632zqzk2s4zh3uypjixch7fj55a",
  //       "1000",
  //       "1690000000000000000", // 1.69
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1003",
  //       "Platinum Package(4-5 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1003.json",
  //       "100",
  //       "500000000000000000", // 0.50000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1004",
  //       "Platinum Package(4 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1004.json",
  //       "100",
  //       "300000000000000000", // 0.30000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1005",
  //       "Platinum Package(5 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1005.json",
  //       "100",
  //       "300000000000000000", // 0.30000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1006",
  //       "Diamond Package(4-5 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1006.json",
  //       "100",
  //       "400000000000000000", // 0.40000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1007",
  //       "Diamond Package(4 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1007.json",
  //       "100",
  //       "250000000000000000", // 0.25000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1008",
  //       "Diamond Package(5 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1008.json",
  //       "100",
  //       "250000000000000000", // 0.25000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1009",
  //       "Gold Package(4-5 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1009.json",
  //       "100",
  //       "180000000000000000", // 0.18000
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1010",
  //       "Gold Package(4 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1010.json",
  //       "100",
  //       "98000000000000000", // 0.09800
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     const tx5 = await nft.addNftType(
  //       "1011",
  //       "Gold Package(5 May)",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1011.json",
  //       "100",
  //       "98000000000000000", // 0.09800
  //       true
  //     );
  //     console.log(tx5.hash);
  //     await mySleep(5000);
  //   }

  if (true) {
    const tx5 = await nft.addNftType(
      "5",
      "Co-Host OKX WEB3(4-5 May)",
      "ipfs://bafkreifuohissqu5nurx4ox5przs6kby36aqb5i2sa7y6nvxias3y3w2ka",
      "200",
      "128000000000000000", // 0.128
      true
    );
    console.log(tx5.hash);
    await mySleep(5000);
  }

  if (true) {
    const tx5 = await nft.addNftType(
      "6",
      "Fansland X OneKey(4-5 May)",
      "ipfs://bafkreihfkfo54flszruvqpgdwujp77exzzzrdpeopkd4rctslbnm7c64ze",
      "100",
      "209000000000000000", // 0.209
      true
    );
    console.log(tx5.hash);
    await mySleep(5000);
  }

  //   console.log("设置收款地址");
  //   const tx1 = await nft.appendTokenRecipients([
  //     "0x02667A747142A4bF6E6C10d6b4C3FA931A1889FB",
  //   ]);
  //   console.log(tx1.hash);

  //   console.log("设置NFT合约的支付USDT/USDC/ERC20USDT合约");
  //   const r1 = await nft.updatePaymentTokens(
  //     [
  //       "0x55d398326f99059ff775485246999027b3197955", // bsc USDT
  //       "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // bsc USDC
  //     ],
  //     [true, true]
  //   );
  //   console.log(r1.hash);
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
