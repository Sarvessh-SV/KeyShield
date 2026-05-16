import psutil
import os
import time
import threading
from database import Threat, Log, TrustedApp

class DetectionEngine:
    def __init__(self):
        self.scanning = False
        self.simulation_mode = False
        self.suspicious_keywords = ['keylog', 'hook', 'spy', 'logger', 'monitor', 'record']
        self.trusted_processes = ['explorer.exe', 'taskmgr.exe', 'chrome.exe', 'vsls-agent.exe']

    def set_simulation_mode(self, enabled):
        self.simulation_mode = enabled
        print(f"Simulation mode set to: {enabled}")

    def get_risk_score(self, proc):
        score = 0
        details = []

        try:
            name = proc.name().lower()
            exe = proc.exe().lower()
            
            # Check suspicious keywords
            if any(k in name for k in self.suspicious_keywords):
                score += 40
                details.append("Suspicious process name")

            # Check if running from temp or suspicious locations
            suspicious_paths = ['\\temp\\', '\\appdata\\local\\temp\\']
            if any(p in exe for p in suspicious_paths):
                score += 30
                details.append("Running from temporary directory")

            # Check if background process (no GUI window - simplified check)
            # In a real app, we'd use GetWindowThreadProcessId
            # Here we just check if it's not a common system process
            if score > 0 and name not in self.trusted_processes:
                score += 20
                details.append("Background execution without UI")

            # Check for high CPU usage (keyloggers sometimes spike)
            if proc.cpu_percent() > 5.0:
                score += 10
                details.append("High CPU usage for background process")

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass

        return min(score, 100), details

    def scan_processes(self):
        print("Scanning processes...")
        threats_found = []
        
        # Add fake threats in simulation mode
        if self.simulation_mode:
            threats_found.append({
                'name': 'win_logger_svc.exe',
                'pid': 9999,
                'risk_score': 85,
                'risk_level': 'High',
                'details': 'Detected keyboard hook simulation'
            })
            threats_found.append({
                'name': 'temp_monitor.exe',
                'pid': 8888,
                'risk_score': 45,
                'risk_level': 'Medium',
                'details': 'Suspicious temp directory execution'
            })

        for proc in psutil.process_iter(['pid', 'name', 'username']):
            try:
                score, details = self.get_risk_score(proc)
                if score > 30:
                    level = "Low"
                    if score > 70: level = "High"
                    elif score > 50: level = "Medium"
                    
                    threat_data = {
                        'name': proc.name(),
                        'pid': proc.pid,
                        'risk_score': score,
                        'risk_level': level,
                        'details': ", ".join(details)
                    }
                    
                    # Check if already in DB
                    exists = Threat.select().where(Threat.pid == proc.pid, Threat.process_name == proc.name()).exists()
                    if not exists:
                        Threat.create(
                            process_name=proc.name(),
                            pid=proc.pid,
                            risk_level=level,
                            risk_score=score,
                            details=", ".join(details)
                        )
                        Log.create(event_type='Threat', message=f"New threat detected: {proc.name()} (PID: {proc.pid})")
                    
                    threats_found.append(threat_data)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        return threats_found

    def get_system_stats(self):
        return {
            'cpu_usage': psutil.cpu_percent(),
            'memory_usage': psutil.virtual_memory().percent,
            'total_processes': len(psutil.pids()),
            'threats_count': Threat.select().count(),
            'status': 'Protected' if not self.simulation_mode else 'Simulating'
        }

engine = DetectionEngine()
