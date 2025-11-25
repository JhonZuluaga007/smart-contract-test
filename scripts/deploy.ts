import hre from "hardhat";
import { formatEther } from "ethers";

async function main(): Promise<void> {
  console.log("Deploying Token contract...");

  const signers = await (hre as any).ethers.getSigners();

  if (!signers || signers.length === 0) {
    throw new Error("No signers found");
  }

  const deployer = signers[0];
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await (hre as any).ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", formatEther(balance), "ETH");

  const TokenFactory = await (hre as any).ethers.getContractFactory("Token");
  const token = await TokenFactory.deploy();

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log(`\n✓ Token deployed to: ${tokenAddress}`);

  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();

  console.log("\nContract details:");
  console.log(`  Name: ${name}`);
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Initial Total Supply: ${formatEther(totalSupply)} ${symbol}`);
}

main()
  .then(() => {
    console.log("\nDeployment completed successfully");
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error("\nDeployment failed:", error);
    process.exit(1);
  });
