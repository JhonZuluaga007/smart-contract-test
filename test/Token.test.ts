import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseEther = (amount: string) => (hre as any).ethers.parseEther(amount);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatEther = (amount: bigint) => (hre as any).ethers.formatEther(amount);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ZeroAddress = (hre as any).ethers.ZeroAddress;

describe("Token", function () {
  async function deployTokenFixture() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [owner, account1, account2, account3, account4, account5, account9] =
      await (hre as any).ethers.getSigners();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TokenFactory = await (hre as any).ethers.getContractFactory("Token");
    const token = await TokenFactory.deploy();
    await token.waitForDeployment();

    return {
      token,
      owner,
      account1,
      account2,
      account3,
      account4,
      account5,
      account9,
    };
  }

  async function getBalance(address: string): Promise<bigint> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = (hre as any).ethers.provider;
    return await provider.getBalance(address);
  }

  async function assertHolderList(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: any,
    ...addresses: string[]
  ): Promise<void> {
    const numHolders = await token.getNumTokenHolders();
    const holders: string[] = [];

    for (let i = 1; i <= numHolders; i++) {
      const holder = await token.getTokenHolder(i);
      holders.push(holder);
    }

    const holdersSorted = holders.map((addr) => addr.toLowerCase()).sort();
    const expectedSorted = addresses.map((addr) => addr.toLowerCase()).sort();

    expect(holdersSorted.length).to.equal(expectedSorted.length);
    expect(holdersSorted).to.deep.equal(expectedSorted);
  }

  describe("Deployment", function () {
    it("Should have correct default values", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      expect(await token.name()).to.equal("Test token");
      expect(await token.symbol()).to.equal("TEST");
      expect(await token.decimals()).to.equal(18n);
      expect(await token.totalSupply()).to.equal(0n);
    });

    it("Should have zero holders initially", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      expect(await token.getNumTokenHolders()).to.equal(0n);
    });
  });

  describe("Minting", function () {
    it("Should reject minting without ETH", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      await expect(token.mint({ value: 0 })).to.be.revertedWith("Token: Must send ETH to mint");
    });

    it("Should mint tokens when ETH is sent", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("23") });

      expect(await token.balanceOf(owner.address)).to.equal(parseEther("23"));
      expect(await token.totalSupply()).to.equal(parseEther("23"));

      await token.mint({ value: parseEther("50") });

      expect(await token.balanceOf(owner.address)).to.equal(parseEther("73"));
      expect(await token.totalSupply()).to.equal(parseEther("73"));
    });

    it("Should track ETH balance in contract", async function () {
      const { token, owner, account1 } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("23") });
      await token.mint({ value: parseEther("50") });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = (hre as any).ethers.provider;
      const contractBalance = await provider.getBalance(await token.getAddress());
      expect(contractBalance).to.equal(parseEther("73"));

      await token.connect(account1).mint({ value: parseEther("50") });

      const contractBalance2 = await provider.getBalance(await token.getAddress());
      expect(contractBalance2).to.equal(parseEther("123"));
    });

    it("Should emit Mint event", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      const tx = await token.mint({ value: parseEther("10") });
      await expect(tx).to.emit(token, "Mint").withArgs(owner.address, parseEther("10"));
    });

    it("Should add holder to list when minting", async function () {
      const { token, owner, account1 } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("10") });
      await assertHolderList(token, owner.address);

      await token.connect(account1).mint({ value: parseEther("20") });
      await assertHolderList(token, owner.address, account1.address);
    });
  });

  describe("Burning", function () {
    it("Should reject burning with zero balance", async function () {
      const { token, account1 } = await loadFixture(deployTokenFixture);

      await expect(
        token.connect(account1).burn(account1.address)
      ).to.be.revertedWith("Token: No tokens to burn");
    });

    it("Should reject burning to zero address", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("10") });

      await expect(
        token.burn(ZeroAddress)
      ).to.be.revertedWith("Token: Invalid destination address");
    });

    it("Should burn tokens and send ETH back", async function () {
      const { token, owner, account1, account9 } = await loadFixture(
        deployTokenFixture
      );

      await token.mint({ value: parseEther("23") });
      await token.connect(account1).mint({ value: parseEther("50") });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = (hre as any).ethers.provider;
      const contractBalanceBefore = await provider.getBalance(await token.getAddress());
      expect(contractBalanceBefore).to.equal(parseEther("73"));

      const preBal = await getBalance(account9.address);

      await token.burn(account9.address);

      const contractBalanceAfter = await provider.getBalance(await token.getAddress());
      expect(contractBalanceAfter).to.equal(parseEther("50"));

      const postBal = await getBalance(account9.address);
      expect(postBal - preBal).to.equal(parseEther("23"));
    });

    it("Should emit Burn event", async function () {
      const { token, owner, account1 } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("10") });

      const tx = await token.burn(account1.address);
      await expect(tx).to.emit(token, "Burn").withArgs(owner.address, parseEther("10"), account1.address);
    });

    it("Should remove holder from list when balance is zero", async function () {
      const { token, owner, account1, account9 } = await loadFixture(
        deployTokenFixture
      );

      await token.mint({ value: parseEther("10") });
      await token.connect(account1).mint({ value: parseEther("20") });
      await assertHolderList(token, owner.address, account1.address);

      await token.burn(account9.address);
      await assertHolderList(token, account1.address);
    });
  });

  describe("Transfers", function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let token: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let owner: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account1: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account2: any;

    beforeEach(async function () {
      const fixture = await loadFixture(deployTokenFixture);
      token = fixture.token;
      owner = fixture.owner;
      account1 = fixture.account1;
      account2 = fixture.account2;

      await token.mint({ value: parseEther("50") });
      await token.connect(account1).mint({ value: parseEther("50") });
    });

    it("Should transfer tokens directly", async function () {
      await token.connect(account1).transfer(account2.address, parseEther("1"));

      expect(await token.balanceOf(account1.address)).to.equal(
        parseEther("49")
      );
      expect(await token.balanceOf(account2.address)).to.equal(
        parseEther("1")
      );
      expect(await token.totalSupply()).to.equal(parseEther("100"));
    });

    it("Should reject transfer with insufficient balance", async function () {
      await expect(
        token.connect(account2).transfer(account1.address, parseEther("2"))
      ).to.be.reverted;
    });

    it("Should transfer tokens via approve/transferFrom", async function () {
      await token.approve(account1.address, parseEther("5"));

      expect(
        await token.allowance(owner.address, account1.address)
      ).to.equal(parseEther("5"));

      await token.approve(account1.address, parseEther("10"));

      expect(
        await token.allowance(owner.address, account1.address)
      ).to.equal(parseEther("10"));

      await expect(
        token
          .connect(account1)
          .transferFrom(owner.address, account2.address, parseEther("11"))
      ).to.be.reverted;

      await token
        .connect(account1)
        .transferFrom(owner.address, account2.address, parseEther("9"));

      expect(await token.balanceOf(owner.address)).to.equal(
        parseEther("41")
      );
      expect(await token.balanceOf(account1.address)).to.equal(
        parseEther("50")
      );
      expect(await token.balanceOf(account2.address)).to.equal(
        parseEther("9")
      );

      expect(
        await token.allowance(owner.address, account1.address)
      ).to.equal(parseEther("1"));
    });

    it("Should update holders list on transfer", async function () {
      await token.transfer(account2.address, parseEther("25"));
      await assertHolderList(token, owner.address, account1.address, account2.address);

      await token.transfer(account2.address, parseEther("25"));
      await assertHolderList(token, account1.address, account2.address);
    });
  });

  describe("Dividends", function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let token: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let owner: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account1: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account2: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account3: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account5: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account9: any;

    beforeEach(async function () {
      const fixture = await loadFixture(deployTokenFixture);
      token = fixture.token;
      owner = fixture.owner;
      account1 = fixture.account1;
      account2 = fixture.account2;
      account3 = fixture.account3;
      account5 = fixture.account5;
      account9 = fixture.account9;

      await token.mint({ value: parseEther("50") });
      await token.connect(account1).mint({ value: parseEther("50") });
    });

    it("Should reject empty dividend", async function () {
      await expect(
        token.connect(account5).recordDividend({ value: 0 })
      ).to.be.revertedWith("Token: Must send ETH to record dividend");
    });

    it("Should reject dividend when no token holders", async function () {
      const { token: newToken, account5: payer } = await loadFixture(
        deployTokenFixture
      );

      await expect(
        newToken.connect(payer).recordDividend({ value: parseEther("100") })
      ).to.be.revertedWith("Token: No token holders");
    });

    it("Should track holders when minting and burning", async function () {
      await assertHolderList(token, owner.address, account1.address);

      await token.connect(account2).mint({ value: parseEther("100") });

      await token.burn(account9.address);

      expect(await token.balanceOf(owner.address)).to.equal(0n);
      expect(await token.balanceOf(account1.address)).to.equal(
        parseEther("50")
      );
      expect(await token.balanceOf(account2.address)).to.equal(
        parseEther("100")
      );

      await assertHolderList(token, account1.address, account2.address);

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1500") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(0n);
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(
        parseEther("500")
      );
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("1000")
      );
    });

    it("Should track holders when transferring", async function () {
      await token.transfer(account2.address, parseEther("25"));
      await token.transfer(account3.address, parseEther("0"));

      await token.connect(account1).approve(owner.address, parseEther("50"));

      await token
        .connect(owner)
        .transferFrom(account1.address, account2.address, parseEther("50"));

      expect(await token.balanceOf(owner.address)).to.equal(
        parseEther("25")
      );
      expect(await token.balanceOf(account1.address)).to.equal(0n);
      expect(await token.balanceOf(account2.address)).to.equal(
        parseEther("75")
      );
      expect(await token.balanceOf(account3.address)).to.equal(0n);

      await assertHolderList(token, owner.address, account2.address);

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1000") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(0n);
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("750")
      );
      expect(await token.getWithdrawableDividend(account3.address)).to.equal(0n);
    });

    it("Should compound payouts", async function () {
      await token.transfer(account2.address, parseEther("25"));

      expect(await token.balanceOf(owner.address)).to.equal(
        parseEther("25")
      );
      expect(await token.balanceOf(account1.address)).to.equal(
        parseEther("50")
      );
      expect(await token.balanceOf(account2.address)).to.equal(
        parseEther("25")
      );

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1000") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(
        parseEther("500")
      );
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("250")
      );

      await token
        .connect(account1)
        .transfer(account2.address, parseEther("25"));

      await token.connect(account1).mint({ value: parseEther("75") });

      await token.burn(account9.address);

      expect(await token.balanceOf(owner.address)).to.equal(0n);
      expect(await token.balanceOf(account1.address)).to.equal(
        parseEther("100")
      );
      expect(await token.balanceOf(account2.address)).to.equal(
        parseEther("50")
      );
      expect(await token.totalSupply()).to.equal(parseEther("150"));

      await assertHolderList(token, account1.address, account2.address);

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("90") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(
        parseEther("560")
      );
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("280")
      );
    });

    it("Should allow withdrawals between payouts", async function () {
      await token.transfer(account2.address, parseEther("25"));

      await assertHolderList(
        token,
        owner.address,
        account1.address,
        account2.address
      );

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1000") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(
        parseEther("500")
      );
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("250")
      );

      const preBal = await getBalance(account9.address);
      await token
        .connect(account1)
        .withdrawDividend(account9.address);
      const postBal = await getBalance(account9.address);
      expect(postBal - preBal).to.equal(parseEther("500"));

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(0n);
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("250")
      );
    });

    it("Should reject withdrawal to zero address", async function () {
      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1000") });

      await expect(
        token.connect(account1).withdrawDividend(ZeroAddress)
      ).to.be.revertedWith("Token: Invalid destination address");
    });

    it("Should reject withdrawal with zero dividend", async function () {
      await expect(
        token.connect(account2).withdrawDividend(account9.address)
      ).to.be.revertedWith("Token: No dividend to withdraw");
    });

    it("Should allow withdrawals even after holder relinquishes tokens", async function () {
      await token.transfer(account2.address, parseEther("25"));

      await assertHolderList(
        token,
        owner.address,
        account1.address,
        account2.address
      );

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1000") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(
        parseEther("500")
      );
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("250")
      );

      const preBal = await getBalance(account9.address);

      await token.connect(account1).burn(account9.address);

      await assertHolderList(token, owner.address, account2.address);

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(
        parseEther("500")
      );
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("250")
      );

      await token.connect(account1).withdrawDividend(account9.address);

      const postBal = await getBalance(account9.address);
      expect(postBal - preBal).to.equal(parseEther("550"));

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("250")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(0n);
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("250")
      );

      await token
        .connect(account5)
        .recordDividend({ value: parseEther("80") });

      expect(await token.getWithdrawableDividend(owner.address)).to.equal(
        parseEther("290")
      );
      expect(await token.getWithdrawableDividend(account1.address)).to.equal(0n);
      expect(await token.getWithdrawableDividend(account2.address)).to.equal(
        parseEther("290")
      );
    });

    it("Should emit DividendRecorded event", async function () {
      const tx = await token.connect(account5).recordDividend({ value: parseEther("1000") });
      await expect(tx).to.emit(token, "DividendRecorded").withArgs(parseEther("1000"), parseEther("100"));
    });

    it("Should emit DividendWithdrawn event", async function () {
      await token
        .connect(account5)
        .recordDividend({ value: parseEther("1000") });

      const tx = await token.connect(account1).withdrawDividend(account9.address);
      await expect(tx).to.emit(token, "DividendWithdrawn").withArgs(
        account1.address,
        parseEther("500"),
        account9.address
      );
    });
  });

  describe("Security", function () {
    it("Should reject burn with zero address", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("10") });

      await expect(token.burn(ZeroAddress)).to.be.revertedWith(
        "Token: Invalid destination address"
      );
    });

    it("Should reject withdrawDividend with zero address", async function () {
      const { token, account1 } = await loadFixture(deployTokenFixture);

      await token.mint({ value: parseEther("10") });
      await token.recordDividend({ value: parseEther("100") });

      await expect(
        token.connect(account1).withdrawDividend(ZeroAddress)
      ).to.be.revertedWith("Token: Invalid destination address");
    });

    it("Should handle getTokenHolder with invalid index", async function () {
      const { token } = await loadFixture(deployTokenFixture);

      await expect(token.getTokenHolder(0)).to.be.revertedWith(
        "Token: Index out of bounds"
      );

      await expect(token.getTokenHolder(1)).to.be.revertedWith(
        "Token: Index out of bounds"
      );
    });
  });
});
