// Enhanced notifications.ts with better error handling and debugging

import axios from 'axios';

export const fetchNotificationsByUser = async (userId: string) => {
  console.log('API: Fetching notifications for userId:', userId);
  const url = `http://192.168.1.7:8000/notifications/user/${userId}`;
  console.log('API: Full URL:', url);
  
  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('API: Response status:', response.status);
    console.log('API: Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('API: Request failed:', error.message);
    if (error.response) {
      console.error('API: Response error data:', error.response.data);
      console.error('API: Response status:', error.response.status);
      console.error('API: Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('API: No response received:', error.request);
    }
    throw error;
  }
};