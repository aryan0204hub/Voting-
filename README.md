# 🗳️ Decentralized Voting DApp

A fully functional decentralized application (DApp) for conducting secure, transparent elections using Ethereum smart contracts and Web3.js.

## 📌 Features

✅ Admin panel for:
- Adding candidates
- Registering voters
- Starting and ending elections
- Viewing registered voters

✅ Voter portal for:
- Viewing candidates dynamically
- Casting votes securely

✅ Results page:
- Displaying election results in real-time after election ends

✅ Blockchain-based:
- All transactions recorded on the blockchain (Ganache local network)
- MetaMask wallet integration

✅ Responsive UI:
- Clean, modern design with Bootstrap
- Background images for professional look

## 🏗️ Tech Stack

- **Solidity** (Smart Contracts)
- **Web3.js**
- **Truffle Suite**
- **Ganache CLI**
- **MetaMask**
- **HTML/CSS/Bootstrap**
- **JavaScript**

## 📝 Installation

1️⃣ Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo.git
🔑 Usage
Open the DApp in the browser.

Use the Admin Panel to add candidates and register voters.

Start the election.

Switch to a registered voter’s MetaMask account and cast votes.

End the election.

View results on the Results page.

🦊 MetaMask Setup
Connect MetaMask to localhost 7545.

Import accounts using private keys from Ganache CLI if required.

📄 Smart Contract Details
Voting.sol:

addCandidate(string name, string party)

registerVoter(address voter)

startElection()

endElection()

vote(uint candidateIndex)

getCandidateCount()

getCandidate(uint index)

getRegisteredVoters()
