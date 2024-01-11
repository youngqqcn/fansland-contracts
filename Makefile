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
	sudo rm -rf artifacts cache

