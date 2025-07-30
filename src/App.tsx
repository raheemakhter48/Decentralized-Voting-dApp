import React, { useState } from 'react';
import { VotingProvider } from './contexts/VotingContext';
import WalletConnect from './components/WalletConnect';
import Navigation from './components/Navigation';
import VotingInterface from './components/VotingInterface';
import ResultsChart from './components/ResultsChart';
import AdminPanel from './components/AdminPanel';
import { useVoting } from './contexts/VotingContext';

const MainApp: React.FC = () => {
  const { wallet } = useVoting();
  const [activeTab, setActiveTab] = useState('vote');

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-6xl mx-auto">
          <WalletConnect />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'vote':
        return <VotingInterface />;
      case 'results':
        return <ResultsChart />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <VotingInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
};

function App() {
  return (
    <VotingProvider>
      <MainApp />
    </VotingProvider>
  );
}

export default App;