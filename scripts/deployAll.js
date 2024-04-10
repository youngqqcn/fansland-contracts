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
  //   if (true) {
  //     console.log("部署USDT合约");
  //     const usdt = await hre.ethers.deployContract("USDT");
  //     await usdt.waitForDeployment();
  //     console.log(`USDT合约: ${usdt.target}`);
  //     //   await mySleep(5000);
  //   }

  //   if (true) {
  //     console.log("部署USDC合约");
  //     const usdc = await hre.ethers.deployContract("USDC");
  //     await usdc.waitForDeployment();
  //     console.log(`USDC合约: ${usdc.target}`);
  //     await mySleep(5000);
  //   }

  //   if (true) {
  //     console.log("部署Eer20USDT合约");
  //     const erc20Usdt = await hre.ethers.deployContract("TetherToken");
  //     await erc20Usdt.waitForDeployment();
  //     console.log(`Erc20 USDT合约: ${erc20Usdt.target}`);
  //     await mySleep(5000);
  //   }

  // 部署 NFT合约
  console.log("部署FanslandNFT合约");
  const FanslandNFT = await hre.ethers.getContractFactory("FanslandNFT");
  nft = await hre.upgrades.deployProxy(FanslandNFT, ["Test Nft", "TNT"]);
  await nft.waitForDeployment();
  console.log(`FanslandNFT合约: ${nft.target}`);

  //   let nft = await hre.ethers.getContractAt(
  //     "FanslandNFT",
  //     "0x63564E7525985879e7C48B35BF0Be310A9Ba9867"
  //   );
  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  if (true) {
    let tx0 = await nft.setDevAddress(
      "0xDEe74737Aa7C9E75cc782419D97DE18Eb2918e81"
    );
    console.log("设置开发者地址：", tx0.hash);
  }

  console.log("增加票型");
  if (true) {
    const tx1 = await nft.addNftType(
      "0",
      "Early Bird 2-Day Ticket(4-5 May)",
      "ipfs://bafkreic4ffkdf4he4flyx4skbe77452radqeom6c6uig4ndir4tjqtgism",
      "1000",
      "99000000000000000000", // 99
      true
    );
    console.log(tx1.hash);
    await mySleep(5000);
  }

  if (true) {
    const tx2 = await nft.addNftType(
      "1",
      "Advance 2-Day Ticket(4-5 May)",
      "ipfs://bafkreibylfdxl3zk45qyrk2ovx6wld2wcu6qwk5awn4zfpwdscgvgvdxle",
      "1000",
      "128000000000000000000", // 128
      true
    );
    console.log(tx2.hash);
    await mySleep(5000);
  }

  if (true) {
    const tx3 = await nft.addNftType(
      "2",
      "Regular 1-Day Ticket (4 May)",
      "ipfs://bafkreiedwy7gojsbodgnxqnyo3nlofdzxb7emlcn4kzzttykjnqgqukdbu",
      "1000",
      "128000000000000000000", // 128
      true
    );
    console.log(tx3.hash);
    await mySleep(5000);
  }

  if (true) {
    const tx4 = await nft.addNftType(
      "3",
      "Regular 1-Day Ticket (5 May)",
      "ipfs://bafkreifaspcgs6faf4dbpg7lwutzkkizxovlv2zqijsg7zassfobp3acpi",
      "1000",
      "128000000000000000000", // 128
      true
    );
    console.log(tx4.hash);
    await mySleep(5000);
  }

  if (true) {
    const tx5 = await nft.addNftType(
      "4",
      "Regular 2-Day Ticket(4-5 May)",
      "ipfs://bafkreieixd6ysvfe6avt7wc5yc5habj632zqzk2s4zh3uypjixch7fj55a",
      "1000",
      "169000000000000000000", // 169
      true
    );
    console.log(tx5.hash);
    await mySleep(5000);
  }

//   if (true) {
//     console.log("设置收款地址");
//     nft.appendTokenRecipients([
//       // "0x51Bdbad59a24207b32237e5c47E866A32a8D5Ed8",
//       "0x624C87ab2ccb5cB8fA3054984a9B3F6b97017751",
//       "0x274848a43f6afdDEed6623FB45c8B3e369936B5E",
//     ]);
//     await mySleep(10000);
//   }

  //   console.log("设置NFT合约的支付USDT/USDC/ERC20USDT合约");
  //   const r1 = await nft.updatePaymentTokens(
  //     [usdt.target, usdc.target, erc20Usdt.target],
  //     [true, true, true]
  //   );
  //   console.log(r1.hash);

//   if (true) {
//     const r1 = await nft.updatePaymentTokens(
//       [
//         "0xea0C02EE87EDdE983fd0aeE06A9E0e0b21771A55",
//         "0x85173c987Ea5f8850735BBDbB237b44817AFD169",
//         "0xc67b6E6af7Bcf2eF40ADB226c4000Ba1aF866Df6",
//       ],
//       [true, true, true]
//     );
//     console.log(r1.hash);
//   }
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
