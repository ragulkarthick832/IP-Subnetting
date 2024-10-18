// Function to Generate Subnet Addresses
function generateSubnets() {
    const subnetInput = document.getElementById("subnet").value;
    const orgCount = document.getElementById("orgCount").value;
    
    // Validate the input
    if (!subnetInput || orgCount < 1 || orgCount > 8) {
        alert("Please enter a valid IP subnet and organization count (1-8).");
        return;
    }

    // Split the input subnet and prefix
    const [ip, prefix] = subnetInput.split('/');
    if (parseInt(prefix) !== 20) {
        alert("This example assumes a /20 subnet. Please enter a subnet like 200.23.16.0/20.");
        return;
    }

    // Clear previous table results
    document.getElementById("tableBody").innerHTML = "";

    // Convert IP to binary and start subnetting
    const binaryIp = ipToBinary(ip);
    const subnets = [];

    for (let i = 0; i < orgCount; i++) {
        const organizationSubnet = calculateSubnet(binaryIp, i);
        subnets.push(organizationSubnet);
    }

    // Populate the table with subnets
    subnets.forEach((subnet, index) => {
        const row = `<tr>
            <td>Organization ${index}</td>
            <td>${subnet.subnetAddress}/23</td>
            <td>${subnet.ipRange}</td>
        </tr>`;
        document.getElementById("tableBody").insertAdjacentHTML("beforeend", row);
    });
}

// Function to Convert IP Address to Binary String
function ipToBinary(ip) {
    return ip.split('.').map(octet => {
        return ("00000000" + parseInt(octet).toString(2)).slice(-8);
    }).join('');
}

// Function to Calculate Each Subnet
function calculateSubnet(binaryIp, index) {
    const thirdOctet = parseInt(binaryIp.slice(16, 24), 2);
    const newThirdOctet = thirdOctet + (index * 2);
    
    const subnetIp = binaryIp.slice(0, 16) + ("00000000" + newThirdOctet.toString(2)).slice(-8) + "00000000";
    const subnetAddress = binaryToIp(subnetIp);
    const ipRangeStart = subnetAddress;
    const ipRangeEnd = binaryToIp(subnetIp.slice(0, 24) + "11111111");
    
    return {
        subnetAddress: ipRangeStart,
        ipRange: `${ipRangeStart} - ${ipRangeEnd}`
    };
}

// Function to Convert Binary String Back to IP Address
function binaryToIp(binary) {
    return binary.match(/.{8}/g).map(byte => parseInt(byte, 2)).join('.');
}
