.PHONY: compile
compile:
	npx hardhat compile

.PHONY: test
test:
	npx hardhat test --network hardhat

.PHONY: node
node:
	npx hardhat node

.PHONY: remixd
remixd:
	remixd -s ./ -u https://remix.ethereum.org

.PHONY: remixd
clean:
	npx hardhat clean
	sudo rm -rf artifacts cache .deploys contracts/artifacts




.PHONY: deploy-usdt
deploy-usdt:
	npx hardhat run --network polygon_test scripts/deployUsdt.js


.PHONY: deploy-nft
deploy-nft:
	npx hardhat run --network polygon_test scripts/deployFanslandNFT.js

.PHONY: verify
verify:
	npx hardhat verify --network polygon_test 0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e
	npx hardhat verify --contract contracts/USDC.sol:USDC --network bsc_test 0x1752BD08701a9eFFfA9cf8430135d02931cfBF4