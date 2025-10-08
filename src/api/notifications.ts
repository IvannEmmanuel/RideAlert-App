// notifications.ts
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';

export const fetchNotificationsByUser = async (userId: string, fleetId: string) => {
  const url = `${BASE_URL}/notifications/user/${userId}/${fleetId}`;
  console.log('API: Fetching notifications from:', url);

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('API: Response status:', response.status);
    console.log('API: Response data:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('API: Request failed:', error.message);
    if (error.response) {
      console.error('API: Response error data:', error.response.data);
    } else if (error.request) {
      console.error('API: No response received:', error.request);
    }
    throw error;
  }
};
