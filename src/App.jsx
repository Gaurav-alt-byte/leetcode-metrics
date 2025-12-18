import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search, Trophy, Copy, Check, ExternalLink, Activity, AlertCircle } from 'lucide-react';

const COLORS = ['#00b8a3', '#ffc01e', '#ef4743'];

export default function App() {
  // SET YOUR USERNAME HERE (Case-sensitive)
  const MY_USERNAME = 'gaurav_era'; 
  
  const [username, setUsername] = useState(MY_USERNAME);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async (user) => {
    if (!user) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/${user}/solved`);
      const result = await res.json();
      
      // Check if API returned an error or user not found
      if (result.errors || result.error || !result.solvedProblem) {
        setError(true);
        setData(null);
      } else {
        setData(result);
        setUsername(user);
      }
    } catch (err) {
      setError(true);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(MY_USERNAME);
  }, []);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`https://leetcode.com/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safe data mapping to prevent black screen crashes
  const chartData = (data && !error) ? [
    { name: 'Easy', value: data.easySolved || 0 },
    { name: 'Medium', value: data.mediumSolved || 0 },
    { name: 'Hard', value: data.hardSolved || 0 }
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-2">
            <Activity className="text-yellow-500 w-8 h-8" />
            <h1 className="text-3xl font-black italic tracking-tighter">LC<span className="text-yellow-500">_METRICS</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
              <input 
                className="bg-[#141414] border border-gray-800 rounded-full py-2.5 pl-10 pr-4 w-64 md:w-80 focus:border-yellow-500 outline-none transition-all text-sm"
                placeholder="Search LeetCode Username..."
                onKeyDown={(e) => e.key === 'Enter' && fetchData(e.target.value)}
              />
            </div>
            <button onClick={copyProfileLink} className="p-3 bg-[#141414] border border-gray-800 rounded-full hover:bg-gray-800 transition-all">
              {copied ? <Check className="text-green-500 h-5 w-5" /> : <Copy className="text-gray-400 h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-10 flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500">
            <AlertCircle size={20} />
            <p className="text-sm font-bold uppercase tracking-wider">User not found or API Limit reached.</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 space-y-4">
            <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-mono tracking-widest animate-pulse">SYNCING_DATA...</p>
          </div>
        ) : data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stats Card */}
            <div className="bg-[#111] border border-gray-800 p-8 rounded-[2rem] flex flex-col items-center shadow-2xl">
              <div className="bg-yellow-500/10 p-4 rounded-2xl mb-4 text-yellow-500">
                <Trophy size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-6xl font-black mb-2">{data.solvedProblem}</h2>
              <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.2em]">Total Solved</p>
              
              <div className="w-full h-[1px] bg-gray-800 my-8"></div>
              
              <p className="text-gray-400 text-sm font-bold mb-4 italic">@{username}</p>
              <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer" className="w-full py-3 bg-white text-black text-[10px] font-black rounded-xl hover:bg-yellow-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                Visit Profile <ExternalLink size={14} />
              </a>
            </div>

            {/* Chart Card */}
            <div className="md:col-span-2 bg-[#111] border border-gray-800 p-8 rounded-[2rem] shadow-2xl">
              <h3 className="text-lg font-bold mb-8 uppercase tracking-widest text-gray-400">Difficulty Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      innerRadius={65} 
                      outerRadius={85} 
                      paddingAngle={8} 
                      dataKey="value"
                      nameKey="name"
                      stroke="none"
                      // This adds the static numbers outside the chart
                      label={({ name, value }) => `${value}`} 
                      labelLine={false} // Clean look without lines
                    >
                      {chartData.map((entry, i) => (
                        <Cell 
                          key={`cell-${i}`} 
                          fill={COLORS[i]} 
                          className="hover:opacity-80 transition-opacity cursor-pointer outline-none" 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#111', 
                        border: '1px solid #333', 
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}