// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
// import { getApp } from '@react-native-firebase/app';
// import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

// // Get default Firebase app instance
// const app = getApp();

// // Get messaging instance
// const messaging = getMessaging(app);

// // Register background handler with modular API
// messaging.setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { getApp } from '@react-native-firebase/app';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

// Get default Firebase app instance
const app = getApp();

// Get messaging instance
const messaging = getMessaging(app);

// Register background handler with modular API
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('📩 Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
