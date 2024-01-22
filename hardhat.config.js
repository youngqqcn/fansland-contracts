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
    mumbai: {
      //   url: "https://rpc-mumbai.maticvigil.com",
      //   url: "https://polygon-mumbai.api.onfinality.io/public",
      url: "https://polygon-mumbai.g.alchemy.com/v2/NJsreaaTReGW3P0jzESHWw9TIeBKZ3Ly",
      chainId: 80001,
      accounts: [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 3_000_000_000
      // accounts: ["0xb5af422ef45bac10aa74cef3ba13c191586e0e8ada5c9e061e4c65566efcacae"]
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
    },
  },
  sourcify: {
    enabled: false,
  },
};
