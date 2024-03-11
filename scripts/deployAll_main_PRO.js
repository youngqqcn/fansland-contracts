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
    "Early Bird",
    "ipfs://bafkreic4ffkdf4he4flyx4skbe77452radqeom6c6uig4ndir4tjqtgism",
    "1000", // TODO: 库存
    "99000000000000000000", // 99 USD
    true
  );
  console.log(tx1.hash);

  console.log("设置收款地址");
  nft.appendTokenRecipients([
    "0x48f80C21fc9bCB6F75E12dE9C6bc30E0aDEA86Ee", // Mars 1
    "0xc4Ef6dCbA83465872db63A034Ad1D943f832fDBd", // Mars 2
    "0x80e8837856F0b68c7a0776E608339203e6AdE733", // Mars 3
  ]);

  console.log("设置NFT合约的支付USDT/USDC合约");
  const r1 = await nft.updatePaymentTokens(
    [
      "0x55d398326f99059ff775485246999027b3197955", // bsc USDT
      "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", // bsc USDC
    ],
    [true, true, true]
  );
  console.log(r1.hash);
}

deploy_all().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
