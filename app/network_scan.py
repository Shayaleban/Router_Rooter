import json
from flask import jsonify
import logging
import threading
import ipaddress
from scapy.all import ARP, Ether, srp

logging.basicConfig(level=logging.INFO)

lock = threading.Lock()

def network_scan(subnet, timeout, verbose=False):
    network = ipaddress.ip_network(subnet)
    logging.info(f"Starting network scan on range: {network} with timeout: {timeout}")
    print(f'network: {network}')
    devices = []
    threads = []
    total_hosts = len(list(network.hosts()))
    logging.info(f"Total hosts to scan: {total_hosts}")

    def scan_ip(ip):
        arp = ARP(pdst=str(ip))
        ether = Ether(dst="ff:ff:ff:ff:ff:ff")
        packet = ether / arp
        logging.info(f"sending ARP request: {ip}: {packet.summary()}")
        result = srp(packet, timeout=timeout, verbose=verbose)[0]
        for sent, received in result:
            device_info = {'ip': received.psrc, 'mac': received.hwsrc}
            logging.info(f"Received ARP response: IP={received.psrc}, MAC={received.hwsrc}")
            with lock:
                # progress += 1
                # current_progress = (progress / total_hosts) * 100
                devices.append(device_info)
                #logging.info(f"Current progress: {current_progress}% after processing IP: {ip}")
                #yield json.dumps({'Progress': current_progress, 'device': device_info})
        progress = len(devices) / total_hosts * 100
        logging.info(f"Current progress: {progress}% after processing IP: {ip}")
    for ip in network.hosts():
        print('1')
        thread = threading.Thread(target=scan_ip, args=(ip,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    logging.info(f"Finished scanning, found {len(devices)} devices")
    return devices
    #print(f'devices' + devices)
