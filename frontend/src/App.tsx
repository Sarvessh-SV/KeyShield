import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Monitor from './pages/Monitor';
import LiveScanner from './pages/LiveScanner';
import ActivityLogs from './pages/ActivityLogs';
import Settings from './pages/Settings';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'monitor': return <Monitor />;
      case 'processes': return <LiveScanner />;
      case 'logs': return <ActivityLogs />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-screen overflow-y-auto cyber-gradient">
        <header className="h-16 border-b border-white/5 bg-surface/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">V1.0.4-STABLE</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Heuristics Active</span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">ADMIN_USER</p>
                <p className="text-[10px] text-slate-500 leading-none mt-1">Security Officer</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
