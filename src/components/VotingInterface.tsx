import React from 'react';
import { Check, Clock, User, Trophy } from 'lucide-react';
import { useVoting } from '../contexts/VotingContext';

const VotingInterface: React.FC = () => {
  const { currentElection, vote, isVoting, hasVoted, userVote, wallet } = useVoting();

  // 1. Only show voting section if wallet is connected
  if (!wallet.isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-blue-200 text-lg mb-4">Please connect your MetaMask wallet to participate in voting.</p>
      </div>
    );
  }

  // 2. Show loading if election data is not loaded
  if (!currentElection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-blue-200 text-lg">Loading election data from blockchain...</p>
      </div>
    );
  }

  const sortedCandidates = [...currentElection.candidates].sort((a, b) => b.voteCount - a.voteCount);
  const leader = sortedCandidates[0];
  const votingClosed = !currentElection.isActive;

  return (
    <div className="space-y-8">
      {/* Election Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentElection.title}
            </h1>
            <p className="text-blue-100 text-lg">
              {currentElection.description}
            </p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${votingClosed ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{votingClosed ? 'Voting Ended' : 'Active'}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{currentElection.totalVotes}</div>
            <div className="text-blue-200 text-sm">Total Votes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{currentElection.candidates.length}</div>
            <div className="text-blue-200 text-sm">Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-300">{leader.name.split(' ')[0]}</div>
            <div className="text-blue-200 text-sm">Current Leader</div>
          </div>
        </div>
      </div>

      {/* Voting Status */}
      {hasVoted && !votingClosed && (
        <div className="bg-green-500/20 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-green-300 font-semibold">Vote Recorded Successfully!</h3>
              <p className="text-green-200 text-sm">
                You voted for: {currentElection.candidates.find(c => c.id === userVote)?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Candidates Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {sortedCandidates.map((candidate, index) => {
          const votePercentage = currentElection.totalVotes > 0 
            ? (candidate.voteCount / currentElection.totalVotes * 100).toFixed(1)
            : '0';
          const isWinner = index === 0 && candidate.voteCount > 0;
          const hasUserVoted = userVote === candidate.id;

          return (
            <div
              key={candidate.id}
              className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 border transition-all duration-300 transform hover:scale-102 ${
                hasUserVoted 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-white/20 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="relative">
                  {candidate.imageUrl ? (
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/20">
                      {candidate.name[0]}
                    </div>
                  )}
                  {isWinner && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                    {hasUserVoted && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-blue-100 text-sm mb-4">{candidate.description}</p>
                  {/* Vote Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Votes: {candidate.voteCount}</span>
                      <span className="text-blue-200">{votePercentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${votePercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Vote Button */}
              <button
                onClick={() => vote(candidate.id)}
                disabled={votingClosed || hasVoted || isVoting}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  votingClosed
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : hasVoted
                      ? hasUserVoted
                        ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                        : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {votingClosed ? (
                  <span>Voting Period Ended</span>
                ) : isVoting && userVote === candidate.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Voting...</span>
                  </>
                ) : hasVoted ? (
                  hasUserVoted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Your Vote</span>
                    </>
                  ) : (
                    <span>Voting Closed</span>
                  )
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Vote for {candidate.name.split(' ')[0]}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VotingInterface;