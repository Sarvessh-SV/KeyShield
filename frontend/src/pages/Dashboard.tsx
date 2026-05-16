import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  Search, 
  Activity,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getStats } from '../api';
import { motion } from 'framer-motion';

const data = [
  { name: '00:00', cpu: 12, mem: 45 },
  { name: '04:00', cpu: 18, mem: 48 },
  { name: '08:00', cpu: 35, mem: 55 },
  { name: '12:00', cpu: 25, mem: 50 },
  { name: '16:00', cpu: 45, mem: 60 },
  { name: '20:00', cpu: 20, mem: 52 },
];

const pieData = [
  { name: 'Safe', value: 85, color: '#10b981' },
  { name: 'Risky', value: 10, color: '#f59e0b' },
  { name: 'Critical', value: 5, color: '#ef4444' },
];

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex items-start justify-between"
  >
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <div className={`mt-2 text-xs flex items-center gap-1 ${trend > 0 ? 'text-danger' : 'text-success'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last hour
      </div>
    </div>
    <div className={`p-3 rounded-xl bg-${color}/10`}>
      <Icon className={`w-6 h-6 text-${color}`} />
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Security Overview</h2>
          <p className="text-slate-400 text-sm">Real-time heuristics and behavioral analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/30 transition-all">
            Quick Scan
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            Deep Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Processes" value={stats?.total_processes || '0'} icon={Cpu} color="primary" trend={2} />
        <StatCard label="Threats Detected" value={stats?.threats_count || '0'} icon={ShieldAlert} color="danger" trend={-5} />
        <StatCard label="CPU Usage" value={`${stats?.cpu_usage || '0'}%`} icon={Activity} color="accent" trend={12} />
        <StatCard label="Memory Load" value={`${stats?.memory_usage || '0'}%`} icon={HardDrive} color="secondary" trend={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Resource Timeline</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Threat Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              {pieData.map(item => (
                <div key={item.name} className="text-center">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{item.name}</div>
                  <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
