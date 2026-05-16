import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { getThreats, runScan, terminateProcess } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Monitor: React.FC = () => {
  const [threats, setThreats] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState('');

  const fetchThreats = async () => {
    try {
      const res = await getThreats();
      setThreats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      await runScan();
      await fetchThreats();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setScanning(false), 2000);
    }
  };

  const handleTerminate = async (pid: number) => {
    if (confirm(`Are you sure you want to terminate process PID: ${pid}?`)) {
      try {
        await terminateProcess(pid);
        await fetchThreats();
      } catch (err) {
        alert("Failed to terminate process. Access Denied.");
      }
    }
  };

  const filteredThreats = threats.filter(t => 
    t.process_name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Threat Monitor</h2>
          <p className="text-slate-400 text-sm">Active suspicious process detection</p>
        </div>
        <button 
          onClick={handleScan}
          disabled={scanning}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            scanning 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-danger text-white hover:bg-danger/80 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'SCANNING SYSTEM...' : 'FORCE SCAN'}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search active threats..."
            className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button className="px-4 py-3 bg-surface border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Process Name</th>
              <th className="px-6 py-4 font-medium">PID</th>
              <th className="px-6 py-4 font-medium">Risk Level</th>
              <th className="px-6 py-4 font-medium">Risk Score</th>
              <th className="px-6 py-4 font-medium">Detection Time</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {filteredThreats.map((threat) => (
                <motion.tr 
                  key={threat.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        threat.risk_level === 'High' ? 'bg-danger/10 text-danger' : 
                        threat.risk_level === 'Medium' ? 'bg-warning/10 text-warning' : 
                        'bg-success/10 text-success'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-white">{threat.process_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-400">{threat.pid}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      threat.risk_level === 'High' ? 'bg-danger/20 text-danger' : 
                      threat.risk_level === 'Medium' ? 'bg-warning/20 text-warning' : 
                      'bg-success/20 text-success'
                    }`}>
                      {threat.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full max-w-[100px]">
                      <div 
                        className={`h-full rounded-full ${
                          threat.risk_score > 70 ? 'bg-danger' : 
                          threat.risk_score > 40 ? 'bg-warning' : 
                          'bg-success'
                        }`}
                        style={{ width: `${threat.risk_score}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleTerminate(threat.pid)}
                        className="p-2 hover:bg-danger/10 rounded-lg text-slate-400 hover:text-danger transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredThreats.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <ShieldCheck className="w-12 h-12 text-success opacity-20" />
                    <p className="text-slate-500">No active threats detected. System is clean.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monitor;
