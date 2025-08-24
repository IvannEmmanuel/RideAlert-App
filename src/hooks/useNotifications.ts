import { useEffect, useState } from 'react';
import { fetchNotificationsByUser } from '../api/notifications';

export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (!userId) return;
      try {
        const raw = await fetchNotificationsByUser(userId);
        const formatted = raw.map((item) => ({
          id: item.id,
          message: item.message,
          createdAt: new Date(item.createdAt),
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };
    fetch();
  }, [userId]);

  return notifications;
};
