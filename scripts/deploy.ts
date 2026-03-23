import { createWalletClient, http, publicActions, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import * as fs from "fs";
import * as path from "path";
import solc from "solc";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PK = process.env.PRIVATE_KEY as `0x${string}`;

async function main() {
  const account = privateKeyToAccount(PK);
  const client = createWalletClient({
    account,
    chain: base,
    transport: http(),
  }).extend(publicActions);

  console.log(`Deploying from account: ${account.address}`);
  
  // 1. Compile Contract
  const sourceCode = fs.readFileSync(path.resolve(__dirname, "../contracts/PolyBondPool.sol"), "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "PolyBondPool.sol": {
        content: sourceCode,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  console.log("Compiling contract...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    let hasError = false;
    output.errors.forEach((err: any) => {
      console.error(err.formattedMessage);
      if (err.severity === 'error') hasError = true;
    });
    if (hasError) {
      process.exit(1);
    }
  }

  const contract = output.contracts["PolyBondPool.sol"]["PolyBondPool"];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object as `0x${string}`;

  // 2. Deploy
  const AI_AGENT_ADDRESS = "0x6727B7270F917D5491C932Dc08204b067c20dd1c";
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  console.log("Estimating gas and deploying to Base Mainnet...");
  
  const hash = await client.deployContract({
    abi,
    bytecode,
    args: [AI_AGENT_ADDRESS, USDC_ADDRESS],
  });

  console.log(`Transaction hash: ${hash}`);

  const receipt = await client.waitForTransactionReceipt({ hash });
  
  console.log(`Contract successfully deployed!`);
  console.log(`Address: ${receipt.contractAddress}`);
  
  // Update the frontend config file
  const configPath = path.resolve(__dirname, "../config/contracts.ts");
  let configContent = fs.readFileSync(configPath, "utf8");
  configContent = configContent.replace(
    /export const POLYBOND_STRATEGY_ADDRESS = ".*";/,
    `export const POLYBOND_STRATEGY_ADDRESS = "${receipt.contractAddress}";`
  );
  fs.writeFileSync(configPath, configContent);
  console.log("Updated config/contracts.ts with the new address.");
}

main().catch(console.error);
