<<<<<<< HEAD
# KeyShield - Advanced Keystroke Protection System

KeyShield is a professional-grade cybersecurity application designed to detect and prevent keylogging activities using heuristic behavioral analysis.

## Features
- **Real-time Process Monitoring**: Scans running processes for suspicious behavior.
- **Heuristic Detection Engine**: Detects keyboard hooks, hidden background execution, and suspicious startup persistence.
- **SOC Dashboard**: Modern dark-themed dashboard with live updating charts and threat indicators.
- **Threat Alert System**: Instant visual alerts for high-risk activities.
- **Quarantine & Terminate**: Ability to stop suspicious processes directly from the UI.
- **Activity Logs**: Detailed history of scans, threats, and actions taken.
- **Simulation Mode**: Test detection capabilities with safe, simulated threats.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Lucide Icons + Recharts
- **Backend**: Python Flask + SQLite + psutil
- **Desktop**: Electron

## Installation

### 1. Clone/Download the project
```bash
cd KeyShield
```

### 2. Backend Setup
```bash
pip install -r backend/requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Root Dependencies (for Electron/Dev)
```bash
cd ..
npm install
```

## Running the Application

### Option 1: Standard Dev Mode (Recommended)
Run the backend and frontend separately:

**Backend:**
```bash
python backend/app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Electron Desktop Mode
```bash
npm run start
```

## How it works
KeyShield doesn't rely on a database of known malware signatures. Instead, it uses **Heuristic Analysis**:
- **Suspicious Paths**: Monitors apps running from `Temp` or `AppData` folders.
- **Behavioral Spikes**: Flags background processes with unusual CPU usage.
- **Hidden Execution**: Identifies processes running without a visible window.
- **Hook Detection**: Checks for common keyboard monitoring techniques.

## Disclaimer
KeyShield is a security tool designed for monitoring and educational purposes. For full system protection, always use it alongside a primary Antivirus solution.
=======
# KeyShield
Real-time keylogger detection and behavioral threat monitoring platform.
>>>>>>> 7426279e1935e9f3606b7761204fb97c296bc8a7
