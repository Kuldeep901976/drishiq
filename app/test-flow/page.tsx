'use client';

import { flowController } from '@/lib/flow-controller';
import { useSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestFlowPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [flowState, setFlowState] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [importTest, setImportTest] = useState<string>('');

  useEffect(() => {
    // Test if flow controller is working
    try {
      const test = flowController.getRegisteredFlows();
      setImportTest('Flow controller import successful');
      console.log('Flow controller test:', test);
    } catch (error) {
      setImportTest(`Flow controller error: ${error}`);
      console.error('Flow controller error:', error);
    }

    const checkState = async () => {
      // Get current flow state
      const currentFlow = flowController.getCurrentFlow();
      const currentStep = flowController.getCurrentStep();
      const userData = flowController.getUserData();
      const registeredFlows = flowController.getRegisteredFlows();
      
      setFlowState({
        currentFlow,
        currentStep,
        userData,
        registeredFlows,
        activeFlows: flowController.getActiveFlows(),
        nextStep: flowController.getNextStep(),
        isLastStep: flowController.isLastStep()
      });

      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          authProvider: session.user.app_metadata?.provider
        });
      }
    };

    checkState();
  }, [supabase]);

  const resetFlow = () => {
    flowController.resetCurrentFlow();
    window.location.reload();
  };

  const startFirstTimeInvitationFlow = () => {
    flowController.startFlow('first-time-invitation');
    window.location.reload();
  };

  const testCompleteStep = () => {
    const result = flowController.completeCurrentStep();
    console.log('Complete step result:', result);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Flow Controller Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flow State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Flow State</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(flowState, null, 2)}
            </pre>
          </div>

          {/* User State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User State</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={resetFlow}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset Flow
            </button>
            <button
              onClick={startFirstTimeInvitationFlow}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Start First Time Invitation Flow
            </button>
            <button
              onClick={testCompleteStep}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Complete Current Step
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Landing
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pricing
            </button>
            <button
              onClick={() => router.push('/payment')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Payment
            </button>
            <button
              onClick={() => router.push('/phone-capture')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Phone Capture
            </button>
            <button
              onClick={() => router.push('/verify-phone')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Phone Verify
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Signup
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Profile
            </button>
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 