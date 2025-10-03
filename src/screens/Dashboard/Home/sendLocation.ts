import axios from 'axios';
import { BASE_URL } from '../../../config/apiConfig';

export const sendLocationToBackend = async (latitude: number, longitude: number, token: string) => {
  try {
    await axios.post(
      `${BASE_URL}/users/location`,  // Updated to new HTTP endpoint
      { latitude, longitude },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    console.log('Location sent to backend');
  } catch (error) {
    console.error('Failed to send location', error);
  }
};