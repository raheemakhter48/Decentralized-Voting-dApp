import React, { useState } from 'react';
import { Vote, BarChart3, Settings, Wallet } from 'lucide-react';
import { useVoting } from '../contexts/VotingContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { wallet } = useVoting();

  if (!wallet.isConnected) return null;

  const tabs = [
    { id: 'vote', label: 'Vote', icon: Vote },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'admin', label: 'Admin', icon: Settings }
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="text-right">
            <p className="text-white text-sm font-medium">
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </p>
            <p className="text-blue-300 text-xs">{wallet.balance} ETH</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;