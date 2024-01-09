.PHONY: compile
compile:
	npx hardhat compile

.PHONY: test
test:
	npx hardhat test --network hardhat

.PHONY: node
node:
	npx hardhat node

remixd:
	remixd -s ./ -u https://remix.ethereum.org