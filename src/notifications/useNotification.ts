import { useEffect } from 'react';
import {PermissionsAndroid} from 'react-native';
import messaging, { getMessaging } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestUserPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
    } else {
        console.log('Notification permission denied');
    }
}

const getToken = async () => {
    try {
        const messaging = getMessaging();
        const token = await messaging.getToken();
        console.log('FCM Token:', token);
        if (token) {
            await AsyncStorage.setItem
            ('fcm_token', token);
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
    }
}


export const useNotification = () => {
    useEffect(() => {
        requestUserPermission();
        getToken();
    }, []);
}