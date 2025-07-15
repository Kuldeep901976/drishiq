// Test script for invitation flow with challenge field
// Run this in the browser console to test the API endpoints

async function testInvitationFlow() {
  console.log('🧪 Testing Invitation Flow...');
  
  // Test 1: Create invitation WITHOUT challenge field
  console.log('\n📝 Test 1: Creating invitation WITHOUT challenge field');
  try {
    const response1 = await fetch('/api/invitation/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        language: 'en',
        location: 'United States'
        // No challenge field
      }),
    });
    
    const result1 = await response1.json();
    console.log('✅ Test 1 Result:', result1);
    
    if (result1.success) {
      console.log('✅ Challenge field is optional - invitation created successfully');
    } else {
      console.log('❌ Test 1 failed:', result1.error);
    }
  } catch (error) {
    console.log('❌ Test 1 error:', error);
  }
  
  // Test 2: Create invitation WITH challenge field
  console.log('\n📝 Test 2: Creating invitation WITH challenge field');
  try {
    const response2 = await fetch('/api/invitation/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'test2@example.com',
        phone: '+1234567891',
        language: 'en',
        location: 'United States',
        challenge: 'I want to improve my decision-making skills and overcome analysis paralysis.'
      }),
    });
    
    const result2 = await response2.json();
    console.log('✅ Test 2 Result:', result2);
    
    if (result2.success) {
      console.log('✅ Challenge field is accepted - invitation created successfully');
    } else {
      console.log('❌ Test 2 failed:', result2.error);
    }
  } catch (error) {
    console.log('❌ Test 2 error:', error);
  }
  
  // Test 3: Test magic link creation
  console.log('\n📝 Test 3: Testing magic link creation');
  try {
    const response3 = await fetch('/api/magic-link/create-and-send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        invitationToken: 'test-token-123',
        invitationLink: 'https://drishiq.com/invite/test-token-123'
      }),
    });
    
    const result3 = await response3.json();
    console.log('✅ Test 3 Result:', result3);
    
    if (result3.success) {
      console.log('✅ Magic link creation works');
    } else {
      console.log('❌ Test 3 failed:', result3.error);
    }
  } catch (error) {
    console.log('❌ Test 3 error:', error);
  }
  
  console.log('\n🎉 Invitation flow testing completed!');
}

// Test translation loading
async function testTranslationLoading() {
  console.log('\n🌐 Testing Translation Loading...');
  
  // Check if translation files are being loaded
  try {
    const response = await fetch('/locales/en/common.json');
    if (response.ok) {
      const translations = await response.json();
      console.log('✅ English translations loaded successfully');
      console.log('📊 Translation keys found:', Object.keys(translations).length);
      
      // Check for home page keys
      if (translations.home) {
        console.log('✅ Home page translations found');
        console.log('📝 Home keys:', Object.keys(translations.home));
      } else {
        console.log('❌ Home page translations missing');
      }
    } else {
      console.log('❌ Failed to load English translations');
    }
  } catch (error) {
    console.log('❌ Translation loading error:', error);
  }
}

// Run tests
console.log('🚀 Starting DrishiQ Tests...');
testInvitationFlow();
testTranslationLoading();

// Instructions for manual testing
console.log('\n📋 Manual Testing Instructions:');
console.log('1. Go to /invitation page');
console.log('2. Fill out the form with and without challenge field');
console.log('3. Check browser console for language change logs');
console.log('4. Verify translations are working on home page');
console.log('5. Test language switching in footer modal'); 