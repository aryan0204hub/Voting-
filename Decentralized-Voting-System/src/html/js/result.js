let web3;
let contract;
let account;

const contractAddress = "0xf15705dE9248aa2ff4aeF73b6c74EE02A06e82b1"; // ✅ Update if changed
const contractABI = [  {
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
  if (!window.ethereum) {
    alert('🦊 Please install MetaMask!');
    return;
  }

  web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: 'eth_requestAccounts' });

  const accounts = await web3.eth.getAccounts();
  account = accounts[0];

  contract = new web3.eth.Contract(contractABI, contractAddress);

  await showElectionStatus();
  await loadResults();
});

// Show election phase (Not Started / Ongoing / Ended)
async function showElectionStatus() {
  const statusDiv = document.getElementById('electionStatus');
  try {
    const phase = await contract.methods.phase().call();
    let statusHTML = '';

    if (parseInt(phase) === 1) {
      statusHTML = `<div class="alert alert-warning">⚠️ Election is ongoing! Results may change.</div>`;
    } else if (parseInt(phase) === 2) {
      statusHTML = `<div class="alert alert-success">✅ Election has ended! Final results shown.</div>`;
    } else {
      statusHTML = `<div class="alert alert-info">ℹ️ Election has not started yet.</div>`;
    }

    statusDiv.innerHTML = statusHTML;
  } catch (error) {
    console.error("Election Status Error:", error);
    statusDiv.innerHTML = `<div class="alert alert-danger">❌ Unable to fetch election status.</div>`;
  }
}

// Load results
async function loadResults() {
  const tableDiv = document.getElementById('resultsTable');
  tableDiv.innerHTML = '';

  try {
    const candidateCount = await contract.methods.getCandidateCount().call();
    let candidates = [];

    for (let i = 0; i < candidateCount; i++) {
      const candidate = await contract.methods.getCandidate(i).call();
      candidates.push({
        name: candidate[0],
        party: candidate[1],
        votes: parseInt(candidate[2])
      });
    }

    candidates.sort((a, b) => b.votes - a.votes); // Descending order

    let tableHTML = `
      <table class="table table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Party</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
    `;

    candidates.forEach((c, idx) => {
      const winnerBadge = idx === 0 ? '🏆' : '';
      tableHTML += `
        <tr class="${idx === 0 ? 'table-success' : ''}">
          <td>${idx + 1}</td>
          <td>${c.name} ${winnerBadge}</td>
          <td>${c.party}</td>
          <td>${c.votes}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    tableDiv.innerHTML = tableHTML;

  } catch (error) {
    console.error("Load Results Error:", error);
    tableDiv.innerHTML = `<div class="alert alert-danger">❌ Failed to load results.</div>`;
  }
}
