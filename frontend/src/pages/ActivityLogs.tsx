import React, { useEffect, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { getLogs } from '../api';

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getLogs();
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Activity Logs</h2>
          <p className="text-slate-400 text-sm">Historical record of system events</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="p-2 bg-surface border border-white/10 rounded-lg text-danger hover:bg-danger/10 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">All Events</button>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-300 px-3 py-1">Threats</button>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-300 px-3 py-1">Scans</button>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-300 px-3 py-1">Actions</button>
          </div>
          <div className="text-xs text-slate-500 font-mono">Showing {logs.length} entries</div>
        </div>
        
        <div className="divide-y divide-white/5">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-start gap-4 hover:bg-white/[0.01]">
              <div className="mt-1">
                {log.event_type === 'Threat' ? (
                  <div className="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_#ef4444]" />
                ) : log.event_type === 'Action' ? (
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#0ea5e9]" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    log.event_type === 'Threat' ? 'text-danger' : 
                    log.event_type === 'Action' ? 'text-primary' : 
                    'text-slate-500'
                  }`}>
                    {log.event_type}
                  </span>
                  <span className="text-xs font-mono text-slate-600">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{log.message}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-12 text-center text-slate-500 italic">No activity logs found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
