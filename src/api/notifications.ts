import axios from 'axios';

export const fetchNotificationsByUser = async (userId: string) => {
  const response = await axios.get(`http://192.168.1.7:8000/notifications/user/${userId}`);
  return response.data;
};
