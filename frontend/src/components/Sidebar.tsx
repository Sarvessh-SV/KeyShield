import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Activity,  
  Settings, 
  FileText,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'monitor', icon: Activity, label: 'Threat Monitor' },
    { id: 'processes', icon: Terminal, label: 'Live Scanner' },
    { id: 'logs', icon: FileText, label: 'Activity Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 h-screen bg-surface border-r border-white/10 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Shield className="w-8 h-8 text-primary animate-pulse-slow" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">KeyShield</h1>
          <p className="text-[10px] text-primary font-mono uppercase tracking-widest">Secure Guard</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-4 glass-card">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium">System Protected</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Last Scan: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
