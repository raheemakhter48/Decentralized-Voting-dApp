export interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
  imageUrl?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  totalVotes: number;
}

export interface VoteTransaction {
  hash: string;
  voter: string;
  candidateId: number;
  timestamp: Date;
  gasUsed: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
}

export interface VotingContextType {
  wallet: WalletState;
  currentElection: Election | null;
  userVote: number | null;
  connectWallet: () => Promise<void>;
  vote: (candidateId: number) => Promise<void>;
  isVoting: boolean;
  hasVoted: boolean;
  addCandidate: (name: string) => Promise<void>;
}