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

// Cache the settings fetch to avoid repeated requests
export const getSettings = cache(async (): Promise<Setting[]> => {
  try {
    // Use relative URL path to ensure it works in all contexts
    const response = await fetch(`/api/settings`, { 
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      console.error('Failed to fetch settings:', response.statusText);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
});

// Get a single setting by key with type safety
export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  const settings = await getSettings();
  const setting = settings.find(s => s.key === key);
  
  if (!setting) {
    return defaultValue;
  }
  
  return setting.value as T;
}

// Get multiple settings at once
export async function getMultipleSettings(keys: string[]): Promise<Record<string, any>> {
  const settings = await getSettings();
  const result: Record<string, any> = {};
  
  keys.forEach(key => {
    const setting = settings.find(s => s.key === key);
    if (setting) {
      result[key] = setting.value;
    }
  });
  
  return result;
}

// Get all settings in a specific group
export async function getSettingsByGroup(group: string): Promise<Setting[]> {
  const settings = await getSettings();
  return settings.filter(s => s.group === group);
} 