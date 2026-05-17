import React, { useEffect, useState } from 'react';
import { Search, Cpu, RefreshCw } from 'lucide-react';
import { getProcesses } from '../api';

const LiveScanner: React.FC = () => {
  const [processes, setProcesses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const res = await getProcesses(search);
      setProcesses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Process Scanner</h2>
          <p className="text-slate-400 text-sm">Real-time system process inspection</p>
        </div>
        <button 
          onClick={fetchProcesses}
          className="p-2 bg-surface border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input 
          type="text"
          placeholder="Search processes by name or PID..."
          className="w-full bg-surface border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">
          <div className="col-span-5">Process Name</div>
          <div className="col-span-2 text-center">PID</div>
          <div className="col-span-2 text-center">CPU %</div>
          <div className="col-span-2 text-center">Memory %</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        <div className="max-h-[600px] overflow-y-auto divide-y divide-white/5">
          {processes.map((p) => (
            <div key={p.pid} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">
              <div className="col-span-5 flex items-center gap-3">
                <div className="p-2 rounded bg-slate-800 text-slate-400 group-hover:text-primary transition-colors">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="font-mono text-sm text-white truncate">{p.name}</span>
              </div>
              <div className="col-span-2 text-center font-mono text-xs text-slate-400">{p.pid}</div>
              <div className="col-span-2 text-center text-xs text-slate-400">{p.cpu.toFixed(1)}%</div>
              <div className="col-span-2 text-center text-xs text-slate-400">{p.memory.toFixed(1)}%</div>
              <div className="col-span-1 text-right">
                <span className="w-2 h-2 rounded-full bg-success inline-block shadow-[0_0_5px_#10b981]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveScanner;
