const http = require('http');

function testAPI(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('Testing Invitation API endpoints...\n');

  // Test trial invitations
  console.log('1. Testing trial invitations...');
  const trialResult = await testAPI('/api/admin/invitations/?type=trial&limit=5');
  console.log('Status:', trialResult.status);
  console.log('Trial invitations:', trialResult.data.invitations?.length || 0);
  if (trialResult.data.invitations?.length > 0) {
    console.log('Sample:', trialResult.data.invitations[0]);
  }
  console.log('');

  // Test need_support invitations
  console.log('2. Testing need_support invitations...');
  const supportResult = await testAPI('/api/admin/invitations/?type=need_support&limit=5');
  console.log('Status:', supportResult.status);
  console.log('Need support invitations:', supportResult.data.invitations?.length || 0);
  console.log('');

  // Test testimonials invitations
  console.log('3. Testing testimonials invitations...');
  const testimonialResult = await testAPI('/api/admin/invitations/?type=testimonials&limit=5');
  console.log('Status:', testimonialResult.status);
  console.log('Testimonial invitations:', testimonialResult.data.invitations?.length || 0);
  console.log('');

  // Test bulk_uploaded invitations
  console.log('4. Testing bulk_uploaded invitations...');
  const bulkResult = await testAPI('/api/admin/invitations/?type=bulk_uploaded&limit=5');
  console.log('Status:', bulkResult.status);
  console.log('Bulk uploaded invitations:', bulkResult.data.invitations?.length || 0);
  console.log('');
}

runTests().catch(console.error); 