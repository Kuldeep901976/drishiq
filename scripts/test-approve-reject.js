const http = require('http');

function testAPI(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testApproveReject() {
  console.log('Testing Approve/Reject functionality...\n');

  // First, get a pending invitation
  console.log('1. Getting pending invitations...');
  const getResult = await testAPI('GET', '/api/admin/invitations/?type=trial&limit=5');
  console.log('Status:', getResult.status);
  
  if (getResult.status === 200 && getResult.data.invitations?.length > 0) {
    const pendingInvitation = getResult.data.invitations.find(inv => inv.status === 'pending');
    
    if (pendingInvitation) {
      console.log('Found pending invitation:', pendingInvitation.id);
      
      // Test approve
      console.log('\n2. Testing approve...');
      const approveResult = await testAPI('POST', '/api/admin/invitations/', {
        action: 'approve',
        requestId: pendingInvitation.id
      });
      console.log('Approve Status:', approveResult.status);
      console.log('Approve Response:', approveResult.data);
      
      // Test reject
      console.log('\n3. Testing reject...');
      const rejectResult = await testAPI('POST', '/api/admin/invitations/', {
        action: 'reject',
        requestId: pendingInvitation.id,
        reason: 'Test rejection'
      });
      console.log('Reject Status:', rejectResult.status);
      console.log('Reject Response:', rejectResult.data);
      
      // Test bulk approve
      console.log('\n4. Testing bulk approve...');
      const bulkApproveResult = await testAPI('POST', '/api/admin/invitations/', {
        action: 'bulk_approve',
        requestIds: [pendingInvitation.id]
      });
      console.log('Bulk Approve Status:', bulkApproveResult.status);
      console.log('Bulk Approve Response:', bulkApproveResult.data);
      
    } else {
      console.log('No pending invitations found');
    }
  } else {
    console.log('Failed to get invitations or no invitations found');
  }
}

testApproveReject().catch(console.error); 