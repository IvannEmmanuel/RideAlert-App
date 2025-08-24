// import { Platform, Alert } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// export const requestLocationPermission = async () => {
//   const permission = Platform.OS === 'android'
//     ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
//     : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

//   const result = await check(permission);
//   if (result === RESULTS.GRANTED) return true;

//   const reqResult = await request(permission);
//   return reqResult === RESULTS.GRANTED;
// };

// // export const getCurrentLocation = (onSuccess, onError) => {
// //   Geolocation.getCurrentPosition(
// //     pos => {
// //       const { latitude, longitude } = pos.coords;
// //       onSuccess({ latitude, longitude });
// //     },
// //     error => {
// //       Alert.alert('Error getting location', error.message);
// //       onError(error);
// //     },
// //     { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
// //   );
// // };