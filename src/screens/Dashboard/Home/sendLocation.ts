import axios from 'axios';

export const sendLocationToBackend = async (latitude, longitude, token) => {
  try {
    await axios.post(
      'http://192.168.1.3:8000/users/location',
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