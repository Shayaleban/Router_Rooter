from flask import Flask, render_template, request, jsonify
import logging
import json
from app import app
from app.network_scan import network_scan
from app.network_utils import get_local_ip_and_subnet
from app.protocol_scan import portScan

# Set up logging for the app
logging.basicConfig(level=logging.INFO, format='%(levelname)s:%(message)s')

@app.route('/')
def index():
    connections = get_local_ip_and_subnet()
    return render_template('index.html', local_ip=connections[0]['ip'], subnet=connections[0]['subnet'])

@app.route('/get_network_connections', methods=['GET'])
def get_network_connections():
    connections = get_local_ip_and_subnet()
    return jsonify(connections)

@app.route('/scan', methods=['POST', 'GET'])
def start_scan():
    data = request.get_json()
    subnet = data.get('subnet')
    speed = data.get('speed')
    print(speed)
    print(subnet)
    if not subnet or not speed:
        return jsonify({'error': 'Missing required parameters: subnet and speed'}), 400
    try:
        devices = network_scan(subnet, timeout=int(speed))
        logging.info("fetching endpoint details...")
        router_address = devices[0]['ip'] if devices else 'Not found'
        if devices:
            return jsonify({'devices': devices, 'router_address': router_address})
        else:
            return jsonify({'error': 'No devices found'}), 404
    except Exception as e:
        logging.error(f"Error during scan Main.py: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/port_scan', methods=['POST'])
def port_scan():
    data = request.get_json()
    ips = data.get('ips')
    print(f"Received ips for port scanning: {ips}")
    
    if not ips:
        return jsonify({'error': 'No IP addresses provided for port scanning'}), 400
    
    scan_results = {}
    #for ip in ips:
    ips=str(ips)
    open_ports = portScan(ips)
    scan_results[ips] = open_ports

    return jsonify({'status': 'complete', 'results': scan_results})

if __name__ == "__main__":
    app.run(debug=True)
    