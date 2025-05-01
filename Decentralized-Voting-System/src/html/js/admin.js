let web3;
let contract;
let account;

const contractAddress = "0xf15705dE9248aa2ff4aeF73b6c74EE02A06e82b1"; // ✅ Make sure this is the correct deployed contract address
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
  if (typeof window.ethereum === 'undefined') {
    alert('🦊 Please install MetaMask!');
    return;
  }

  web3 = new Web3(window.ethereum);

  try {
    const accounts = await web3.eth.getAccounts();
    
    if (accounts.length > 0) {
      account = accounts[0];
      console.log("👤 Already connected account:", account);
      contract = new web3.eth.Contract(contractABI, contractAddress);

      // Load everything you want (candidates, phase, voters list etc.)
      await updatePhase();
      await viewRegisteredVoters();
    } else {
      // No accounts connected, ask to connect
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountsAfterConnect = await web3.eth.getAccounts();
      account = accountsAfterConnect[0];
      console.log("👤 Connected account after request:", account);
      contract = new web3.eth.Contract(contractABI, contractAddress);

      await updatePhase();
      await viewRegisteredVoters();
    }
  } catch (error) {
    console.error('❌ MetaMask Connection Error:', error.message);
  }

  // 🔥 Also always listen for account change
  window.ethereum.on('accountsChanged', async (accounts) => {
    account = accounts[0];
    console.log("🔄 Account changed:", account);
    window.location.reload();
  });
});

// ✅ Add Candidate
async function addCandidate() {
  const name = document.getElementById('candidateName').value.trim();
  const party = document.getElementById('candidateParty').value.trim();

  if (!name || !party) {
    alert("❌ Please fill all candidate details.");
    return;
  }

  try {
    await contract.methods.addCandidate(name, party).send({ from: account });
    alert("✅ Candidate added!");
  } catch (error) {
    console.error("Add Candidate Error:", error);
    alert("❌ " + error.message);
  }
}

// ✅ Register Voter
async function registerVoter() {
  const voterAddr = document.getElementById('voterAddress').value.trim();
  const voterName = document.getElementById('voterName').value.trim();
  const voterAge = parseInt(document.getElementById('voterAge').value.trim());
  const voterGender = document.getElementById('voterGender').value.trim();

  if (!voterAddr || !voterName || !voterAge || !voterGender) {
    alert("❌ Please fill all voter details!");
    return;
  }

  try {
    await contract.methods.registerVoter(voterAddr, voterName, voterAge, voterGender)
      .send({ from: account });

    // ✅ Show success message
    const successDiv = document.getElementById('voterSuccess');
    successDiv.classList.remove('d-none');
    successDiv.innerHTML = `✅ Voter ${voterName} registered successfully!`;

    // ✅ Clear the form for next voter
    document.getElementById('voterAddress').value = '';
    document.getElementById('voterName').value = '';
    document.getElementById('voterAge').value = '';
    document.getElementById('voterGender').value = '';

    viewRegisteredVoters();
  } catch (error) {
    console.error("Register Voter Error:", error);
    alert("❌ " + error.message);
  }
}


// ✅ New function to show Voter Slip
function showVoterSlip(name, age, gender) {
  const slipContainer = document.getElementById('voterSlip');
  slipContainer.innerHTML = `
    <div class="card mt-4 p-4" id="slipCard">
      <h4 class="card-title text-success mb-3">🎉 Voter Registration Successful!</h4>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Age:</strong> ${age}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p class="text-muted mt-2">⚡ Please save this slip. You will need the same details to vote.</p>
      <button class="btn btn-outline-primary mt-3" onclick="downloadSlipPDF()">Download as PDF</button>
    </div>
  `;
}

async function downloadSlipPDF() {
  const element = document.getElementById('slipCard');
  if (!element) {
    alert("❌ No slip available to download!");
    return;
  }

  const opt = {
    margin:       0.5,
    filename:     'voter_slip.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  await html2pdf().from(element).set(opt).save();
}

// ✅ View Registered Voters
async function viewRegisteredVoters() {
  const container = document.getElementById('registeredVotersList');
  if (!container) {
    console.error("❌ registeredVotersList element not found in HTML");
    return;
  }

  try {
    const voters = await contract.methods.getRegisteredVoters().call();
    console.log("Registered voters:", voters);

    if (voters.length === 0) {
      container.innerHTML = "<div class='alert alert-warning'>No voters registered yet.</div>";
      return;
    }

    let html = "<ul class='list-group'>";
    voters.forEach((voter, index) => {
      html += `<li class="list-group-item">${index + 1}. ${voter}</li>`;
    });
    html += "</ul>";

    container.innerHTML = html;
  } catch (error) {
    console.error("View Registered Voters Error:", error);
    container.innerHTML = "❌ Failed to load voters";
  }
}

// ✅ Start Election
async function startElection() {
  if (!contract) return alert("❌ Contract not initialized");

  try {
    await contract.methods.startElection().send({ from: account });
    alert("✅ Election started!");
    updatePhase();
  } catch (error) {
    console.error("Start Election Error:", error);
    alert("❌ " + error.message);
  }
}

// ✅ End Election
async function endElection() {
  if (!contract) return alert("❌ Contract not initialized");

  try {
    await contract.methods.endElection().send({ from: account });
    alert("🛑 Election ended!");
    updatePhase();
  } catch (error) {
    console.error("End Election Error:", error);
    alert("❌ " + error.message);
  }
}

// ✅ Update Phase
async function updatePhase() {
  try {
    const phase = await contract.methods.phase().call();
    const phaseText = ["Not Started", "Ongoing", "Ended"][parseInt(phase)];
    document.getElementById("electionPhase").textContent = phaseText;
  } catch (error) {
    console.error("Could not fetch phase:", error);
  }
}
