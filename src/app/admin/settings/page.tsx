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
      
      // Send the update to the API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
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
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving settings");
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
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
              <Link 
                href="/admin" 
                className="inline-flex items-center text-southern-green hover:text-southern-green/80 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving || Object.keys(dirtySettings).length === 0}
              className="bg-southern-green hover:bg-southern-green/90 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
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