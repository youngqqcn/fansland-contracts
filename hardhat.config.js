require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      timeout: 600000,
    },
    polygon: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/YClzyACPRcIQOYKhvWrWMj3sXaQcdXnP",
      chainId: 137,
      accounts: [process.env.POLYGON_PRIVATE_KEY],
      //   gasPrice: 3_000_000_000,
    },
    // bsc: {
    // //   url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    // //   chainId: 97,
    // //   accounts: [process.env.BNB_TESTNET_PRIVATE_KEY],
    // },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/NJsreaaTReGW3P0jzESHWw9TIeBKZ3Ly",
      chainId: 80001,
      accounts: [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 3_000_000_000,
    },
    bsctest: {
      url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      accounts: [process.env.BNB_TESTNET_PRIVATE_KEY],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
    ],
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      bscTestnet: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.POLYGONSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: false,
  },
};
