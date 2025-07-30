import React from 'react';
import { Wallet, Shield, Users, TrendingUp } from 'lucide-react';
import { useVoting } from '../contexts/VotingContext';

const WalletConnect: React.FC = () => {
  const { wallet, connectWallet } = useVoting();

  if (wallet.isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Wallet Connected</p>
              <p className="text-green-300 text-sm">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-sm">Balance</p>
            <p className="text-white font-medium">{wallet.balance} ETH</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white">
          Decentralized Voting
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Secure, transparent, and tamper-proof elections powered by blockchain technology
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Secure & Immutable</h3>
          <p className="text-blue-100 text-sm">
            Every vote is recorded on the blockchain, ensuring complete transparency and preventing tampering.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">One Person, One Vote</h3>
          <p className="text-blue-100 text-sm">
            Smart contracts automatically prevent double voting using wallet address validation.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-300" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Live Results</h3>
          <p className="text-blue-100 text-sm">
            View real-time voting results directly from the blockchain with interactive charts.
          </p>
        </div>
      </div>

      {/* Connect Button */}
      <div className="space-y-4">
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3 mx-auto"
        >
          <Wallet className="w-5 h-5" />
          <span>Connect MetaMask Wallet</span>
        </button>
        
        <p className="text-blue-200 text-sm">
          You need MetaMask or a compatible Web3 wallet to participate in voting
        </p>
      </div>
    </div>
  );
};

export default WalletConnect;