from flask import Flask, jsonify, request
from flask_cors import CORS
from database import init_db, Threat, Log, TrustedApp, db
from engine import engine
import psutil
import os

app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(engine.get_system_stats())

@app.route('/api/processes', methods=['GET'])
def get_processes():
    search = request.args.get('search', '')
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            pinfo = proc.info
            if search.lower() in pinfo['name'].lower():
                processes.append({
                    'pid': pinfo['pid'],
                    'name': pinfo['name'],
                    'cpu': pinfo['cpu_percent'],
                    'memory': pinfo['memory_percent'],
                    'risk_score': 0, # Default
                    'status': 'Running'
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    return jsonify(processes[:50]) # Limit to 50 for performance

@app.route('/api/threats', methods=['GET'])
def get_threats():
    threats = list(Threat.select().order_by(Threat.timestamp.desc()).dicts())
    return jsonify(threats)

@app.route('/api/scan', methods=['POST'])
def run_scan():
    threats = engine.scan_processes()
    return jsonify({'status': 'success', 'found': len(threats), 'threats': threats})

@app.route('/api/terminate/<int:pid>', methods=['POST'])
def terminate_process(pid):
    try:
        proc = psutil.Process(pid)
        name = proc.name()
        proc.terminate()
        Log.create(event_type='Action', message=f"Terminated process: {name} (PID: {pid})")
        return jsonify({'status': 'success', 'message': f'Process {pid} terminated'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/api/logs', methods=['GET'])
def get_logs():
    logs = list(Log.select().order_by(Log.timestamp.desc()).limit(100).dicts())
    return jsonify(logs)

@app.route('/api/simulation', methods=['POST'])
def toggle_simulation():
    enabled = request.json.get('enabled', False)
    engine.set_simulation_mode(enabled)
    return jsonify({'status': 'success', 'simulation_mode': enabled})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'version': '1.0.0', 'engine': 'KeyShield v1'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
