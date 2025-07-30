import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { useVoting } from '../contexts/VotingContext';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

const ResultsChart: React.FC = () => {
  const { currentElection } = useVoting();

  if (!currentElection) return null;

  const chartData = currentElection.candidates.map((candidate, index) => ({
    name: candidate.name.split(' ')[0],
    fullName: candidate.name,
    votes: candidate.voteCount,
    percentage: currentElection.totalVotes > 0 
      ? ((candidate.voteCount / currentElection.totalVotes) * 100).toFixed(1)
      : '0',
    color: COLORS[index % COLORS.length]
  })).sort((a, b) => b.votes - a.votes);

  const winner = chartData[0];

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Live Results</h2>
          <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Updated in Real-time</span>
          </div>
        </div>

        {currentElection.totalVotes > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-300">Current Leader</h3>
                <p className="text-yellow-200">
                  {winner.fullName} with {winner.votes} votes ({winner.percentage}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-5 h-5 text-blue-300" />
            <h3 className="text-xl font-bold text-white">Vote Distribution</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="name" 
                stroke="#bfdbfe"
                fontSize={12}
              />
              <YAxis 
                stroke="#bfdbfe"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff'
                }}
                formatter={(value, name) => [value, 'Votes']}
                labelFormatter={(label) => {
                  const candidate = chartData.find(c => c.name === label);
                  return candidate?.fullName || label;
                }}
              />
              <Bar 
                dataKey="votes" 
                fill="url(#gradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-300" />
            <h3 className="text-xl font-bold text-white">Vote Percentage</h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="votes"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff'
                }}
                formatter={(value, name) => [value, 'Votes']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Detailed Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-blue-200 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-blue-200 font-medium">Candidate</th>
                <th className="text-right py-3 px-4 text-blue-200 font-medium">Votes</th>
                <th className="text-right py-3 px-4 text-blue-200 font-medium">Percentage</th>
                <th className="text-left py-3 px-4 text-blue-200 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((candidate, index) => (
                <tr key={candidate.name} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">#{index + 1}</span>
                      {index === 0 && (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">{candidate.fullName}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-white font-bold">{candidate.votes}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-blue-300">{candidate.percentage}%</span>
                  </td>
                  <td className="py-3 px-4">
                    {index === 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                        Leading
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300">
                        Following
                      </span>
                    )}
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

export default ResultsChart;