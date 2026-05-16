import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, Cpu, Info, ToggleLeft, ToggleRight } from 'lucide-react';
import { toggleSimulation } from '../api';

const SettingItem = ({ icon: Icon, title, description, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-primary transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-white">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
    <button onClick={onToggle} className="text-primary hover:scale-110 transition-transform">
      {active ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-700" />}
    </button>
  </div>
);

const Settings: React.FC = () => {
  const [simulation, setSimulation] = useState(false);
  const [autoStart, setAutoStart] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSimulationToggle = async () => {
    const newState = !simulation;
    setSimulation(newState);
    try {
      await toggleSimulation(newState);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-slate-400 text-sm">Configure KeyShield protection behavior</p>
        </div>
        <SettingsIcon className="w-6 h-6 text-slate-500" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card divide-y divide-white/5">
          <SettingItem 
            icon={Shield}
            title="Heuristic Protection"
            description="Use rule-based behavioral analysis to detect unknown threats."
            active={true}
            onToggle={() => {}}
          />
          <SettingItem 
            icon={Cpu}
            title="Simulation Mode"
            description="Enable fake threat simulation for demo and training purposes."
            active={simulation}
            onToggle={handleSimulationToggle}
          />
          <SettingItem 
            icon={Bell}
            title="Real-time Notifications"
            description="Show desktop alerts when a threat is detected."
            active={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingItem 
            icon={Shield}
            title="Auto-Start Protection"
            description="Launch protection engine automatically on system startup."
            active={autoStart}
            onToggle={() => setAutoStart(!autoStart)}
          />
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-white">Device Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Device ID</p>
              <p className="text-sm font-mono text-white">KS-992-AXQ-71</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">OS Version</p>
              <p className="text-sm font-mono text-white">Windows 11 Pro 22H2</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Engine Version</p>
              <p className="text-sm font-mono text-white">1.4.0 (Build 82)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
