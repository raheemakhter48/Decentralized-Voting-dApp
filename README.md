# Decentralized Voting dApp

This is a decentralized voting application (dApp) for transparent, fair, and immutable student or organizational elections. Built with Solidity smart contracts and a React-based frontend, it allows eligible users to securely cast their vote using a blockchain wallet like MetaMask. Each vote is recorded on the blockchain, ensuring no vote can be altered or duplicated. Results are live, publicly verifiable, and tamper-proof.

## 🚀 Features
- **One Person, One Vote**: Voters can only vote once. Double voting is prevented by the smart contract.
- **Decentralized & Secure**: All votes are recorded on a public blockchain.
- **Wallet Integration**: Voters connect their wallet (e.g., MetaMask) to authenticate and interact with the contract.
- **Live Vote Counting**: Users can view live results from the blockchain.
- **Admin Panel**: Admin can add new candidates, end voting, and manage the election.
- **Image Upload**: Admin can upload candidate images from their computer.

## 🛠️ Tech Stack
- **Smart Contract**: Solidity
- **Blockchain**: Polygon Mumbai Testnet / Local Hardhat
- **Frontend**: React.js (Vite + TypeScript)
- **Library**: Ethers.js
- **Wallet**: MetaMask
- **Styling**: Tailwind CSS
- **Charting**: Recharts

---

## 📝 How to Start the Project

### 1. **Clone the Repository**
```sh
git clone <repo-url>
cd <project-folder>
```

### 2. **Install Dependencies**
```sh
npm install
```

### 3. **Setup .env File**
Create a `.env` file in the project root (not inside `src/`). Example:
```
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID
```
- Replace `YOUR_INFURA_PROJECT_ID` with your Infura (or Alchemy) project ID.
- Use a testnet wallet private key (never use your mainnet/private wallet key).

### 4. **Deploy the Smart Contract**
- Update `hardhat.config.cjs` to use the `.env` variables for the Amoy network.
- Deploy to Polygon Amoy:
```sh
npx hardhat run scripts/deploy.cjs --network amoy
```
- Note the deployed contract address from the terminal output and update it in `src/abi/contractAddress.json` like this:
```json
{
  "address": "YOUR_DEPLOYED_CONTRACT_ADDRESS"
}
```

### 5. **Run the Frontend App**
```sh
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Make sure MetaMask is connected to the **Polygon Amoy Testnet**.
- If you see "Loading election data from blockchain..." for too long, check the browser console for errors and ensure the contract address is correct.

---

## 🧑‍💻 Full Setup Commands (Quick Reference)

```sh
# 1. Install dependencies (with peer deps workaround if needed)
npm install --legacy-peer-deps

# 2. Install required dev dependencies for Hardhat Toolbox
npm install --save-dev "@nomicfoundation/hardhat-chai-matchers@^2.1.0" "@nomicfoundation/hardhat-ethers@^3.1.0" "@nomicfoundation/hardhat-ignition-ethers@^0.15.14" "@nomicfoundation/hardhat-network-helpers@^1.1.0" "@nomicfoundation/hardhat-verify@^2.1.0" "@typechain/ethers-v6@^0.5.0" "@typechain/hardhat@^9.0.0" "@types/chai@^4.2.0" "@types/mocha@>=9.1.0" "chai@^4.2.0" "hardhat-gas-reporter@^2.3.0" "solidity-coverage@^0.8.1" "ts-node@>=8.0.0" "typechain@^8.3.0" --legacy-peer-deps

# 3. Install dotenv and react-is (if not already)
npm install dotenv react-is --legacy-peer-deps

# 4. Build frontend for production
npm run build

# 5. (Optional) Preview production build
npm run preview
```

---

## 🛠️ Troubleshooting
- **insufficient funds for gas**: Use the [Polygon Amoy Faucet](https://faucet.polygon.technology/) to get test MATIC for your wallet.
- **Error: Cannot find module 'dotenv'**: Run `npm install dotenv --legacy-peer-deps`.
- **Plugin requires dependencies**: Install all dev dependencies as shown above.
- **Frontend stuck on loading**: Make sure `src/abi/contractAddress.json` has the correct deployed address and your MetaMask is on Amoy.
- **Console error about contract address**: In `VotingContext.tsx`, use `contractAddressJson.address` (not `.Voting`).

---

## 🎯 Use Case
Ideal for universities, schools, small organizations, or DAOs that need a transparent and fair voting system. This project showcases the power of blockchain beyond finance — solving real-world governance problems.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## ⚠️ Security Note
- Never share your private key publicly.
- Use only testnet wallets for development and testing.

Develop and Created By Abdul Raheem
