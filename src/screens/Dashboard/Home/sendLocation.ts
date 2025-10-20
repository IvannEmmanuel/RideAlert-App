// sendLocation.ts (update)
import { api } from '../../../utils/api';

export const sendLocationToBackend = async (latitude: number, longitude: number, token?: string) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`📍 [${requestId}] Attempting to send location:`, { latitude, longitude });
  
  try {
    if (token) {
      await api.post('/users/location', { latitude, longitude }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
    } else {
      await api.post('/users/location', { latitude, longitude });
    }
    console.log(`✅ [${requestId}] Location sent successfully`);
  } catch (error) {
    console.error(`❌ [${requestId}] Failed to send location`, error);
  }
};