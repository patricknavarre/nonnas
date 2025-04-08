import { cache } from 'react';

// Define setting structure
export interface Setting {
  _id: string;
  key: string;
  value: any;
  group: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'color';
  options?: string[];
  updatedAt?: string;
}

// Hard-coded settings for emergency use when API calls fail
const EMERGENCY_FALLBACK_SETTINGS: Record<string, any> = {
  'site_title': "Nonna & Rue's",
  'about_header': 'Our Story',
  'about_subheader': 'A mother-daughter journey of passion, creativity, and Southern hospitality',
  'about_section_header': "The Heart Behind Nonna & Rue's",
};

// Static cache that persists between requests
// This is a simple implementation to stop the loop
let STATIC_SETTINGS_CACHE: Setting[] | null = null;
let LAST_FETCH_TIME = 0;
const FETCH_COOLDOWN_MS = 30000; // 30 seconds minimum between fetches

// Helper function to get the base URL for API requests
function getBaseUrl() {
  // For Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For preview deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // For custom domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // For local development - checking if we're in a browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Default for local server-side rendering
  return 'http://localhost:3000';
}

// VERY simple function to get settings without causing loops
async function getSettingsFromAPI(): Promise<Setting[]> {
  const now = Date.now();
  
  // If we have cached settings and we've fetched recently, use the cache
  if (STATIC_SETTINGS_CACHE && now - LAST_FETCH_TIME < FETCH_COOLDOWN_MS) {
    return STATIC_SETTINGS_CACHE;
  }
  
  // Make sure we don't fetch too often, regardless of result
  LAST_FETCH_TIME = now;
  
  try {
    // Get base URL for the current environment
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/settings?t=${now}`;
    
    console.log(`[Settings] Fetching settings from: ${url}`);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update the cache
    STATIC_SETTINGS_CACHE = data;
    console.log(`[Settings] Cache updated with ${data.length} settings`);
    
    return data;
  } catch (error) {
    console.error('[Settings] Error fetching:', error);
    
    // Return cached settings if available, empty array otherwise
    return STATIC_SETTINGS_CACHE || [];
  }
}

// Wrap in React cache to deduplicate requests during a render cycle
const getCachedSettings = cache(async () => {
  return getSettingsFromAPI();
});

// Get a single setting with fallback
export async function getSetting<T>(key: string, defaultValue?: T): Promise<T> {
  try {
    // Use the cached version of the settings fetcher
    const settings = await getCachedSettings();
    
    // Find the setting in our data
    const setting = settings.find(s => s.key === key);
    
    if (setting && setting.value !== undefined && setting.value !== null) {
      // For boolean values stored as strings
      if (setting.value === "true" || setting.value === "false") {
        return (setting.value === "true") as unknown as T;
      }
      return setting.value as unknown as T;
    }
    
    // Try the emergency fallback for critical settings
    if (key in EMERGENCY_FALLBACK_SETTINGS) {
      return EMERGENCY_FALLBACK_SETTINGS[key] as unknown as T;
    }
    
    return defaultValue as T;
  } catch (error) {
    console.error(`[Settings] Error getting setting ${key}:`, error);
    
    // Try the emergency fallback for critical settings
    if (key in EMERGENCY_FALLBACK_SETTINGS) {
      return EMERGENCY_FALLBACK_SETTINGS[key] as unknown as T;
    }
    
    return defaultValue as T;
  }
}

// Get all settings (cached)
export async function getSettings(): Promise<Setting[]> {
  return getCachedSettings();
}

// Get multiple settings at once
export async function getMultipleSettings(keys: string[]): Promise<Record<string, any>> {
  const settings = await getCachedSettings();
  const result: Record<string, any> = {};
  
  keys.forEach(key => {
    const setting = settings.find(s => s.key === key);
    if (setting) {
      result[key] = setting.value;
    } else if (key in EMERGENCY_FALLBACK_SETTINGS) {
      result[key] = EMERGENCY_FALLBACK_SETTINGS[key];
    }
  });
  
  return result;
}

// Get all settings in a specific group
export async function getSettingsByGroup(group: string): Promise<Setting[]> {
  const settings = await getCachedSettings();
  return settings.filter(s => s.group === group);
}

// Clear the cache (for admin actions)
export function clearSettingsCache() {
  STATIC_SETTINGS_CACHE = null;
  LAST_FETCH_TIME = 0;
  console.log('[Settings] Cache cleared');
} 