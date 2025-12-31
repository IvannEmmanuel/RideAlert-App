// sendLocation.ts (update)
import { api } from '../../../utils/api';

export const sendLocationToBackend = async (latitude: number, longitude: number, token?: string) => {
  try {
    // If you pass token explicitly, override headers for this call.
    if (token) {
      await api.post('/users/location', { latitude, longitude }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
    } else {
      // api will attach stored access_token automatically via interceptor
      await api.post('/users/location', { latitude, longitude });
    }
    console.log('Location sent to backend');
  } catch (error) {
    console.error('Failed to send location', error);
  }
};
