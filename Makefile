.PHONY: compile
compile:
	npx hardhat compile

.PHONY: test
test:
	npx hardhat test

.PHONY: node
node:
	npx hardhat node