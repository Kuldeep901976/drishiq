const https = require('https');
const http = require('http');

async function testAPI() {
  console.log('Testing API endpoint...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/invitations/stats/',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response:', data);
      try {
        const jsonData = JSON.parse(data);
        console.log('Parsed data:', jsonData);
      } catch (e) {
        console.log('Could not parse JSON:', e.message);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
  });

  req.end();
}

testAPI(); 