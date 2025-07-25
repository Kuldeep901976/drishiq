'use client';

import { useState } from 'react';

export default function TestInvitationPage() {
  const [results, setResults] = useState<any[]>([]);

  const testTrialAccess = async () => {
    const data = {
      name: 'Test User',
      email: `test1-${Date.now()}@example.com`,
      phone: '1234567890',
      country_code: '+91',
      language: 'en',
      location: 'Test City',
      category: 'trial_access',
      share_challenge: '',
      challenge_description: null,
      challenge_sub_category: null,
      challenge_specific: null
    };
    
    await testAPI(data, 'Trial Access');
  };
  
  const testNeedSupport = async () => {
    const data = {
      name: 'Test User',
      email: `test2-${Date.now()}@example.com`,
      phone: '1234567890',
      country_code: '+91',
      language: 'en',
      location: 'Test City',
      category: 'need_support',
      share_challenge: 'test challenge',
      challenge_description: 'professional',
      challenge_sub_category: 'career',
      challenge_specific: 'advancement'
    };
    
    await testAPI(data, 'Need Support');
  };
  
  const testAPI = async (data: any, testName: string) => {
    try {
      console.log(`Testing ${testName}:`, data);
      
      const response = await fetch('/api/invitation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      console.log(`${testName} Response:`, {
        status: response.status,
        ok: response.ok,
        result: result
      });
      
      const testResult = {
        testName,
        status: response.status,
        ok: response.ok,
        success: result.success,
        token: result.token,
        error: result.error || 'None',
        fullResult: result
      };
      
      setResults(prev => [...prev, testResult]);
      
    } catch (error: any) {
      console.error(`${testName} Error:`, error);
      setResults(prev => [...prev, {
        testName,
        error: error.message,
        status: 'ERROR'
      }]);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Invitation API Test</h1>
      
      <div className="space-x-4 mb-8">
        <button 
          onClick={testTrialAccess}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Trial Access
        </button>
        
        <button 
          onClick={testNeedSupport}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Need Support
        </button>
        
        <button 
          onClick={() => setResults([])}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{result.testName}</h3>
            <p>Status: {result.status}</p>
            <p>OK: {result.ok?.toString()}</p>
            <p>Success: {result.success?.toString()}</p>
            <p>Token: {result.token || 'None'}</p>
            <p>Error: {result.error}</p>
            <details className="mt-2">
              <summary>Full Response</summary>
              <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
                {JSON.stringify(result.fullResult, null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
} 