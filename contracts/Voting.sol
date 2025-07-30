// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public admin;
    uint public votingDeadline;
    bool public hasDeadline;
    mapping(address => bool) public hasVoted;
    Candidate[] public candidates;

    event Voted(address indexed voter, uint indexed candidateIndex);
    event VotingEnded();

    constructor(string[] memory candidateNames, uint _votingDeadline) {
        admin = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
        }
        if (_votingDeadline > 0) {
            votingDeadline = block.timestamp + _votingDeadline;
            hasDeadline = true;
        } else {
            hasDeadline = false;
        }
    }

    function vote(uint candidateIndex) external {
        require(!hasDeadline || block.timestamp < votingDeadline, "Voting has ended");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");
        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        emit Voted(msg.sender, candidateIndex);
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getResults() external view returns (uint[] memory) {
        uint[] memory results = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            results[i] = candidates[i].voteCount;
        }
        return results;
    }

    function endVoting() external {
        require(msg.sender == admin, "Only admin can end voting");
        require(!hasDeadline, "Deadline already set");
        hasDeadline = true;
        votingDeadline = block.timestamp;
        emit VotingEnded();
    }

    function addCandidate(string memory name) public {
        require(msg.sender == admin, "Only admin can add candidates");
        candidates.push(Candidate({name: name, voteCount: 0}));
    }
} 