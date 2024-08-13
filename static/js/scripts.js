window.onload = function() {
    var canvas = document.getElementById("matrix");
    var ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'()*+,-./";
    letters = letters.split("");

    var fontSize = 10;
    var columns = canvas.width / fontSize;
    var drops = [];

    for (var x = 0; x < columns; x++) drops[x] =1;//{
        //drops[x] = 1;
    //}

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0";
        ctx.font = fontSize + "px arial";

        for (var i = 0; i < drops.length; i++) {
            var text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] =0 
            drops[i]++;
        }
    }

    setInterval(draw, 33);
    //Show content after a delay
    setTimeout(function() {
        document.getElementById('content-container').style.display = 'block';
    }, 5000); // 5 seconds delay
    populateNetworkOptions();
};

async function fetchNetworkConnections() {
    try {
        const response = await fetch('/get_network_connections');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const networks = await response.json();
        return networks;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function populateNetworkOptions() {
    const networkSelect = document.getElementById('network-select');
    const networks = await fetchNetworkConnections();

    if (networks) {
        networks.forEach(network => {
            const option = document.createElement('option');
            option.value = `${network.ip}/${network.subnet}/${network.connection}`;
            option.text = `${network.ip}/${network.subnet}/${network.connection}`;
            option.dataset.subnet = network.subnet
            networkSelect.add(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const networkSelect = document.getElementById('network-select');
    if (networkSelect) {
        networkSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const subnet = selectedOption.dataset.subnet;
            
            console.log('selected option: ', selectedOption);
            console.log('subnet: ', subnet);
            
            // Populate the IP/Subnet field with the selected values
            document.getElementById('subnet').value = `${subnet}`;
        });
    } else {
        console.error("Element with id 'network-select' not found.");
    }
});


function startScan(event) {
    console.log("StartScan called");
    
    // Check if the event is undefined
    if (typeof event === 'undefined') {
        console.error("Event is undefined");
        return false; // Prevent form submission
    }

    console.log(event);  // Log the event object

    event.preventDefault();  // Prevent the default form submissionfunction startScan(event) {
        console.log("StartScan called");
        
        // Check if the event is undefined
        if (typeof event === 'undefined') {
            console.error("Event is undefined");
            return false; // Prevent form submission
        }
    
        console.log(event);  // Log the event object
    
        event.preventDefault();  // Prevent the default form submission
    
    const form = document.getElementById('scan-form');
    const formData = new FormData(form);
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    
    const progressBox = document.getElementById('progress-updates');
    progressBox.innerText = '';  // Clear previous content

    const subnet = formData.get('subnet');
    const speed = formData.get('speed');
    const resultsDiv = document.getElementById('scan-output');
    const routerDiv = document.getElementById('router-output');
    const scanStatus = document.getElementById('scan-status');
    const progressUpdates = document.getElementById('progress-updates');
    const ipMacList = document.getElementById('ip-mac-list');
    
    console.log("Subnet: ", subnet);
    console.log("Speed: ", speed);


    // Clear previous results
    resultsDiv.innerText = '';
    routerDiv.value = '';
    //progressBar.value = 0;
    scanStatus.innerText = ''; 
    progressBox.innerText = 'Starting scan...'; 
    ipMacList.innerHTML = ''; // Clear the IP-MAC list

    // Prepare the data to be sent in the request
    const data = {
        subnet: subnet,
        speed: speed
    };

    console.log('Data for POST request:', JSON.stringify(data));

    // Send the POST request with the data
    fetch('/scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)  // Convert the data object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            progressBox.innerHTML = `Error: ${data.error}`;
        } else {
            progressBox.innerHTML = 'Scan complete';
            resultsDiv.innerHTML = JSON.stringify(data.devices, null, 2);
            document.getElementById('router-output').value = data.router_address;
            console.log(data);    
            // Populate the select list with the devices
            populateSelectWithDevices(data.devices);
        }
    })
    .catch(error => {
        progressBox.innerHTML = `Error: ${error}`;
        console.error("Error with scan request:", error);
    });
}

// This function will be called after the scan is complete
function populateSelectWithDevices(devices) {
    const selectElement = document.getElementById('ip-mac-list');
    selectElement.innerHTML = '';  // Clear any existing options

    devices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.ip;  // Set the value as the IP address
        option.text = `${device.ip} (${device.mac})`;  // Set the display text
        selectElement.add(option);
    });
}
// Ensure the DOM is fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    const portScanButton = document.querySelector('button[type="button"]');

    // Check if the button exists
    if (portScanButton) {
        portScanButton.addEventListener('click', portScan);
    } else {
        console.error("Port scan button not found");
    }
});

function portScan(event) {
    console.log("portScan called");
    
    event.preventDefault();  // Prevent the default form submission

    const selectElement = document.getElementById('ip-mac-list');
    const selectedIP = selectElement.value;
    //const selectedIPs = Array.from(selectElement.selectedOptions).map(option => option.value);
    const scanStatus = document.getElementById('scan-status');
    const resultsDiv = document.getElementById('port-scan-output');

    scanStatus.innerText = 'Starting port scan...';

    console.log("Selected IPs for port scan:", selectedIP);

    // Send the POST request with the data
    fetch('/port_scan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ips: selectedIP })  // Convert the selected IPs to JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            document.getElementById('port-scan-output').innerHTML = `Error: ${data.error}`;
        } else {
            scanStatus.innerHTML = 'Port scan complete';

            // Format and display the results
            let resultHTML = '<pre>';
            for (let ip in data.results) {
                resultHTML += `IP: ${ip}\n`;
                let ports = data.results[ip];
                for (let port in ports) {
                    resultHTML += `Port: ${port}, Service: ${ports[port].service}, Banner: ${ports[port].banner || 'No banner'}\n`;
                }
            }
            resultHTML += '</pre>';

            resultsDiv.innerHTML = resultHTML;
        }
    })
    .catch(error => {
        document.getElementById('port-scan-output').innerHTML = `Error: ${error}`;
        console.error("Error with port scan request:", error);
    });
}
