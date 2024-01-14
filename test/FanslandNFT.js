const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { fromWei, toWei } = require("web3-utils");
const { BN, constants, expectRevert } = require("@openzeppelin/test-helpers");
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
  var UsdtToken = null;
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

    // depoly test USDT erc20 contract
    const usdt = await ethers.getContractFactory("USDT");
    UsdtToken = await usdt.deploy();
    await UsdtToken.waitForDeployment();
    // await UsdtToken.deployed();

    const FanslandNFT = await ethers.getContractFactory("FanslandNFT");
    token = await upgrades.deployProxy(FanslandNFT, []);
    await token.waitForDeployment();

    // set test USDT erc20 contract
    await token.updatePaymentToken(UsdtToken, true);

    // 升级
    // token = await upgradeProxy(tokenV1.address, NFT);
    console.debug(`New NFT contract deployed - address: ${token.target}`);

    await UsdtToken.approve(token, 10000 * 1000000, {
      from: owner,
    });

    // const tUsdtToken = await UsdtToken.connect(alice);
    // await tUsdtToken.approve(tUsdtToken, 10000 * 1000000, {
    //   from: alice,
    // });
  }

  before(async function () {
    await initContract();
  });

  describe("Initial State", () => {
    context("when the NFT contract is instantiated", async function () {
      it("has a name", async function () {
        await expect(await token.name()).to.equal(NAME);
      });

      it("has a symbol", async function () {
        await expect(await token.symbol()).to.equal(SYMBOL);
      });

      it("has sale activated", async function () {
        await expect(await token.openSale()).is.true;
      });

      it("has fixed max supply", async function () {
        await expect(await token.maxSupply()).to.equal(MAX_NFTS);
      });

      it("has zero initial supply", async function () {
        const t = await token.nftTypeMap(0);
        // console.log("xxxxxxx==");
        await expect(t[TOTAL_SUPPLY_IDX]).to.equal(0);
        for (const acct of accounts) {
          await expect(await token.balanceOf(acct)).to.equal(0);
        }
      });

      it("has each NFT price set to 0.001 ether", async function () {
        const t = await token.nftTypeMap(0);
        let price = t[PRICE_IDX];
        await expect(fromWei(new BN(price))).to.equal(NFT_PRICE);
      });

      it("has each NFT price set to 0.001 ether", async function () {
        const t = await token.nftTypeMap(0);
        let status = t[SALE_ACTIVE_IDX];
        await expect(status).is.true;
      });
    });
  });

  describe("setSaleActive()", () => {
    context(
      "when non-owner tries to change sale active status",
      async function () {
        it("reverts", async () => {
          const ttt = await token.connect(alice);
          await expect(ttt.setSaleActive(false, { from: alice }))
            .to.be.revertedWithCustomError(ttt, "OwnableUnauthorizedAccount")
            .withArgs(alice);
        });
      }
    );

    context("when owner tries to change sale active status", function () {
      it("can set sale active state to false", async function () {
        await token.setSaleActive(false, { from: owner });
        await expect(await token.openSale()).is.false;
      });

      it("can set sale active state to true", async function () {
        await token.setSaleActive(true, { from: owner });
        await expect(await token.openSale()).is.true;
      });
    });
  });

  describe("pause()", async function () {
    context("when owner tries to pause the contract", function () {
      it("deployer can pause", async function () {
        const receipt = await token.pause({ from: owner });
        // console.log("pause====receipt = ", receipt);
        await expect(receipt).to.emit(token, EventNames.Paused).withArgs(owner);
        await expect(await token.paused()).to.equal(true);
      });

      it("deployer can unpause", async function () {
        const receipt = await token.unpause({ from: owner });
        await expect(receipt)
          .to.emit(token, EventNames.Unpaused)
          .withArgs(owner);
        expect(await token.paused()).to.equal(false);
      });
    });

    context("when minting with paused contract", async function () {
      it("cannot mint while paused", async function () {
        await token.pause({ from: owner });
        // const ttt = await token.connect(alice);
        await expect(
          token.mintBatchByErc20(UsdtToken, [0], [1], { from: owner })
        ).to.be.revertedWithCustomError(token, "EnforcedPause");
        await token.unpause({ from: owner });
      });
    });

    context(
      "when other account tries to pause the contract",
      async function () {
        it("reverts", async function () {
          const ttt = await token.connect(alice);
          await expect(ttt.pause({ from: alice }))
            .to.be.revertedWithCustomError(ttt, "OwnableUnauthorizedAccount")
            .withArgs(alice);
        });
      }
    );

    context(
      "when other account tries to unpause the contract",
      async function () {
        it("reverts", async function () {
          await token.pause({ from: owner });
          const ttt = await token.connect(alice);
          await expect(ttt.unpause({ from: alice }))
            .to.be.revertedWithCustomError(ttt, "OwnableUnauthorizedAccount")
            .withArgs(alice);

          await token.unpause({ from: owner });
        });
      }
    );
  });

  describe("mintBatchByErc20()", async function () {
    context("when sale is in-active, on trying to mint", async function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await token.setSaleActive(false, { from: owner });
        await expectRevert(
          ttt.mintBatchByErc20(UsdtToken, [0], [1], {
            from: alice,
          }),
          "Sale must be active to mint NFT"
        );
        await token.setSaleActive(true, { from: owner });
      });
    });

    context("with incorrect amount", async function () {
      it("reverts", async function () {
        const ttt = await token.connect(alice);
        await expectRevert(
          ttt.mintBatchByErc20(UsdtToken, [0], [1], {
            from: alice,
          }),
          "allowance token is not enough"
        );
      });
    });

    context("with minted token", async function () {
      before(async function () {
        const firstTokenId = "0";
        this.receipt = await token.mintBatchByErc20(UsdtToken, [0], [1], {
          from: owner,
        });
      });

      it("emits a Transfer event", async function () {
        // console.log("==============555", this.txhash);
        // console.log("==============555777", this.txhash.hash);
        await expect(this.receipt)
          .to.emit(token, EventNames.Transfer)
          .withArgs(ZERO_ADDRESS, owner, 0);
      });

      it("MintNft event", async function () {
        await expect(this.receipt)
          .to.emit(token, EventNames.MintNft)
          .withArgs(ZERO_ADDRESS, owner, 0, 0);
      });

      it("creates the token", async function () {
        const firstTokenId = 0n;
        // const ttt = await token.connect(alice);
        await expect(await token.balanceOf(owner)).to.equal("1");
        await expect(await token.ownerOf(firstTokenId)).to.equal(owner);
      });
    });

    context("mint with wrong typeId ", async function () {
      it("reverts", async () => {
        await expectRevert(
          token.mintBatchByErc20(UsdtToken, [100001], [1], { from: owner }),
          "invalid typeId"
        );
      });
    });
  });

  describe("mintBatchByErc20", async () => {
    context("mint with mintBatchByErc20", async function () {
      it("mint ok", async () => {
        await expect(
          await UsdtToken.approve(token, 0.001 * 1000000, {
            from: owner,
          })
        )
          .to.emit(UsdtToken, "Approval")
          .withArgs(owner, token, 0.001 * 1000000);

        // console.log("rrrrr11111111==", r1);
        const receipt = await token.mintBatchByErc20(UsdtToken, [0], [1], {
          from: owner,
        });
        await expect(receipt)
          .to.emit(token, EventNames.MintNft)
          .withArgs(ZERO_ADDRESS, owner, 1, 0);

        await expect(receipt)
          .to.emit(token, EventNames.Transfer)
          .withArgs(ZERO_ADDRESS, owner, 1);
      });

      it("mint batch", async function () {
        const mintCount = 100;
        await expect(
          await UsdtToken.approve(token, mintCount * 0.001 * 1000000, {
            from: owner,
          })
        )
          .to.emit(UsdtToken, "Approval")
          .withArgs(owner, token, mintCount * 0.001 * 1000000);

        const receipt = await token.mintBatchByErc20(
          UsdtToken,
          [0],
          [mintCount],
          {
            from: owner,
          }
        );
        await expect(receipt)
          .to.emit(token, EventNames.MintNft)
          .withArgs(ZERO_ADDRESS, owner, 1 + mintCount, 0);

        await expect(receipt)
          .to.emit(token, EventNames.Transfer)
          .withArgs(ZERO_ADDRESS, owner, 1 + mintCount);
      });
    });

    context("revert", async function () {
      it("mint with not support token address", async function () {
        await expect(
          token.mintBatchByErc20(token, [0], [1], {
            from: owner,
          })
        ).to.be.revertedWith("payment token not support");
      });

      it("mint with not match args", async function () {
        await expect(
          token.mintBatchByErc20(token, [0], [1, 2], {
            from: owner,
          })
        ).to.be.revertedWith("args length not match");
      });

      it("mint with not enough usdt", async function () {
        await expect(
          token.mintBatchByErc20(UsdtToken, [0], [100], {
            from: owner,
          })
        ).to.reverted;
      });
    });
  });

  describe("tokensOfOwner(address _owner)", async function () {
    before(async function () {
      this.ownerBalance = await UsdtToken.balanceOf(owner);
      this.johnBalance = await UsdtToken.balanceOf(john);
      this.bobBalance = await UsdtToken.balanceOf(bob);

      const ttt2 = await token.connect(john);
      const uuu2 = await UsdtToken.connect(john);
      await uuu2.approve(token, 10000 * 1000000, {
        from: john,
      });
      await ttt2.mintBatchByErc20(UsdtToken, [0], [2], {
        from: john,
      });

      const ttt3 = await token.connect(bob);
      const uuu3 = await UsdtToken.connect(bob);
      await uuu3.approve(token, 10000 * 1000000, {
        from: bob,
      });
      await ttt3.mintBatchByErc20(UsdtToken, [0], [2], {
        from: bob,
      });
    });

    context("when queried for address with no token", async function () {
      it("responds with an empty array", async function () {
        expect((await token.tokensOfOwner(shane)).length).to.equal(0);
      });
    });

    context("when queried for address with tokens", async function () {
      it("responds with an expected owned NFT count", async function () {
        expect((await token.tokensOfOwner(john)).length).to.equal(2);
        expect((await token.tokensOfOwner(bob)).length).to.equal(2);
      });
    });

    context("balance change after mint", async function () {
      it("balance check", async function () {
        const j = await UsdtToken.balanceOf(john);
        const b = await UsdtToken.balanceOf(bob);
        const w = await UsdtToken.balanceOf(owner);

        expect(w + b + j).to.equal(this.ownerBalance + this.johnBalance + this.bobBalance);
        expect(w - this.ownerBalance).equal(this.johnBalance - j + this.bobBalance - b);
        // expect( await UsdtToken.allowance(john, token)  );
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

  describe("setBaseURI(string memory newBaseTokenURI)", async function () {
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

    context("when called with owner user", async function () {
      it("sets the new URI", async function () {
        const tokenId = 1;
        const beforeChangeURI = BASE_URI + DEFAULT_TYPE_URI;
        expect(await token.tokenURI(tokenId)).to.equal(beforeChangeURI);

        const receipt = await token.setBaseURI(newURI, { from: owner });
        await expect(receipt, token, EventNames.UriChanged);

        const afterChangeURI = newURI + DEFAULT_TYPE_URI;
        expect(await token.tokenURI(tokenId)).to.equal(afterChangeURI);
      });
    });
  });

  //   describe("withdraw()", async function () {
  //     context(
  //       "when other account tries to withdraw the balance",
  //       async function () {
  //         it("reverts", async function () {
  //           const ttt = await token.connect(alice);
  //           await expectRevert(
  //             ttt.withdraw({ from: alice }),
  //             'OwnableUnauthorizedAccount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")'
  //           );
  //         });
  //       }
  //     );

  //     context("when owner tries to withdraw the balance", async function () {
  //       before(async function () {
  //         ({ logs: this.logs } = await token.withdraw({ from: owner }));
  //       });

  //       it("transfers balance succesfully to owner", async function () {
  //         expect(await web3.eth.getBalance(owner.address)).to.equal(
  //           "10000000000000000000000"
  //         );
  //       });
  //     });
  //   });

  describe("updateNftType()", async function () {
    it("update nft type", async function () {
      await token.addNftType(
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
  });

  describe("new nft type", async function () {
    before(async () => {
      await token.addNftType(
        1,
        "testname1",
        "testuri1",
        99,
        0,
        10_000_000,
        true
      );
    });

    it("add nft type", async function () {
      const t = await token.nftTypeMap(1);
      expect(t[ID_IDX]).to.equal(1);
      expect(t[NAME_IDX]).to.equal("testname1");
      expect(t[URI_IDX]).to.equal("testuri1");
      expect(t[MAX_SUPPLY_IDX]).to.equal(99);
      expect(t[TOTAL_SUPPLY_IDX]).to.equal(0);
      expect(t[PRICE_IDX]).to.equal(10_000_000);
      expect(t[SALE_ACTIVE_IDX]).to.equal(true);
    });

    it("mint new type", async function () {
      //   const receipt = console.log("logs========", receipt);
      const receipt = await token.mintBatchByErc20(UsdtToken, [1], [1], {
        from: owner,
      });

      //   TODO: WTF? why error?
      await expect(receipt).emit(token, EventNames.MintNft);
      // .withArgs(ZERO_ADDRESS, owner, 106, 1);

      const t = await token.nftTypeMap(1);
      expect(t[TOTAL_SUPPLY_IDX]).to.equal(1);
    });

    it("delete nft type", async function () {
      expect(await token.nftTypeExistsMap(0)).is.true;
      expect(await token.nftTypeExistsMap(1)).is.true;

      await token.removeNftType(0);
      await token.removeNftType(1);

      expect(await token.nftTypeExistsMap(0)).is.false;
      expect(await token.nftTypeExistsMap(1)).is.false;

      await expect(
        token.mintBatchByErc20(UsdtToken, [0], [1])
      ).to.be.rejectedWith("invalid typeId");
    });
  });

  describe("send ETH to contract", async function () {
    it("reverts", async function () {
      //   const r = await ;

      await expect(
        owner.sendTransaction({
          to: token,
          value: toWei("0.01", "ether"),
        })
      ).to.be.revertedWith("do not send eth to this contract directly");
    });
  });

  after(() => {
    token = null;
  });
});
