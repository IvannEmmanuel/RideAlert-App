import React from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import homeStyles from '../styles/homeStyles';

const { height } = Dimensions.get('window');

// Format time in local timezone (Asia/Manila)
const formatTimeOnly = (date) => {
  const localDate = new Date(date);
  return localDate.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
};

// Check if notification is less than 10 minutes old
const isRecentNotification = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);

  if (isNaN(created.getTime())) return false;

  const diff = (now.getTime() - created.getTime()) / 60000; // minutes
  return diff >= 0 && diff < 10;
};

export const NotificationModal = ({ visible, onClose, notifications }) => {
  // Sort notifications by newest first
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
        />
      </View>
    </Modal>
  );
};