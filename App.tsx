import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { LocationProvider } from "./src/context/LocationContext";
import { BusProvider } from "./src/context/BusContext";
import { AuthProvider } from "./src/context/AuthContext";

const App: React.FC = () => {
  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    // 🔔 Create notification channel for heads-up alerts
    PushNotification.createChannel(
      {
        channelId: "high_priority_channel", // Must match backend
        channelName: "High Priority Alerts",
        channelDescription: "Notifications that pop up immediately",
        importance: 4, // Max importance for heads-up
        vibrate: true,
        soundName: "default",
      },
      (created) => console.log(`🔔 Notification channel created: ${created}`)
    );

    // 📲 Handle foreground messages with native notification
    const unsubscribe = messaging.onMessage(async (remoteMessage) => {
      console.log("📲 Foreground message received:", remoteMessage);

      PushNotification.localNotification({
        channelId: "high_priority_channel",
        title: remoteMessage.notification?.title || "RideAlert",
        message: remoteMessage.notification?.body || "You have a new alert",
        playSound: true,
        soundName: "default",
        importance: "high",
        vibrate: true,
      });
    });

    // 🔐 Request notification permissions
    const requestNotificationPermission = async () => {
      const authStatus = await requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("✅ Firebase notification permission granted.");
      } else {
        console.log("❌ Firebase notification permission denied.");
      }

      // 🛡️ Android 13+ runtime permission
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("✅ Android POST_NOTIFICATIONS permission granted.");
        } else {
          console.log("❌ Android POST_NOTIFICATIONS permission denied.");
          Alert.alert(
            "Notifications Disabled",
            "Please enable notifications in your settings to receive alerts."
          );
        }
      }

      // 📡 Log FCM token for backend syncing
      const token = await messaging.getToken();
      console.log("📡 FCM Token:", token);
    };

    requestNotificationPermission();

    return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <BusProvider>
        <LocationProvider>
          <AppNavigator />
        </LocationProvider>
      </BusProvider>
    </AuthProvider>
  );
};

export default App;
