import React, { useState } from 'react';
import { Settings, Database, Shield, Clock, Users, Activity, Plus, X } from 'lucide-react';
import { useVoting } from '../contexts/VotingContext';

interface LocalCandidate {
  name: string;
  rollNumber: string;
  imageUrl: string;
}

const AdminPanel: React.FC = () => {
  const { currentElection, wallet, addCandidate } = useVoting();
  const [showModal, setShowModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState<LocalCandidate>({ name: '', rollNumber: '', imageUrl: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [localCandidates, setLocalCandidates] = useState<LocalCandidate[]>([]);

  if (!currentElection) return null;

  const mockStats = {
    totalTransactions: 530,
    averageGasUsed: '65,000',
    contractAddress: '0x742d35Cc6634C0532925a3b8d3Ac5BC0C6f9c0e7',
    networkFees: '0.0234',
    blockHeight: '18,450,123'
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    if (!newCandidate.name.trim()) {
      setAddError('Candidate name is required.');
      return;
    }
    setIsAdding(true);
    try {
      await addCandidate(newCandidate.name.trim());
      setAddSuccess('Candidate added successfully!');
      setLocalCandidates(prev => [...prev, { ...newCandidate }]);
      setNewCandidate({ name: '', rollNumber: '', imageUrl: '' });
      setShowModal(false);
    } catch (err) {
      setAddError('Failed to add candidate.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCandidate(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Merge blockchain and local candidates for display
  const displayCandidates = currentElection.candidates.map((c, idx) => {
    const local = localCandidates[idx] || {};
    return {
      ...c,
      rollNumber: local.rollNumber || '',
      imageUrl: local.imageUrl || c.imageUrl || '',
    };
  });

  return (
    <div className="space-y-8">
      {/* Modal for Add Candidate */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
            <button className="absolute top-4 right-4 text-white/70 hover:text-blue-400 transition" onClick={() => setShowModal(false)}>
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Add New Student/Candidate</h2>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <label className="block text-blue-200 font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter candidate name"
                  value={newCandidate.name}
                  onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  disabled={isAdding}
                  required
                />
              </div>
              <div>
                <label className="block text-blue-200 font-medium mb-1">Roll Number (if student)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter roll number"
                  value={newCandidate.rollNumber}
                  onChange={e => setNewCandidate({ ...newCandidate, rollNumber: e.target.value })}
                  disabled={isAdding}
                />
              </div>
              <div>
                <label className="block text-blue-200 font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-2 py-1 rounded-lg border border-white/20 bg-white/10 text-white file:bg-blue-600 file:text-white file:rounded-lg file:px-3 file:py-1 file:border-0 file:mr-2"
                  onChange={handleImageChange}
                  disabled={isAdding}
                />
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Paste image URL (optional)"
                  value={newCandidate.imageUrl.startsWith('data:') ? '' : newCandidate.imageUrl}
                  onChange={e => setNewCandidate({ ...newCandidate, imageUrl: e.target.value })}
                  disabled={isAdding}
                />
                {(newCandidate.imageUrl) && (
                  <img src={newCandidate.imageUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-blue-300 shadow-lg" />
                )}
              </div>
              {addError && <p className="text-red-400 text-sm mt-1">{addError}</p>}
              {addSuccess && <p className="text-green-400 text-sm mt-1">{addSuccess}</p>}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl disabled:opacity-60"
                disabled={isAdding}
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>{isAdding ? 'Adding...' : 'Add Candidate'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Admin Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-blue-200">Manage and monitor the election</p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-300" />
              <span className="text-2xl font-bold text-white">{currentElection.totalVotes}</span>
            </div>
            <p className="text-blue-200 text-sm">Total Votes</p>
          </div>
          <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-green-300" />
              <span className="text-2xl font-bold text-white">{mockStats.totalTransactions}</span>
            </div>
            <p className="text-green-200 text-sm">Transactions</p>
          </div>
          <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-purple-300" />
              <span className="text-2xl font-bold text-white">{currentElection.candidates.length}</span>
            </div>
            <p className="text-purple-200 text-sm">Candidates</p>
          </div>
          <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-300" />
              <span className="text-2xl font-bold text-white">Active</span>
            </div>
            <p className="text-orange-200 text-sm">Status</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Smart Contract Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-blue-300" />
            <h3 className="text-xl font-bold text-white">Smart Contract Details</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-blue-200">Contract Address</span>
              <code className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded">
                {mockStats.contractAddress}
              </code>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-blue-200">Network</span>
              <span className="text-white">Polygon Mumbai Testnet</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-blue-200">Block Height</span>
              <span className="text-white">{mockStats.blockHeight}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-blue-200">Average Gas Used</span>
              <span className="text-white">{mockStats.averageGasUsed}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-blue-200">Total Network Fees</span>
              <span className="text-white">{mockStats.networkFees} MATIC</span>
            </div>
          </div>
        </div>
        {/* Election Management */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-5 h-5 text-purple-300" />
            <h3 className="text-xl font-bold text-white">Election Management</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
              <h4 className="text-green-300 font-semibold mb-2">Current Election</h4>
              <p className="text-white font-medium">{currentElection.title}</p>
              <p className="text-green-200 text-sm mt-1">{currentElection.description}</p>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 mt-2"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
            </button>
            {/* Candidate List */}
            <div className="mt-6">
              <h4 className="text-blue-200 font-semibold mb-2">Candidates</h4>
              <div className="grid grid-cols-1 gap-4">
                {displayCandidates.map((candidate, idx) => (
                  <div key={idx} className="flex items-center space-x-4 bg-white/5 rounded-lg p-4 border border-white/10">
                    {candidate.imageUrl ? (
                      <img src={candidate.imageUrl} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-white text-xl font-bold border-2 border-white/20">
                        {candidate.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-bold text-lg">{candidate.name}</div>
                      {candidate.rollNumber && <div className="text-blue-200 text-sm">Roll #: {candidate.rollNumber}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
                <h4 className="text-blue-300 font-semibold mb-2">Start Date</h4>
                <p className="text-white text-sm">
                  {currentElection.startTime.toLocaleDateString()}
                </p>
              </div>
              <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
                <h4 className="text-purple-300 font-semibold mb-2">End Date</h4>
                <p className="text-white text-sm">
                  {currentElection.endTime.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                Export Results
              </button>
              <button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 px-4 rounded-xl border border-red-500/30 transition-all duration-300">
                End Election
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Transactions */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-5 h-5 text-green-300" />
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-blue-200 font-medium">Transaction Hash</th>
                <th className="text-left py-3 px-4 text-blue-200 font-medium">Voter</th>
                <th className="text-left py-3 px-4 text-blue-200 font-medium">Candidate</th>
                <th className="text-right py-3 px-4 text-blue-200 font-medium">Gas Used</th>
                <th className="text-right py-3 px-4 text-blue-200 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <code className="text-blue-300 text-sm">
                      0x{Math.random().toString(16).substring(2, 10)}...
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-white text-sm">
                      0x{Math.random().toString(16).substring(2, 6)}...{Math.random().toString(16).substring(2, 6)}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white">
                      {currentElection.candidates[Math.floor(Math.random() * currentElection.candidates.length)].name.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-green-300">{(60000 + Math.random() * 10000).toFixed(0)}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-blue-300 text-sm">
                      {new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;