import { useState, useEffect } from 'react';
import { getDecodedToken } from '@/lib/utils';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
}

export function useThemePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    accentColor: '#0000FF'
  });

  async function updateUserPreferences(newPreferences: Partial<UserPreferences>) {
    try {
      const decoded = getDecodedToken();
      if (!decoded) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/users/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: newPreferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      setPreferences(prev => ({ ...prev, ...newPreferences }));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }

  return {
    preferences,
    setPreferences,
    updateUserPreferences,
  };
}