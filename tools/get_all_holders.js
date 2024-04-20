// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const axios = require("axios");

function mySleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get_qrcode(token_id, holder) {
  return axios
    .post("http://127.0.0.1:3034/getQRCode", {
      chain_id: 56,
      nft_contract: "0xbf36ab3aed81bf8553b52c61041904d98ee882c2",
      nft_owner: holder,
      nft_token_id: token_id,
      timestamp: 0,
      signature: "xx",
    })
    .then((res) => {
      return res.data["data"]["qrcode"];
    })
    .catch((error) => {
      console.error(error);
      return "";
    });
}

async function get_all_holders() {
  // 部署 NFT合约
  console.log("获取所有holders");

  let nft = await hre.ethers.getContractAt(
    "FanslandNFT",
    "0xbf36ab3aed81bf8553b52c61041904d98ee882c2" // bsc_main_pro
  );

  let typeMap = {
    0: "Early Bird 2-Day Ticket( 4-5 May)",
    1: "Advance 2-Day Ticket(4-5 May)",
    2: "Regular 1-Day Ticket (4 May)",
    3: "Regular 1-Day Ticket (5 May)",
    4: "Regular 2-Day Ticket(4-5 May)",
    5: "Co-Host OKX WEB3(4-5 May)",
    6: "Fansland X OneKey(4-5 May)",
  };

  // 获取holders
  for (let i = 974; i < 1503; i++) {
    let holder = await nft.ownerOf(i);
    let typeId = await nft.tokenIdTypeMap(i);
    let ticketType = typeMap[typeId.toString()];
    let qrcode = await get_qrcode(i, holder);
    console.log(
      "%d,%s,%s,%s",
      i,
      holder.toString().toLowerCase(),
      qrcode,
      ticketType
    );
  }
}

get_all_holders().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
