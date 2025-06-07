import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("fcm_token");
    return token;
  } catch (e) {
    console.log("Error getting FCM token", e);
    return null;
  }
};