#from scapy.all import ARP, Ether, srp, sniff, conf
#import ifaddr
import socket
import os
import psutil
import ipaddress

def get_local_ip_and_subnet():
    print('getting local ip')
    connections = []

    for interface, addrs in psutil.net_if_addrs().items():
        for addr in addrs:
            if addr.family == socket.AF_INET:  # We're only interested in IPv4 addresses
                ip = addr.address
                netmask = addr.netmask
                if ip and netmask:
                    # Calculate the network address (subnet) in CIDR notation
                    network = ipaddress.IPv4Network(f"{ip}/{netmask}", strict=False)
                    connection = {
                        'ip': ip,
                        'subnet': str(network.with_prefixlen),
                        'connection': interface
                    }
                    connections.append(connection)

    return connections
