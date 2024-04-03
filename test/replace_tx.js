var ethers = require('ethers');
var url = 'https://polygon-mainnet.g.alchemy.com/v2/YClzyACPRcIQOYKhvWrWMj3sXaQcdXnP';
var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
var privateKey = "0xecfeb73df387036271fd7f395d745b09f3b4c4771abbdeacd1eee8da96d8f309";
var wallet = new ethers.Wallet(privateKey);
console.log("Address: " + wallet.address);
tx = {
  to: "0x624C87ab2ccb5cB8fA3054984a9B3F6b97017751",
  value: ethers.utils.parseEther("0.05"),
  chainId: 137,
  nonce: 34
}
customHttpProvider.estimateGas(tx).then(function(estimate) {
    tx.gasLimit = estimate;
    tx.gasPrice = ethers.utils.parseUnits("", "gwei");
    wallet.signTransaction(tx).then((signedTX)=>{
	customHttpProvider.sendTransaction(signedTX).then(console.log);
    });
});
