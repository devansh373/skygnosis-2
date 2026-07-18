'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();
  const [result, setResult] = useState<{priority: string; category: string; suggested_reply: string | null} | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('triageResult');
    if (data) {
      // eslint-disable-next-line
      setResult(JSON.parse(data));
      // Optionally clear it so it doesn't persist forever
      // sessionStorage.removeItem('triageResult');
    } else {
      router.push('/');
    }
  }, [router]);

  if (!result) return null;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Submitted!</h1>
        <p className="text-gray-500 mb-8">Our AI has triaged your request and it has been sent to our team.</p>

        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">AI Triage Results</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <p className="font-medium text-gray-900">{result.priority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{result.category}</p>
            </div>
          </div>
          
          {result.suggested_reply && (
            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-1">Suggested Auto-Reply</p>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-700 italic">
                &quot;{result.suggested_reply}&quot;
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition"
        >
          Submit Another Ticket
        </button>
      </div>
    </main>
  );
}
