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
	npx hardhat run --network mumbai scripts/deployUsdt.js


.PHONY: deploy-nft
deploy-nft:
	npx hardhat run --network mumbai scripts/deployFanslandNFT.js

.PHONY: verify
verify:
	npx hardhat verify --network mumbai 0x2D2c6A2c2559229A99cD348934f1852f3Fd23C1e