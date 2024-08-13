from scapy.all import sr1, IP, TCP
from scapy.layers.inet import IP, TCP
import socket

def portScan(ip):
    protocols = {}
    print(f" scan IP: {ip}")
    
    for port in range(1, 1025):
        print(f'scaning port #: {port}')
        try:
            pkt = sr1(IP(dst=ip)/TCP(dport=port, flags="S"), timeout=1, verbose=0)
        except OSError as e:
            print(f"Error with IP {ip}: (e)")
            continue       
        if pkt and pkt.haslayer(TCP) and pkt[TCP].flags == "SA":
            print(f'found open port at: {port}')
            # Identify the service running on the open port
            try:
                service = socket.getservbyport(port, "tcp")
            except:
                service = "unknown"
                
            # Try to get service version information
            banner = None
            try:
                s = socket.socket()
                s.timeout(10)
                s.connect((ip, port))
                s.send(b'HEAD / HTTP/1.0\r\n\r\n')
                banner = s.recv(1024).decode('utf-8').strip()
            except socket.timeout:
                print(f"connection to {ip}:{port} timed out.")
            except Exception as e:
                print(f"Error retreiing banner for {ip}:{port}: {e}")
            finally:
                s.close()

            protocols[port] = {"service": service, "banner": banner}

    return protocols