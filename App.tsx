import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';

const App: React.FC = () => {
  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    const unsubscribe = messaging.onMessage(async remoteMessage => {
      console.log('📲 Foreground message received:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new message'
      );
    });

    const requestNotificationPermission = async () => {
      const authStatus = await requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('✅ Notification permission granted.');
      } else {
        console.log('❌ Notification permission denied.');
      }

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Android notification permission granted.');
        } else {
          console.log('❌ Android notification permission denied.');
          Alert.alert(
            'Notifications Disabled',
            'Please enable notifications in your settings to receive alerts.'
          );
        }
      }
    };

    requestNotificationPermission();

    return unsubscribe;
  }, []);

  return <AppNavigator />;
};

export default App;