"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Setting {
  _id: string;
  key: string;
  value: any;
  group: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'color';
  options?: string[];
  updatedAt?: string;
}

// Group titles for better organization
const groupTitles: Record<string, string> = {
  general: "General Settings",
  appearance: "Appearance",
  home: "Homepage Content",
  about: "About Page",
  contact: "Contact Information"
};

export default function SettingsPage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [dirtySettings, setDirtySettings] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      try {
        setAuthChecking(true);
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated) {
          console.log('Not authenticated in settings page, redirecting to login');
          router.push('/admin/login?from=/admin/settings');
          return false;
        }
        
        setIsAuthenticated(true);
        return true;
      } catch (err) {
        console.error('Error checking auth status:', err);
        setError('Failed to verify authentication');
        return false;
      } finally {
        setAuthChecking(false);
      }
    };
    
    // Load settings after authentication
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    
    const initializePage = async () => {
      const authResult = await checkAuth();
      if (authResult) {
        await loadSettings();
      }
    };
    
    initializePage();
  }, [router]);
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
    
    // Mark this setting as dirty (changed)
    setDirtySettings(prev => ({ ...prev, [key]: true }));
    
    // Clear any previous success message when user makes changes
    if (success) setSuccess("");
  };
  
  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError("");
      
      // Get only the settings that have been changed
      const changedSettings = settings.filter(setting => dirtySettings[setting.key]);
      
      if (changedSettings.length === 0) {
        setSuccess("No changes to save");
        setSaving(false);
        return;
      }
      
      // Prepare the settings update data
      const updateData = changedSettings.map(setting => ({
        key: setting.key,
        value: setting.value
      }));
      
      console.log('Saving settings:', updateData);
      
      // Send the update to the API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(updateData),
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save settings");
      }
      
      setSuccess("Settings saved successfully");
      
      // Clear the dirty state for the saved settings
      const newDirtySettings = { ...dirtySettings };
      changedSettings.forEach(setting => {
        delete newDirtySettings[setting.key];
      });
      setDirtySettings(newDirtySettings);
      
      // Force refresh settings on all pages
      console.log('Refreshing settings cache...');
      try {
        // Call the refresh endpoint with timestamp to prevent caching
        const timestamp = new Date().getTime();
        const refreshResponse = await fetch(`/api/settings/refresh?t=${timestamp}`, {
          method: 'POST',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!refreshResponse.ok) {
          console.warn('Settings cache refresh API returned an error:', await refreshResponse.text());
        } else {
          console.log('Settings cache refresh API responded successfully');
        }
      } catch (refreshErr) {
        console.error('Error refreshing settings cache:', refreshErr);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving settings");
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };
  
  // Function to manually refresh settings cache
  const handleRefreshCache = async () => {
    try {
      setSuccess("");
      setError("");
      
      console.log("Manually refreshing settings cache...");
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Call the refresh endpoint directly with POST method
      const refreshResponse = await fetch(`/api/settings/refresh?t=${timestamp}`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!refreshResponse.ok) {
        const errorText = await refreshResponse.text();
        console.error('Error in refresh response:', errorText);
        throw new Error(`Refresh API error: ${refreshResponse.status}`);
      }
      
      // Also perform a GET refresh for thoroughness
      await fetch(`/api/settings/refresh?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      setSuccess(
        "Site refreshed successfully! If changes aren't visible, try hard-refreshing your browser (Ctrl+F5 or Cmd+Shift+R) or open the site in a new incognito window."
      );
      
      // Force reload the settings to show the latest values
      const settingsResponse = await fetch(`/api/settings?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (settingsResponse.ok) {
        const freshSettings = await settingsResponse.json();
        setSettings(freshSettings);
      }
      
    } catch (err) {
      setError("Error refreshing pages. Please try restarting the server.");
      console.error('Error refreshing cache:', err);
    }
  };
  
  // Group settings by their group property
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);
  
  if (authChecking || loading) {
    return (
      <div className="min-h-screen bg-southern-cream pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-southern-beige border-t-southern-brown rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-southern-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-southern-brown">Site Settings</h1>
              <div className="flex items-center space-x-4 mt-1">
                <Link 
                  href="/admin" 
                  className="inline-flex items-center text-southern-green hover:text-southern-green/80"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Dashboard
                </Link>
                <Link 
                  href="/admin/settings/init" 
                  className="inline-flex items-center text-red-600 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset Settings
                </Link>
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving || Object.keys(dirtySettings).length === 0}
              className="bg-southern-green hover:bg-southern-green/90 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleRefreshCache}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Force Site Refresh
            </button>
          </div>
        </header>
        
        <main>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}
          
          {Object.keys(groupedSettings).length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No settings found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedSettings).map(([group, groupSettings]) => (
                <div key={group} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-southern-brown">
                      {groupTitles[group] || group.charAt(0).toUpperCase() + group.slice(1)}
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {groupSettings.map(setting => (
                      <div key={setting.key} className="space-y-2">
                        <label 
                          htmlFor={setting.key} 
                          className="block text-sm font-medium text-gray-700"
                        >
                          {setting.label}
                        </label>
                        
                        {/* Render different input types based on setting.type */}
                        {setting.type === 'text' && (
                          <input
                            type="text"
                            id={setting.key}
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                          />
                        )}
                        
                        {setting.type === 'textarea' && (
                          <textarea
                            id={setting.key}
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                          />
                        )}
                        
                        {setting.type === 'number' && (
                          <input
                            type="number"
                            id={setting.key}
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.key, parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                          />
                        )}
                        
                        {setting.type === 'boolean' && (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={setting.key}
                              checked={setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                              className="h-4 w-4 text-southern-green focus:ring-southern-green border-gray-300 rounded"
                            />
                            <label htmlFor={setting.key} className="ml-2 text-sm text-gray-600">
                              {setting.value ? "Enabled" : "Disabled"}
                            </label>
                          </div>
                        )}
                        
                        {setting.type === 'color' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              id={setting.key}
                              value={setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                              className="h-10 w-14 p-0 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-southern-green focus:border-southern-green"
                            />
                          </div>
                        )}
                        
                        {/* Add a dirty indicator if setting has changed */}
                        {dirtySettings[setting.key] && (
                          <span className="text-sm text-southern-green italic">
                            * Changed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 