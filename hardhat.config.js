require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/*
562f81c9848e40b2b6040577a8eb9f41 // bsc_main
e40cb1b6dad04c28878c1829c0dacc43 // eth_main
447b40cf71644bd2884572bb28247d42 // arbitrum_main
d7c30fd452f9473493d0cd9916621b6a // optimism_main
ba926e04746f4f98a64265ee7ffb49bb // avalanche_main

856bdab49c6143839f31a9eee036e93b // bsc_test
83d3d7d77ee04a2e948a5fdb0f9dd98e // eth_test

5a7b692fe4564472b5273c4e40bb5007
6e0b025333a643068b094b7491676737
db3b336580ee4d95a1de9971d584e515
187964570e884d608f6b769a600186d2
143a903db9054699a3c1fd99dff24255
*/

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      timeout: 600000,
    },
    //========================mainnet=========================
    polygon_main: {
      url: "https://polygon-mainnet.g.alchemy.com/v2/YClzyACPRcIQOYKhvWrWMj3sXaQcdXnP",
      chainId: 137,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
      gasPrice: 110_000_000_000,
    },
    bsc_main: {
      url: "https://bsc-mainnet.nodereal.io/v1/562f81c9848e40b2b6040577a8eb9f41",
      chainId: 56,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
      gasPrice: 3_000_000_000,
    },
    eth_main: {
      url: "https://eth-mainnet.nodereal.io/v1/e40cb1b6dad04c28878c1829c0dacc43",
      chainId: 1,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
    arb_main: {
      // arbitrum one
      url: "https://arb-mainnet.g.alchemy.com/v2/aWoiDWmwaBDodzybHmDhJOg8fmF6TMOa",
      chainId: 42161,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
    opt_main: {
      url: "https://opt-mainnet.nodereal.io/v1/d7c30fd452f9473493d0cd9916621b6a",
      chainId: 10,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },
    avax_main: {
      // C-chain
      url: "https://open-platform.nodereal.io/ba926e04746f4f98a64265ee7ffb49bb/avalanche-c/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [process.env.MAINNET_PRIVATE_KEY],
    },

    //========================testnet=========================
    polygon_test: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/NJsreaaTReGW3P0jzESHWw9TIeBKZ3Ly",
      chainId: 80001,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      gasPrice: 3_000_000_000,
    },
    bsc_test: {
      url: "https://bsc-testnet.nodereal.io/v1/83d3d7d77ee04a2e948a5fdb0f9dd98e",
      chainId: 97,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      gasPrice: 5_000_000_000,
    },
    eth_test: {
      url: "https://eth-sepolia.nodereal.io/v1/4fd5911d00a14ff8a3c00c411b6af65d",
      chainId: 11155111,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
    },
    arb_test: {
      url: "https://arbitrum-sepolia.infura.io/v3/1cef30980e1949668742a5effed4ed49",
      chainId: 421614,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
    },
    opt_test: {
      // https://docs.optimism.io/chain/networks
      //   https://optimism-sepolia.infura.io/v3/4ff797bd44304499b0628ce2f6879132   #华宇,备用
      url: "https://optimism-sepolia.infura.io/v3/91bda72598944012992059fe89da539c",
      chainId: 11155420,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
    },
    avax_test: {
      url: "https://avalanche-fuji.infura.io/v3/99517aea5a9046e5bfb1d79e263595c7",
      chainId: 43113,
      accounts: [process.env.TESTNET_PRIVATE_KEY],
      //     gasPrice: 25000000000,
      //   gas: 100000
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
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
      bscTestnet: process.env.BSC_API_KEY,
      bsc: process.env.BSC_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: false,
  },
};
