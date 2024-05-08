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
    // "0xFE37761bD825498A54eAD59573b42020c5B7c139" // opBNB pro
    "0xbf36ab3aed81bf8553b52c61041904d98ee882c2" // bsc pro
  );
  await nft.waitForDeployment();
  console.log(`FanslandNFT contract: ${nft.target}`);

  //   let tx = await nft.updateAllowTransfer(true);
  //   console.log(tx.hash);

  //   let ids = [
  //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 99, 1000, 1001, 1002, 1003, 1004,
  //     1005, 1006, 1007, 1008, 1009, 1010, 1011,
  //   ];
  //   for (let i = 0; i < ids.length; i++) {
  //     let nftType = await nft.nftTypeMap(ids[i]);
  //     console.log(nftType["totalSupply"]);
  //     if (nftType["maxSupply"] > nftType["totalSupply"]) {
  //       let tx = await nft.updateNftTypeMaxSupply(ids[i], nftType["totalSupply"].toString());
  //       console.log(tx.hash);
  //     }
  //   }

  //   if (true) {
  //     let tx0 = await nft.setDevAddress(
  //       "0x7691cd47462D7659e69DAD7561878e2A31b41cfB"
  //     );
  //     console.log("设置开发者地址：", tx0.hash);
  //   }

  let tx = await nft.kolAirdrop(
    [
      "0x1da2ae4f577eb5ec173e620b87ba644f7f100951",
      "0x01ca2c9b06586caa123c97118bee1dd09b927f3a",
      "0x15f72cb658f38ee878110d9fe2fe29075e7ec31e",
      "0x336e6c8c6807374c668f3dd1f5c9c46c07ae8310",
      "0x07f2988907016b2b7030471c4a044c0065b8e7b0",
      "0x288e206702c6472be7f8cc44e081fb2eb50e0aa6",
      "0x05cc73ff93e3bc6d5b7e2d708e14dccd9065314c",
      "0x06c4e28a9f856583026ce356f16d721fd0e0446b",
      "0x38aaa14b12f75eff30f52b6ab88c9f314072654b",
      "0x05fd78a22643a4434474e9bf7ebf579f8084f223",
      "0x2fe1215dc103f46040b6920aac7671dcf3bcefdc",
      "0x23411b5dd75e2e3275b9f0f817ee0a340c8083a4",
      "0x15a87227814f7ac137930dc9c40fb4aaed9ca577",
      "0x24d20f4e413d54fc5f78b381ee09fbeea1e19a0b",
      "0x1a7177707b211b78e68d1926d7ac10cb7b5c25ba",
      "0x11dc202869543e73d6ad48d578b2069daacd23e3",
      "0x0d3c949634ec16fa60de8b6aea50ba2640883e96",
      "0x29ea4b82a30a6672d1fcc063aeca9f09d8c804be",
      "0x0d9ea0208fcaeb1dc0ebf18ad68f4f0cd6722f2c",
      "0x1a47ef7e41e3ac6e7f9612f697e69f8d0d9f0249",
      "0x108bdf64b48ddf2b37f563223a7322bb10804f08",
      "0x2f884b1a7df5be8b5981526a5bb6c0d87f7bef42",
      "0x3148ffd13e424589fece5f189def5c0f78ab0f54",
      "0x0bc8bf6594a1abf7557bc1c0a010feb3de48fde4",
      "0x0646493cbf149f1c69e76859a8834c21f0e87353",
      "0x09befd728a250e792aeab3167a9eeb8090589f13",
      "0x20e4cc4c741f00b05bbf10e99610acce1caa8d98",
      "0x2b1eb5d1fb443d872e7ca3a82e295bc8080cd403",
      "0x037253b2edc292cf46c4ce9f4ccc4cf750b77196",
      "0x187ff5035cb43c8fdfeefbb99e62bee70895e1f0",
      "0x21ced36d3d1f57d29b44e5b80c3bea992082f368",
      "0x1bc79ff6543cfbc58ee3585e37b601790f9e2536",
      "0x07b5844c8226ebe361b5af605de5e7cd7baae8cd",
      "0x35fd5f70ba08215a1a330451a6781d8f8d105129",
      "0x1c5d4be30bbdea51d58541a938f420a26e085692",
      "0x35dc3ae8ab20501a720c6b8e247d7ef86f111872",
      "0x1dbc3fd072d83f7b4d968c326970c3a20d5f2763",
      "0x37e067029de9fdca1c8d7a1871c293350f9836b0",
      "0x376828a07dc3bf2a237a9e1c2eab2b06459d9dad",
      "0x1dfd0c0bf597d23b66fe1defe7719d2807588d7f",
      "0x09123d7f9b023abc3c31429482cb2078dc2f9d9d",
      "0x05807200567769ed191f2ade2ec29d7b121f920b",
      "0x1173d1131c790f3ea78e9e35eea0e8a4d0b14fbf",
      "0x24de7553f13f92637be1d1f6939f6900931b78db",
      "0x21f48e4fb47061362b9394c4a83fc1a06d932fb8",
      "0x49c6017de9d05bbeaf446e96ea67f403bd087614",
      "0x6edda46fd98f00ef665300488130fc92b359bdce",
      "0x69841d969d1dc66963fc093297cf432c08b7391c",
      "0x63b95f211b8306e398b86df261c7b309b05c2f4a",
      "0x4e603e675f1bc81f94e378831d22af064fb7b3a3",
      "0x52d4ea654921ded172dbf3c0e8e0faf5e8e9e65f",
      "0x717e03dbf77153f475a197489fc3d9c42053c548",
      "0x69096890bb79e605f5b7e281915a812e629feaf2",
      "0x39eb2949cc657270ba6a2b6d2bb93188085c56b8",
      "0x4e9a31b685157233316cf3ff47a7c1a1125596ab",
      "0x4715ba2990d15ba1647618f0a803b96f0a85d089",
      "0x678daaa731dec5a7d69d0579a087fac0c68b615b",
      "0x5cfc1103d72b5bbb4bf5ed242916cab3064c9d25",
      "0x6c6cb2d2d18a78ad46cda719bf56fe80ed62099b",
      "0x59ce4e774d7fd49b965041a9b3bea7e2e107a027",
      "0x665f44e3c2d7a9d6370e2c682a7d2e88047147ea",
      "0x54262ee53a0e843994d2576a2bd681e8e4117019",
      "0x412982a706dd3fdee16aaf7657c36691024fbd73",
      "0x4077013d2db2806e940762819949ad52307a8728",
      "0x642933615b3df0ee6e37018af90fb6bfd64cc3f7",
      "0x60f44cf778a34e540c35af52317e098af90be8cb",
      "0x6c63414117bd89927e962a77a819411d6e1d60db",
      "0x68da606b42028f57541b1c51daa11208b9ae41d9",
      "0x61a18a124cac6d4ce9c01cc8885192520f8f5147",
      "0x4406677f2a6836f20123877bd31731082c06f1fe",
      "0x6105c7bb60fca04c714659e3363c95500718e07e",
      "0x66778435c664b8d4f0f251271f6407e8ed165cea",
      "0x3aa9d1fbd5604035be6d0eec02504696a079865e",
      "0x56ad340ac7e050d6cb405713e21d0f8b6fb9b2a0",
      "0x6e22ce8a6c099dba1477b441a2ed870cb76858dd",
      "0x3a1dbdb7bd3e5afa78663b191ab11df5bc63efce",
      "0x586bd8b2ff574be1fd4433a780c0074cf62b5bcd",
      "0x3da684271f24b43b196554d6644c340f9f362a7a",
      "0x6ced926bfb22a6c1aead814f1d52f10821c4fbf4",
      "0x405b04f8085b58bd0631c4fb101045dc6feaec2d",
      "0x5024aa7032cd35ef4ea69f101c071e9c09a230d4",
      "0x5d6dd3de0200b53e41682d07d670a216008394b3",
      "0x549e0c769c538c796a29c6165241b9d6107182f4",
      "0x69bcfbd1507bba4166a2a72224db1f11c469e4aa",
      "0x55d6207648c822a4138966afd83e468706e5729d",
      "0x6606fb2558b3ef0394bf680cf15d908cfb53e39c",
      "0x4b42391baa84d0d412c2c89ba78d05304a7d679b",
      "0x5e9d0013e7864f1422d507cacc508dcee9ade040",
      "0x67f68d3756edebde67d26073954a6bd0e82150fb",
      "0x50578650754871a1bd080de0cf1e1c83aed9f1db",
      "0x60ad82d44c51a41dbbd4ffd67326ef7e31e00515",
      "0xa6463b416334bf65da5873de106adab08ab7babd",
      "0x8e6a61ba6ec239718ecb2438a51808bd65c1b2ca",
      "0x7c08bdb8413b5ac3d97773c5a5ada76406d31d65",
      "0x9e644608bf4c81f848c3e81351444d3208a64a08",
      "0x7a8973d3be571967136b31ba05ec7091a1e39cfb",
      "0x8c93c28a392a4308c6f6429e4f3cf07e97e0dbc1",
      "0x91f29da935d1fd9d15dad950973849db1c0102b8",
      "0x8ab74a6a273b3722ae47b5d0cefcc0eeb66d1e14",
      "0xa0360d110ef24c6935514f47e570f9beef704d1a",
      "0x78de19620f7eae47b6df3337c330f55b1d9ff6bc",
      "0x856f2a6114447d7881f1a795726855088e3ac9f5",
      "0xa0bc54dc62b31d6b982575e105ae8ca8b6072081",
      "0x952ba14584f9c439f307775785e102e640689d97",
      "0x8294f76fe418653caaf175ebc50f7cf707024e1c",
      "0xa1d1a5551227fb380ec7b389280ffbf0c46d960e",
      "0x9f810733d0ea05d6ba9391c62eee800e73f0ca73",
      "0x8138ca1078494580cba5ea486e687420bb7b8815",
      "0x9f7e883f7e288bfbc0a0d5606dae00a86d8e3d5f",
      "0x9201573851d94fafabab46dd441479c907ce0922",
      "0x8947794475dd00d9314a22f03d5f42d6909c8376",
      "0x7707265dabede303ca82ef1623a50949ced7ae7e",
      "0x9f006b482ab7ee0ea52c70d6fc9400c66e085141",
      "0x74103d6d657c85ef0f76575602e7108e05dd50db",
      "0xa2c1a41714be08cf028ada5465bdf6860b7c9625",
      "0x8355f90683b00f9ccd0430d0694d4408eb8ea337",
      "0xa98af949b702d1fce5bc6bfc0af3e80dc1076125",
      "0x79377629511eacafa1227c99075110bcccf3a055",
      "0x8372564286ce6aa625253cdc7f374300ba8e0529",
      "0x728c58fcda7c39d2994b045220ec70c5ed6af195",
      "0xa3285a19d43d189c46b3c45c893b6710de4be365",
      "0x89c7d6b9a583c0986de46e6a9d5b6e1d2ce6640b",
      "0x9f12876d5cc07cc18ebf13ec228f2a0906abf65e",
      "0x9db9ff0782a0cdbfe68fd920129918121a080790",
      "0x7ced10c2c2c6a70c4f5417f7d19b38ec10e65824",
      "0xa628c9cb236c9cfb5dbf891b1164d41148eee5d2",
      "0x7f46134cb3d46f1edc03080f021d07ddbaf865c1",
      "0x7e905458b9a9836837eeedf35783ba08707a1104",
      "0x94c4ef6f9b7777b614360b97c3d8565b3b106741",
      "0xbf77274ecc80e2e6e4b433c8db30609fd1d22003",
      "0xb852fd6f9683e319524930478b540d60e8a87d28",
      "0xdfb2c15ad4eb00b4498973a6e5e59e040094b825",
      "0xd1699f8848d9a9f3e36aa099c35b11f6107e56f0",
      "0xc94c39a834a58e58dee2e6061111b96408563c1e",
      "0xb60b65b1e5c9b89d52c93da905ff63112f5186fc",
      "0xda7acb3bf0435e90b885b7897175cd40560fa7e3",
      "0xc6bef0a58a4bc54db89b8c2155b1c41be1ec2476",
      "0xe1180c2f02b9b9c767b14b9d03a5b7075800abbd",
      "0xe216ea27930e51ea1f759b697a790ac706f60e29",
      "0xd40e9a16700e0c29bf362b258e3d07bc79b2f7da",
      "0xd62e1102636f0f3654b08a69095041b49075b224",
      "0xd86674f737c561111864559b9caa5591aba22621",
      "0xb46632dc865af2443c4cb48189797ef3b070254e",
      "0xc1dae2e5092beb05d20156c4f49a48b082c997ef",
      "0xb78a469431ca6f2644b0b4d333cf4bd12ca541e0",
      "0xd85e54283a5c304a3757eae8d206870cc6522e8f",
      "0xb5647ca4223f6e242b22beeba0c8fd4add1da7c2",
      "0xbd91314c0d39d9b7be6064a7775d4911c48c2f3c",
      "0xd16752dbfd489e5d0d70554a59a4f1067eef60a2",
      "0xe2b0c4c908058619b010f9175f53983f1c05f474",
      "0xad7ef1ab1e141b3cb2a63265a3ad305bcb83dd23",
      "0xd9d4476392d7367a1676e79e79174b607b0f77c8",
      "0xbeac550d3acf3adfb8a8eb5bffd99b08f9e10b7c",
      "0xda8eaa6361e4939bd3ee43d00f38197db9090560",
      "0xbccaa67398e91a7e549c75ee9907cfb7d4bab6a8",
      "0xd1cbf49831b531914a87d3eba5a16a8168092678",
      "0xd7a684c9dba0fb5d0ee3455dd89e0edfec80e029",
      "0xd0e1462cf8d6745e424770faad931a1b3ec6c07d",
      "0xcf2eb5ad01f5de2a32b5b4bebb44127853085317",
      "0xbdd67484ff11939ef22428eadf7b170d6438df9c",
      "0xcc31def9d7ba89b9e593f286e9e76d60e2072224",
      "0xd825d170a41d4b3d1186998f3d0aff6e43bfac43",
      "0xd6253b4c88770d459812028055d0ec940930cb57",
      "0xe52a3d7a3498f5340f8772bfcfccd9bea099184f",
      "0xb893d31581c42245bcb6bbbba31314104a2a2d6c",
      "0xd2d73e5087e0ac84864c4c6597c7feb91a1369a8",
      "0xc5d0e67484c5a57395f2f67e1893750d760ab3e1",
      "0xbba01aac615f6e385360703dc42f0d111bc328eb",
      "0xc37a4dbccc856eb109334e5b166eb1606a3d204a",
      "0xbbc09442c25fa778376ef26cabac1a372045837b",
      "0xde08df416d3e577d772d6e179105bf9f8e19feaf",
      "0xc5aeeb4bfc0fd8320055a2b09d1dca205504c0cb",
      "0xd336424aa8d2835b312cf547c3d1e0950a8862f7",
      "0xda3892673d43c3d1b84c39fb12c920cf9dc80d18",
      "0xbbad6b72186e7a9e1d6986591f0fbb7c76bc4cfa",
      "0xd88edf934541ad63ba5941721e75908da8acc624",
      "0xf5ab09471d89f8ca427dbd1ea0ef5f3cbd1bdd5d",
      "0xf0c413ee2df65f1adaa3cb594127ac1d9072b298",
      "0xeb98e82110c5f5bf9a3d66a937cb0af88bdd1a06",
      "0xfc2e96d3bb3bf68811951ecd93250b9d8da1bf37",
      "0xf348b733daa2e1cda395f4f3c82d81086feedf71",
      "0xfd7232b802c64fb5bf43167d5b444d909af1359d",
      "0xe8d93f2c1bcd534a39b82e4d1f178f0e1e0609c4",
      "0xf184bd6e45d1c9d8796d95ec03117b808de08b66",
      "0xe918ba5cdf1c7b440cbb793cbc3203ed6099862b",
      "0xe7454031466f067c4547bc1ca887d651050f0e2f",
      "0xeffade4672e9251f1f783e1eec0db08206568c3b",
      "0xe6d5f4bc06c11a80b97b517f0edde7a0e9134df2",
      "0xff897ef5240fd660d03c325d76e42c08f5d89df8",
      "0xfcdfda023f727dafa35e8ee2715bcd7411c86b21",
      "0xfe62017b50f8ee242e98882cc553e7b09ea164d5",
      "0xe9b3b46a92dec11d71142ede84db6d0bfd88215b",
      "0xf118c2214b3e02ad2402353baebf3d09d107dd4d",
      "0xf382eb6a94ce3070e768dfb3c10d9f8107d4979e",
      "0xfe2819b62107642b696e021630db1968106b2b43",
      "0xe740bcca816a3cd07cfb53d8fb392306a7387dce",
      "0xf15a8b232c76f3c1f7e4483389a1050956b4fb4e",
      "0xf74f3a61b62721e04f3817a628811975bfbdbca3",
      "0xf154030243daceb5e2ff9ad21f2e0cea96de729a",
      "0xecfcbdbd2e48b68f483e7baa868764107c161b7e",
      "0x000986993080d1d8eb0e046bdfbbe3e688eeeeee",
      "0x111069ef0bcbee693b8c36e64512ea999f333333",
      "0x9ee8d86e9665b2b81ec99933db3a8e46ade2b9f6",
      "0x85318DE495c29536f4b43d31C71Eb9C65eEbe31F",
      "0x5752ab17059a9e98ea8ff5e324ebd27b02c07558",
      "0x0d72eb4e64124028ea01372fd22046b7bce7d688",
      "0xc577a4c17a0336299ff77852bec50a7d828b2283",
      "0x822d9173367a810c1a2c6942904d8def6d036f25",
      "0x898e2592b0ae429288ae3ef33df9df7e4f8a76d7",
      "0x60eA23DcF6475781afae565D55caF071D3f76433",
      "0xD8f8bC9FDB9d4DC13197C12289192077759F87D0",
      "0xF5623E61283e68d80c2B702B7A18952228797186",
      "0xbBc321c04349Ea5a160A6Ee05be66925a9452E05",
      "0x8F1D7e1F0daD614f1f2EF8aa16BC38d40aF3b9AA",
      "0xd537abaa49e8dcf63d7a854d8d547f611e28cf10",
      "0x7c9666fc716d10bb79f37b66468169367fdb5f8d",
      "0xf9fa20319c2a53b8987ecd9d6202e3babaf71983",
      "0x9dCF601F5BdED4e5120A5aeFba4d932d7fFb5381",
      "0x7EFf7eeE42Dc0Bd27081A78fE23CFE2a72697f2B",
      "0x9eB31fF632F4158faF4c2A08dB237203Fe7aa528",
      "0xc0522bB858D7FDee24598092A262eCAEd209148a",
      "0xe7dd98Faa5b223995b78985Aee3efef59bc73244",
      "0x22cf0be117b8920866181ee8b06c48fd378e3c51",
      "0x21ba354208658b8095ef39453d1f073ea19cfec2",
      "0x52eCA005D1473d49E8C2a4B65653906695Fc4a1b",
      "0xF6F493009951a0D7555Cf166875281a37f48A6C0",
      "0x4747DC030b2C56FD604d511f9d991687Df36F265",
      "0x1c0503ed8212d3bc2f5f6060A9c037ed64F34203",
      "0xD26ad6Eb84e9A8d93667BF66B2e6a03E4ca9E8fB",
      "0x4cCC3eb76B16cA85Fe05D3Dfd9B817C0838c4215",
      "0x79d81D7D9FF2285ad7a7c62B2F61A774c06a6746",
      "0x58869e051c8a6eF9590e4856B489584B52044F48",
      "0x2219a20Ab5D75cC7705F5E08348691Da257b785e",
      "0x5c574D2d02dCaA32d7537685d6880d03f4d4Ca94",
      "0x7D7ee859Df3F417639D61a5954Aa344E5344dD68",
      "0xa8B44d98F6092529deb51fFF42a69Ebd00122409",
    ],
    [
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
      75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
      93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
      109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
      124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
      139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
      154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168,
      169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183,
      184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198,
      199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213,
      214, 215, 216, 217, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237,
      238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252,
      253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265,
    ]
  );
  console.log(tx.hash);

  //   console.log("增加票型");
  //   if (true) {
  //     let tx = await nft.updateNftTypeName(0, "Early Bird 2-Day Ticket(4-5 May)");
  //     console.log(tx.hash);
  //   }

  //   if (true) {
  //     const tx1 = await nft.addNftType(
  //       "99",
  //       "VVIP",
  //       "ipfs://bafybeiaqz6l5zqmlqtvdh5bqq7vqef7bqgy5k4jpsjzq3twwaz4yyex44i/1011.json",
  //       "1000", // 1000
  //       "99999000000000000000000", // 99 USD
  //       true
  //     );
  //     console.log(tx1.hash);
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
