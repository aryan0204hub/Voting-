let web3;
let contract;
let account;

const contractAddress = "0xf15705dE9248aa2ff4aeF73b6c74EE02A06e82b1"; // Update if changed

const contractABI = [ {
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "candidates",
  "outputs": [
    {
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "party",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "voteCount",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "phase",
  "outputs": [
    {
      "internalType": "enum Voting.ElectionPhase",
      "name": "",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "registeredVoterAddresses",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "voters",
  "outputs": [
    {
      "internalType": "string",
      "name": "name",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "age",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "gender",
      "type": "string"
    },
    {
      "internalType": "bool",
      "name": "isRegistered",
      "type": "bool"
    },
    {
      "internalType": "bool",
      "name": "hasVoted",
      "type": "bool"
    },
    {
      "internalType": "bytes32",
      "name": "passkey",
      "type": "bytes32"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "_party",
      "type": "string"
    }
  ],
  "name": "addCandidate",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "_voter",
      "type": "address"
    },
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_age",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_gender",
      "type": "string"
    }
  ],
  "name": "registerVoter",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "startElection",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "endElection",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "candidateIndex",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_name",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "_age",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "_gender",
      "type": "string"
    }
  ],
  "name": "vote",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "getCandidateCount",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "index",
      "type": "uint256"
    }
  ],
  "name": "getCandidate",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "getRegisteredVoters",
  "outputs": [
    {
      "internalType": "address[]",
      "name": "",
      "type": "address[]"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
} ];

window.addEventListener('load', async () => {
  if (!window.ethereum) return alert("🦊 MetaMask not found!");

  web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const accounts = await web3.eth.getAccounts();
  account = accounts[0];

  contract = new web3.eth.Contract(contractABI, contractAddress);

  await updatePhase();
  await loadCandidates();  // 🟢 Load candidates as soon as the page loads
});

async function updatePhase() {
  try {
    const phase = await contract.methods.phase().call();
    const text = ["Not Started", "Ongoing", "Ended"][parseInt(phase)];
    document.getElementById('phaseInfo').innerText = `📍 Current Phase: ${text}`;
  } catch (err) {
    console.error("Phase error:", err);
    document.getElementById('phaseInfo').innerText = "❌ Could not fetch phase.";
  }
}

async function loadCandidates() {
  const container = document.getElementById('candidatesContainer');
  container.innerHTML = "";

  try {
    const count = await contract.methods.getCandidateCount().call();
    if (count == 0) {
      container.innerHTML = `<div class="alert alert-warning">⚠️ No candidates found.</div>`;
      return;
    }

    for (let i = 0; i < count; i++) {
      const c = await contract.methods.getCandidate(i).call();
      const html = `
        <div class="card text-dark bg-light mb-3" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">${c[0]}</h5>
            <p class="card-text">Party: ${c[1]}</p>
            <button class="btn btn-primary vote-button" disabled onclick="voteForCandidate(${i})">Vote</button>
          </div>
        </div>
      `;
      container.innerHTML += html;
    }

    validateVoterForm(); // re-enable buttons if form already filled
  } catch (error) {
    console.error("Candidate loading failed:", error);
    container.innerHTML = `<div class="alert alert-danger">❌ Failed to load candidates.</div>`;
  }
}

async function voteForCandidate(index) {
  const name = document.getElementById("voterName").value.trim();
  const age = parseInt(document.getElementById("voterAge").value.trim());
  const gender = document.getElementById("voterGender").value.trim();

  if (!name || !age || !gender) {
    alert("❌ Fill in your voter details first.");
    return;
  }

  document.getElementById("loadingSpinner").classList.remove("d-none");

  try {
    await contract.methods.vote(index, name, age, gender).send({ from: account });
    alert("✅ Vote cast successfully!");
  } catch (err) {
    console.error("Vote error:", err);
    alert("❌ " + err.message);
  } finally {
    document.getElementById("loadingSpinner").classList.add("d-none");
  }
}
