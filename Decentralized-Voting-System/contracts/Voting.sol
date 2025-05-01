// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    enum ElectionPhase { NOT_STARTED, ONGOING, ENDED }
    ElectionPhase public phase;

    struct Candidate {
        string name;
        string party;
        uint voteCount;
    }

    struct VoterDetails {
        string name;
        uint age;
        string gender;
        bool isRegistered;
        bool hasVoted;
        bytes32 passkey;
    }

    mapping(address => VoterDetails) public voters;
    Candidate[] public candidates;
    address[] public registeredVoterAddresses;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin can do this");
        _;
    }

    modifier inPhase(ElectionPhase _phase) {
        require(phase == _phase, "Wrong election phase");
        _;
    }

    constructor() {
        owner = msg.sender;
        phase = ElectionPhase.NOT_STARTED;
    }

    function addCandidate(string memory _name, string memory _party) public onlyOwner inPhase(ElectionPhase.NOT_STARTED) {
        candidates.push(Candidate(_name, _party, 0));
    }

    function registerVoter(address _voter, string memory _name, uint _age, string memory _gender) public onlyOwner inPhase(ElectionPhase.NOT_STARTED) {
        require(!voters[_voter].isRegistered, "Already registered");
        voters[_voter] = VoterDetails({
            name: _name,
            age: _age,
            gender: _gender,
            isRegistered: true,
            hasVoted: false,
            passkey: generatePasskey(_name, _age, _gender)
        });
        registeredVoterAddresses.push(_voter);
    }

    function generatePasskey(string memory _name, uint _age, string memory _gender) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _age, _gender));
    }

    function startElection() public onlyOwner {
        phase = ElectionPhase.ONGOING;
    }

    function endElection() public onlyOwner {
        phase = ElectionPhase.ENDED;
    }

    function vote(uint candidateIndex, string memory _name, uint _age, string memory _gender) public inPhase(ElectionPhase.ONGOING) {
        VoterDetails storage voter = voters[msg.sender];
        require(voter.isRegistered, "Not registered");
        require(!voter.hasVoted, "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        bytes32 inputPasskey = generatePasskey(_name, _age, _gender);
        require(inputPasskey == voter.passkey, "Voter details mismatch");

        candidates[candidateIndex].voteCount++;
        voter.hasVoted = true;
    }

    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }

    function getCandidate(uint index) public view returns (string memory, string memory, uint) {
        Candidate memory c = candidates[index];
        return (c.name, c.party, c.voteCount);
    }

    function getRegisteredVoters() public view returns (address[] memory) {
        return registeredVoterAddresses;
    }
}
