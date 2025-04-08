"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function InitializeSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string; error?: string; settings?: string[] }>(null);

  const initializeSettings = async () => {
    if (!confirm('This will reset ALL settings to their default values. Continue?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/settings/init');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to initialize settings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-southern-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-southern-brown">Initialize Settings</h1>
              <Link 
                href="/admin/settings" 
                className="inline-flex items-center text-southern-green hover:text-southern-green/80 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Settings
              </Link>
            </div>
          </div>
        </header>

        <main>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-southern-brown mb-2">Reset and Initialize Default Settings</h2>
              <p className="text-gray-600 mb-4">
                Use this utility to reset all settings to their default values. This is useful if you're
                experiencing issues with settings not being properly loaded or if you want to start fresh.
              </p>
              <p className="text-red-600 mb-4 font-medium">
                Warning: This will delete all existing settings and replace them with default values.
                Any customizations you've made will be lost.
              </p>
              <button
                onClick={initializeSettings}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Initialize Default Settings'}
              </button>
            </div>

            {result && (
              <div className={`p-4 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'} mb-2`}>
                  {result.success ? 'Success!' : 'Error'}
                </h3>
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
                {result.error && (
                  <p className="text-red-700 mt-2">
                    Error details: {result.error}
                  </p>
                )}
                {result.success && result.settings && (
                  <div className="mt-4">
                    <p className="text-green-700 font-medium">Initialized {result.settings.length} settings:</p>
                    <div className="mt-2 max-h-60 overflow-y-auto bg-white p-3 rounded border border-green-200">
                      <ul className="list-disc list-inside text-sm">
                        {result.settings.map(key => (
                          <li key={key} className="text-gray-700">{key}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 