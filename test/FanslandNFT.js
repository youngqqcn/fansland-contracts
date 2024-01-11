const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { fromWei, toWei } = require("web3-utils");
const {
  BN,
  constants,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");
const { ethers, upgrades } = require("hardhat");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { ZERO_ADDRESS } = constants;

describe("FanslandNFT", function () {
  // Events expected during this test case
  const EventNames = {
    Transfer: "Transfer",
    Approval: "Approval",
    Paused: "Paused",
    Unpaused: "Unpaused",
    UriChanged: "UriChanged",
    MintNft: "MintNft",
  };

  // User accounts to be used in the test case
  let owner, alice, bob, john, shane;

  // Contract Information
  const NAME = "Fansland";
  const SYMBOL = "FANS";
  const MAX_NFTS = 100000;
  const NFT_PRICE = "0.001"; // in ETH
  const BASE_URI = "https://mynft.com/";
  const DEFAULT_TYPE_URI = "uri/0";

  // Constants for testing purpose
  const INCORRECT_NFT_MINT_PRICE = toWei("0.0001", "ether");
  const NFT_MINT_PRICE = toWei(NFT_PRICE, "ether");
  const FIRST_TOKEN_ID = 1n;
  const NON_EXISTENT_TOKEN_ID = 10000n;

  // Smart Contract instance variable
  // var fanslandNFT = null
  var token = null;
  let accounts = [];

  // NftType
  const ID_IDX = 0;
  const NAME_IDX = 1;
  const URI_IDX = 2;
  const MAX_SUPPLY_IDX = 3;
  const TOTAL_SUPPLY_IDX = 4;
  const PRICE_IDX = 5;
  const SALE_ACTIVE_IDX = 6;

  // Contract initialisation function, should be called once in a test's lifetime
  async function initContract() {
    console.log("===============", process.env.MUMBAI_PRIVATE_KEY);

    // console.log("signers = ", await ethers.getSigners());
    await ethers.getSigners();

    [owner, alice, bob, john, shane] = await ethers.getSigners();
    accounts = [owner, alice, bob, john, shane];

    const FanslandNFT = await ethers.getContractFactory("FanslandNFT");
    token = await upgrades.deployProxy(FanslandNFT, []);
    await token.waitForDeployment();
    // console.debug(token);

    // 升级
    // token = await upgradeProxy(tokenV1.address, NFT);
    console.debug(`New NFT contract deployed - address: ${token.target}`);
  }

  before(async () => {
    await initContract();
  });

  describe("Initial State", () => {
    context("when the NFT contract is instantiated", function () {
      it("has a name", async function () {
        expect(await token.name()).to.equal(NAME);
      });

      it("has a symbol", async function () {
        expect(await token.symbol()).to.equal(SYMBOL);
      });

      it("has sale activated", async function () {
        expect(await token.openSale()).is.true;
      });

      it("has fixed max supply", async function () {
        expect(await token.maxSupply()).to.equal(MAX_NFTS);
      });

      it("has zero initial supply", async function () {
        const t = await token.nftTypeMap(0);
        console.log("xxxxxxx==");
        expect(t[TOTAL_SUPPLY_IDX]).to.equal(0);
        for (const acct of accounts) {
          expect(await token.balanceOf(acct)).to.equal(0);
        }
      });

      it("has each NFT price set to 0.001 ether", async () => {
        const t = await token.nftTypeMap(0);
        let price = t[PRICE_IDX];
        expect(fromWei(new BN(price))).to.equal(NFT_PRICE);
      });

      it("has each NFT price set to 0.001 ether", async () => {
        const t = await token.nftTypeMap(0);
        let status = t[SALE_ACTIVE_IDX];
        expect(status).is.true;
      });
    });
  });

  describe("setSaleActive()", () => {
    context("when non-owner tries to change sale active status", function () {
      it("reverts", async () => {
        const ttt = await token.connect(alice);
        await expect(ttt.setSaleActive(false, { from: alice }))
          .to.be.revertedWithCustomError(ttt, "OwnableUnauthorizedAccount")
          .withArgs(alice);
      });
    });

    context("when owner tries to change sale active status", function () {
      it("can set sale active state to false", async () => {
        await token.setSaleActive(false, { from: owner });
        expect(await token.openSale()).is.false;
      });

      it("can set sale active state to true", async () => {
        await token.setSaleActive(true, { from: owner });
        expect(await token.openSale()).is.true;
      });
    });
  });

  describe("pause()", () => {
    context("when owner tries to pause the contract", function () {
      it("deployer can pause", async function () {
        const receipt = await token.pause({ from: owner });
        // console.log("receipt = ", receipt);
        expectEvent.inTransaction(receipt, EventNames.Paused, {
          account: owner,
        });
        expect(await token.paused()).to.equal(true);
      });

      it("deployer can unpause", async function () {
        const receipt = await token.unpause({ from: owner });
        expectEvent.inTransaction(receipt, EventNames.Unpaused, {
          account: owner,
        });
        expect(await token.paused()).to.equal(false);
      });
    });

    context("when minting with paused contract", function () {
      it("cannot mint while paused", async function () {
        await token.pause({ from: owner });
        const ttt = await token.connect(alice);
        await expect(
          ttt.mintBatch([0], [1], { from: alice, value: NFT_MINT_PRICE })
        ).to.be.revertedWithCustomError(ttt, "EnforcedPause");
        await token.unpause({ from: owner });
      });
    });

    context("when other account tries to pause the contract", function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await expect(ttt.pause({ from: alice }))
          .to.be.revertedWithCustomError(ttt, "OwnableUnauthorizedAccount")
          .withArgs(alice);
      });
    });

    context("when other account tries to unpause the contract", function () {
      it("reverts", async function () {
        await token.pause({ from: owner });
        const ttt = await token.connect(alice);
        await expect(ttt.unpause({ from: alice }))
          .to.be.revertedWithCustomError(ttt, "OwnableUnauthorizedAccount")
          .withArgs(alice);

        await token.unpause({ from: owner });
      });
    });
  });

  describe("mintBatch()", async () => {
    context("when sale is in-active, on trying to mint", async function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await token.setSaleActive(false, { from: owner });
        await expectRevert(
          ttt.mintBatch([0], [1], { from: alice, value: NFT_MINT_PRICE }),
          "Sale must be active to mint NFT"
        );
        await token.setSaleActive(true, { from: owner });
      });
    });

    context("with incorrect amount", async function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await expectRevert(
          ttt.mintBatch([0], [1], {
            from: alice,
            value: INCORRECT_NFT_MINT_PRICE,
          }),
          "Ether value sent is not correct"
        );
      });
    });

    context("with minted token", async function () {
      before(async function () {
        const firstTokenId = "0";
        const ttt = await token.connect(alice);
        ({ logs: this.logs } = await ttt.mintBatch([0], [1], {
          from: alice,
          value: NFT_MINT_PRICE,
        }));
      });

      it("emits a Transfer event", function () {
        expectEvent.inTransaction(this.logs, EventNames.Transfer, {
          from: ZERO_ADDRESS,
          to: alice,
        });
      });

      it("MintNft event", async () => {
        expectEvent.inTransaction(this.logs, EventNames.MintNft, {
          from: ZERO_ADDRESS,
          to: owner,
          typeId: 0,
        });
      });

      it("creates the token", async function () {
        const firstTokenId = 0n;
        const ttt = await token.connect(alice);
        expect(await ttt.balanceOf(alice)).to.equal("1");
        expect(await ttt.ownerOf(firstTokenId)).to.equal(alice);
      });
    });

    context("mint with wrong typeId ", async () => {
      it("reverts", async () => {
        await expectRevert(
          token.mintBatch([100001], [1], {
            value: NFT_MINT_PRICE,
          }),
          "invalid typeId"
        );
      });
    });
  });

  describe("tokensOfOwner(address _owner)", () => {
    before(async function () {
      const ttt = await token.connect(alice);
      await ttt.mintBatch([0], [1], { from: alice, value: NFT_MINT_PRICE });
      await ttt.mintBatch([0], [1], { from: alice, value: NFT_MINT_PRICE });

      const ttt2 = await token.connect(john);
      await ttt2.mintBatch([0], [1], { from: john, value: NFT_MINT_PRICE });
      await ttt2.mintBatch([0], [1], { from: john, value: NFT_MINT_PRICE });

      const ttt3 = await token.connect(bob);
      await ttt3.mintBatch([0], [1], { from: bob, value: NFT_MINT_PRICE });
      await ttt3.mintBatch([0], [1], { from: bob, value: NFT_MINT_PRICE });
    });

    context("when queried for address with no token", async function () {
      it("responds with an empty array", async function () {
        expect((await token.tokensOfOwner(shane)).length).to.equal(0);
      });
    });

    context("when queried for address with tokens", async function () {
      it("responds with an expected owned NFT count", async function () {
        //   expect((await token.tokensOfOwner(alice)).length).to.equal(3);
        expect((await token.tokensOfOwner(john)).length).to.equal(2);
        expect((await token.tokensOfOwner(bob)).length).to.equal(2);
      });
    });
  });

  describe("tokenURI(uint256 tokenId)", () => {
    it("reverts when queried for non existent token id", async function () {
      await expect(token.tokenURI(1000))
        .to.be.revertedWithCustomError(token, "ERC721NonexistentToken")
        .withArgs(1000);
    });

    it("returns when queried for existing token id", async function () {
      const tokenId = 1;
      const expectedTokenURI = BASE_URI + DEFAULT_TYPE_URI; // baseURI + tokenURI
      expect(await token.tokenURI(tokenId)).to.equal(expectedTokenURI);
    });
  });

  describe("setBaseURI(string memory newBaseTokenURI)", () => {
    const newURI = "https://collectible-aliens.com/v1";
    context("when called with other user", function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await expectRevert(
          ttt.setBaseURI(newURI, { from: alice }),
          'OwnableUnauthorizedAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")'
        );
      });
    });

    context("when called with owner user", function () {
      it("sets the new URI", async function () {
        const tokenId = 1;
        const beforeChangeURI = BASE_URI + DEFAULT_TYPE_URI;
        expect(await token.tokenURI(tokenId)).to.equal(beforeChangeURI);

        const receipt = await token.setBaseURI(newURI, { from: owner });
        expectEvent.inTransaction(receipt, EventNames.UriChanged);

        const afterChangeURI = newURI + DEFAULT_TYPE_URI;
        expect(await token.tokenURI(tokenId)).to.equal(afterChangeURI);
      });
    });
  });

  describe("withdraw()", function () {
    context("when other account tries to withdraw the balance", function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await expectRevert(
          ttt.withdraw({ from: alice }),
          'OwnableUnauthorizedAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")'
        );
      });
    });

    context("when owner tries to withdraw the balance", function () {
      before(async function () {
        ({ logs: this.logs } = await token.withdraw({ from: owner }));
      });

      it("transfers balance succesfully to owner", async function () {
        expect(await web3.eth.getBalance(owner.address)).to.equal(
          "10000000000000000000000"
        );
      });
    });
  });

  describe("burn(uint256 tokenId)", function () {
    it("reverts when burning a non-existent token id", async function () {
      await expectRevert(token.burn(100000), "ERC721NonexistentToken(100000)");
    });

    context("with minted tokens", function () {
      context("with burnt token", function () {
        before(async function () {
          const ttt = await token.connect(alice);
          this.receipt = await ttt.burn(FIRST_TOKEN_ID, {
            from: alice,
          });
        });

        it("emits a Transfer event", function () {
          expectEvent.inTransaction(this.receipt, EventNames.Transfer, {
            from: alice,
            to: ZERO_ADDRESS,
            tokenId: FIRST_TOKEN_ID,
          });
        });

        it("emits an Approval event", function () {
          expectEvent.inTransaction(this.receipt, EventNames.Approval, {
            approved: ZERO_ADDRESS,
            tokenId: FIRST_TOKEN_ID,
          });
        });

        it("deletes the token", async function () {
          const ttt = await token.connect(alice);
          expect(await token.balanceOf(alice)).to.be.equal("2");
          await expectRevert(
            ttt.ownerOf(FIRST_TOKEN_ID),
            "ERC721NonexistentToken(1)"
          );
        });

        it("reverts when burning a token id that has been deleted", async function () {
          const ttt = await token.connect(alice);
          await expectRevert(
            ttt.burn(FIRST_TOKEN_ID, { from: alice }),
            "ERC721NonexistentToken(1)"
          );
        });
      });
    });
  });

  describe("updateNftType()", async () => {
    it("update nft type", async () => {
      await token.updateNftType(
        0,
        "testname",
        "testuri",
        99,
        1,
        toWei("1.1", "ether"),
        false
      );
      const t = await token.nftTypeMap(0);
      expect(t[ID_IDX]).to.equal(0);
      expect(t[NAME_IDX]).to.equal("testname");
      expect(t[URI_IDX]).to.equal("testuri");
      expect(t[MAX_SUPPLY_IDX]).to.equal(99);
      expect(t[TOTAL_SUPPLY_IDX]).to.equal(1);
      expect(t[PRICE_IDX]).to.equal(toWei("1.1", "ether"));
      expect(t[SALE_ACTIVE_IDX]).to.equal(false);
    });
    it("add nft type", async () => {
      await token.updateNftType(
        1,
        "testname1",
        "testuri1",
        99,
        1,
        toWei("1.1", "ether"),
        true
      );
      const t = await token.nftTypeMap(1);
      expect(t[ID_IDX]).to.equal(1);
      expect(t[NAME_IDX]).to.equal("testname1");
      expect(t[URI_IDX]).to.equal("testuri1");
      expect(t[MAX_SUPPLY_IDX]).to.equal(99);
      expect(t[TOTAL_SUPPLY_IDX]).to.equal(1);
      expect(t[PRICE_IDX]).to.equal(toWei("1.1", "ether"));
      expect(t[SALE_ACTIVE_IDX]).to.equal(true);

      const receipt = await token.mintBatch([0], [1], {
        value: toWei("1.1", "ether"),
      });
      expectEvent.inTransaction(receipt, EventNames.Transfer, {
        from: ZERO_ADDRESS,
        to: owner,
      });
    });

    it("delete nft type", async () => {
      await token.removeNftType(0);
      await token.removeNftType(1);

      expect(await token.typeExists(0)).is.false;
      expect(await token.typeExists(1)).is.false;

      it("reverts", async () => {
        await expectRevert(
          token.mintBatch([0], [1], {
            value: NFT_MINT_PRICE,
          }),
          "invalid typeId"
        );
      });
    });
  });

  after(() => {
    token = null;
  });
});
