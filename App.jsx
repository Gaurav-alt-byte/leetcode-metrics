import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search, Trophy, Copy, Check, ExternalLink } from 'lucide-react';

const COLORS = ['#00b8a3', '#ffc01e', '#ef4743'];

export default function App() {
  const [username, setUsername] = useState('Priyanshu');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async (user) => {
    if(!user) return;
    setLoading(true);
    try {
      const res = await fetch(`https://alfa-leetcode-api.onrender.com/${user}/solved`);
      const result = await res.json();
      setData(result);
      setUsername(user);
    } catch (err) {
      console.error("API Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(username); }, []);

  const copyProfile = () => {
    navigator.clipboard.writeText(`https://leetcode.com/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chartData = data ? [
    { name: 'Easy', value: data.easySolved },
    { name: 'Medium', value: data.mediumSolved },
    { name: 'Hard', value: data.hardSolved }
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl font-black italic text-yellow-500 tracking-tighter">LC_METRICS</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500 h-5 w-5" />
              <input 
                className="bg-[#1a1a1a] border border-gray-800 rounded-full py-2 pl-10 pr-4 w-64 focus:border-yellow-500 outline-none transition-all"
                placeholder="Search Username..."
                onKeyDown={(e) => e.key === 'Enter' && fetchData(e.target.value)}
              />
            </div>
            <button onClick={copyProfile} className="p-2.5 bg-[#111] border border-gray-800 rounded-full hover:bg-gray-800 transition-all">
              {copied ? <Check className="text-green-500 h-5 w-5" /> : <Copy className="text-gray-400 h-5 w-5" />}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20 text-yellow-500 animate-pulse font-mono">LOADING_DATA...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-gray-800 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-yellow-500/10 p-4 rounded-2xl mb-4"><Trophy className="text-yellow-500 h-8 w-8" /></div>
              <h2 className="text-4xl font-black mb-1">{data?.solvedProblem || 0}</h2>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-widest">Total Problems Solved</p>
              <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer" className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase">
                Profile <ExternalLink size={14} />
              </a>
            </div>

            <div className="md:col-span-2 bg-[#111] border border-gray-800 p-8 rounded-3xl">
              <h3 className="text-lg font-bold mb-6">Difficulty Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={65} outerRadius={85} paddingAngle={10} dataKey="value" stroke="none">
                      {chartData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '10px'}} />
                    <Legend verticalAlign="bottom" height={36}/>
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