import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import homeStyles from '../styles/homeStyles';
import { fetchNotificationsByUser } from '../api/notifications';
import { wsUrl } from '../config/apiConfig';

const { height } = Dimensions.get('window');

// Format time for display
const formatTimeOnly = (date) => {
  const localDate = new Date(date);
  return localDate.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });
};

// Check if notification is recent (e.g., within 10 minutes)
const isRecentNotification = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return false;

  const diff = (now.getTime() - created.getTime()) / 60000; // difference in minutes
  return diff >= 0 && diff < 10; // less than 10 minutes
};

export const NotificationModal = ({ visible, onClose, userId, fleetId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    if (visible && userId && fleetId) {
      fetchInitialNotifications();
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => disconnectWebSocket();
  }, [visible, userId, fleetId]);

  // Fetch notifications from backend
  const fetchInitialNotifications = async () => {
    try {
      setIsLoading(true);
      const raw = await fetchNotificationsByUser(userId, fleetId);
      console.log('Fetched notifications:', raw);

      const formatted = raw.map((item) => ({
        id: item.id || item._id, // support both Mongo _id and API id
        message: item.message,
        createdAt: new Date(item.createdAt),
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket connection for real-time updates
  const connectWebSocket = () => {
    if (!userId || !fleetId || wsRef.current) return;

    const ws = new WebSocket(`${wsUrl}/${userId}/${fleetId}/ws`);
    wsRef.current = ws;

    ws.onopen = () => console.log('WebSocket connected for user:', userId);

    ws.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        console.log('New notification received:', newNotification);

        setNotifications((prev) => {
          const exists = prev.some(
            (n) => n.id === newNotification.id || n.id === newNotification._id
          );
          if (exists) return prev;

          return [
            {
              id: newNotification.id || newNotification._id,
              message: newNotification.message,
              createdAt: new Date(newNotification.createdAt),
            },
            ...prev,
          ];
        });
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      wsRef.current = null;
    };
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Modal
      isVisible={visible}
      coverScreen={true} // 👈 ensures it overlays everything
      backdropOpacity={0.0} // 👈 adds light dim behind for clarity
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      style={{
        marginTop: height * 0.1,
        justifyContent: 'flex-start',
        zIndex: 9999, // 👈 ensures it’s above ETA
      }}
    >
      <View style={homeStyles.modalContent}>
        <Text style={homeStyles.modalText}>Notifications</Text>

        {isLoading ? (
          <Text style={{ textAlign: 'center', padding: 20, fontFamily: 'Montserrat-Regular' }}>
            Loading notifications...
          </Text>
        ) : (
          <FlatList
            data={sortedNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={homeStyles.notificationItem}>
                <Text style={{ fontFamily: 'Montserrat-Regular' }}>{item.message}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  {isRecentNotification(item.createdAt) && (
                    <View style={homeStyles.subNotificationItem}>
                      <Text style={homeStyles.newText}>NEW</Text>
                    </View>
                  )}
                  <Text style={homeStyles.timeText}>{formatTimeOnly(item.createdAt)}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', padding: 20, fontFamily: 'Montserrat-Regular' }}>
                No notifications yet
              </Text>
            }
          />
        )}
      </View>
    </Modal>
  );
};
