# Network and Port Scanning Tool

## Project Overview

This project is a web-based network and port scanning tool designed for ethical hacking and network administration purposes. The tool allows users to scan a subnet for active devices and then perform a port scan on the detected devices. It features a sleek, Matrix-themed interface with real-time updates on scanning progress and results.

### Features

- **Network Scanning:** Scans a given subnet to detect all active devices within the network.
- **Port Scanning:** After identifying active devices, the tool allows users to scan specific devices for open ports and determine which services are running on those ports.
- **Real-Time Updates:** The tool provides real-time progress updates and displays results directly on the web interface.
- **Customizable Timeout:** Users can set the timeout for the network scan, adjusting the speed and depth of the scan.
- **Modern Interface:** A Matrix-themed interface with green text and buttons, providing a hacker-themed visual appeal.

## Disclaimer
**Important:** This tool is designed for ethical hacking and network administration purposes only. It should only be used with the explicit permission of the network administrator. Unauthorized scanning of networks may be illegal and could result in severe penalties.

## Installation
ensure correct permissions and execute 
./run_tool.sh

## Usage Instructions
Select Network Connection:

The tool automatically detects your local IP and subnet mask. Choose the network connection you wish to scan from the dropdown menu.
Set the Subnet and Timeout:

Enter the desired subnet to scan (e.g., 192.168.1.0/24) and set the ARP scan timeout in seconds.

Click the "Scan" button to begin the network scan. The tool will identify active devices on the specified subnet.

Once the network scan is complete, select a device from the list to perform a port scan.
Start Port Scan:

Click the "Port Scan" button to scan the selected device for open ports and running services.
View Results:

The results of the network and port scans will be displayed directly on the web interface.