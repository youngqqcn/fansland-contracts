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




.PHONY: deploy
deploy:
	npx hardhat run --network mumbai scripts/deploy.js