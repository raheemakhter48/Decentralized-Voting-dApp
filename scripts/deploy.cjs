const hre = require("hardhat");

async function main() {
  // Example candidates and deadline (e.g., 1 hour)
  const candidates = ["Alice", "Bob", "Charlie"];
  const deadlineSeconds = 3600; // 1 hour

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidates, deadlineSeconds);
  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", voting.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 