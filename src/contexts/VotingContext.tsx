import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VotingContextType, WalletState, Election, Candidate } from '../types/voting';
import { ethers } from 'ethers';
import votingAbiJson from '../abi/Voting.json';
import contractAddressJson from '../abi/contractAddress.json';

// Add this at the top for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const VOTING_CONTRACT_ADDRESS = contractAddressJson.address;
const VOTING_ABI = votingAbiJson.abi;

interface VotingProviderProps {
  children: ReactNode;
}

export const VotingProvider: React.FC<VotingProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: '0'
  });
  const [currentElection, setCurrentElection] = useState<Election | null>(null);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Connect wallet and set provider/contract
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        await ethProvider.send('eth_requestAccounts', []);
        const signer = await ethProvider.getSigner();
        const address = await signer.getAddress();
        const network = await ethProvider.getNetwork();
        const balance = await ethProvider.getBalance(address);
        setWallet({
          address,
          isConnected: true,
          chainId: Number(network.chainId),
          balance: ethers.formatEther(balance)
        });
        setProvider(ethProvider);
        const votingContract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer);
        setContract(votingContract);
      } else {
        alert('Please install MetaMask to use this application!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Fetch election/candidates from contract
  const fetchElection = async (votingContract: ethers.Contract) => {
    try {
      const candidates = await votingContract.getCandidates();
      const hasDeadline = await votingContract.hasDeadline();
      const votingDeadline = await votingContract.votingDeadline();
      const admin = await votingContract.admin();
      let totalVotes = 0;
      const formattedCandidates = candidates.map((c: any, idx: number) => {
        totalVotes += Number(c.voteCount);
        return {
          id: idx + 1,
          name: c.name,
          description: '', // Optionally fetch from IPFS or static
          voteCount: Number(c.voteCount),
          imageUrl: '' // Optionally fetch from IPFS or static
        };
      });
      setCurrentElection({
        id: '1',
        title: 'Student Council President Election 2025',
        description: 'Vote for your next student council president. Each wallet can vote only once.',
        candidates: formattedCandidates,
        startTime: new Date(),
        endTime: hasDeadline ? new Date(Number(votingDeadline) * 1000) : new Date(0),
        isActive: !hasDeadline || (Date.now() < Number(votingDeadline) * 1000),
        totalVotes
      });
    } catch (error) {
      console.error('Error fetching election:', error);
    }
  };

  // Check if user has voted
  const checkHasVoted = async (votingContract: ethers.Contract, address: string) => {
    try {
      const voted = await votingContract.hasVoted(address);
      setHasVoted(voted);
      if (voted) {
        // Optionally, fetch which candidate user voted for (not stored in contract, so skip)
        setUserVote(null);
      }
    } catch (error) {
      setHasVoted(false);
      setUserVote(null);
    }
  };

  // Vote for a candidate
  const vote = async (candidateId: number) => {
    if (!wallet.isConnected || hasVoted || !contract) return;
    setIsVoting(true);
    try {
      // Contract expects candidate index (0-based)
      const tx = await contract.vote(candidateId - 1);
      await tx.wait();
      setUserVote(candidateId);
      setHasVoted(true);
      await fetchElection(contract);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // Admin: Add new candidate
  const addCandidate = async (name: string) => {
    if (!wallet.isConnected || !contract) return;
    try {
      const adminAddress = await contract.admin();
      if (wallet.address?.toLowerCase() !== adminAddress.toLowerCase()) {
        alert('Only admin can add candidates');
        return;
      }
      const tx = await contract.addCandidate(name);
      await tx.wait();
      await fetchElection(contract);
    } catch (error) {
      console.error('Error adding candidate:', error);
      alert('Failed to add candidate.');
    }
  };

  // On wallet/contract change, fetch election and voting status
  useEffect(() => {
    if (contract && wallet.address) {
      fetchElection(contract);
      checkHasVoted(contract, wallet.address);
      // Listen for Voted event for live updates
      contract.on('Voted', () => fetchElection(contract));
      return () => {
        contract.removeAllListeners('Voted');
      };
    }
  }, [contract, wallet.address]);

  // Auto-connect wallet if already connected
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }
  }, []);

  const value: VotingContextType = {
    wallet,
    currentElection,
    userVote,
    connectWallet,
    vote,
    isVoting,
    hasVoted,
    addCandidate
  };

  return (
    <VotingContext.Provider value={value}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};