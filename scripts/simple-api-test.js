const https = require('https');
const http = require('http');

async function testAPI() {
  console.log('🔧 Testing API endpoint accessibility...');
  
  const options = {
    hostname: 'localhost',
    port: 3009,
    path: '/api/admin/dashboard/?action=overview',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response body:', data);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

testAPI().catch(console.error); 