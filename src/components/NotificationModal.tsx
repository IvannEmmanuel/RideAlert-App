import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import homeStyles from '../styles/homeStyles';
import { fetchNotificationsByUser } from '../api/notifications';
import { wsUrl } from '../config/apiConfig';

const { height } = Dimensions.get('window');

const formatTimeOnly = (date) => {
  const localDate = new Date(date);
  return localDate.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
};

const isRecentNotification = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return false;
  const diff = (now.getTime() - created.getTime()) / 60000;
  return diff >= 0 && diff < 10;
};

export const NotificationModal = ({ visible, onClose, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef(null);

  // Fetch initial notifications when modal opens
  useEffect(() => {
    if (visible && userId) {
      fetchInitialNotifications();
      connectWebSocket();
    } else if (!visible) {
      disconnectWebSocket();
    }

    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
    };
  }, [visible, userId]);

  const fetchInitialNotifications = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const raw = await fetchNotificationsByUser(userId);
      const formatted = raw.map((item) => ({
        id: item.id,
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

  const connectWebSocket = () => {
    if (!userId || wsRef.current) return;

    try {
      const ws = new WebSocket(`${wsUrl}/${userId}/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('NotificationModal WebSocket connected for user:', userId);
      };

      ws.onmessage = (event) => {
        try {
          const newNotification = JSON.parse(event.data);
          console.log('New notification received:', newNotification);
          
          setNotifications((prev) => {
            // Check if notification already exists
            const exists = prev.some((n) => n.id === newNotification.id);
            if (exists) return prev;
            
            // Add new notification at the top
            return [
              {
                id: newNotification.id,
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

      ws.onerror = (error) => {
        console.error('NotificationModal WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log('NotificationModal WebSocket disconnected:', event.code, event.reason);
        wsRef.current = null;
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

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
      coverScreen={false}
      backdropOpacity={0}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      style={{ marginTop: height * 0.1, justifyContent: 'flex-start' }}
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