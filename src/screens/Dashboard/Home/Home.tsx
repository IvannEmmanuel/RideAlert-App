// // Updated Home.tsx - Only showing the relevant changes

// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import { useNavigation } from '@react-navigation/native';
// import { getToken, getUser } from '../../../utils/authStorage';
// import { getFCMToken } from '../../../utils/fcmStorage';
// import { requestLocationPermission } from './useLocation';
// import { sendLocationToBackend } from './sendLocation';
// import { NotificationModal } from '../../../components/NotificationModal';
// import homeStyles from '../../../styles/homeStyles';

// const { height, width } = Dimensions.get('window');

// const DEFAULT_REGION = {
//   latitude: 8.485255,
//   longitude: 124.653642,
//   latitudeDelta: 0.01,
//   longitudeDelta: 0.01,
// };

// const HomeScreen = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<any>(null);
//   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);

//   const mapRef = useRef<MapView>(null);
//   const animation = useRef(new Animated.Value(0)).current;
//   const navigation = useNavigation();

//   // Fetch token and user
//   useEffect(() => {
//     const fetchData = async () => {
//       const t = await getToken();
//       const u = await getUser();
//       setToken(t);
//       setUser(u);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     // Get current location first (fast response if cached)
//     Geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setLocation({ latitude, longitude });
//         sendLocationToBackend(latitude, longitude, token);
//       },
//       (err) => console.error('Error getting current position:', err),
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,       // Wait max 15s for GPS
//         maximumAge: 10000,    // Use cached location if <10s old
//       }
//     );

//     // Then start watching position for continuous updates
//     const watchId = Geolocation.watchPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setLocation({ latitude, longitude });
//         sendLocationToBackend(latitude, longitude, token);
//       },
//       (err) => console.error('Error watching position:', err),
//       {
//         enableHighAccuracy: true,
//         distanceFilter: 30,   // Update after 30m movement
//         interval: 5000,       // Request updates every 5s
//         fastestInterval: 2000 // (Android) Minimum time between updates
//       }
//     );

//     return () => Geolocation.clearWatch(watchId);
//   }, [token]);


//   // Animate map to user location
//   useEffect(() => {
//     if (location && mapRef.current) {
//       mapRef.current.animateToRegion(
//         {
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         },
//         1000
//       );
//     }
//   }, [location]);

//   const handleNotificationPress = () => setModalVisible(true);
//   const handleSetting = () => navigation.navigate('Profile');
//   const handleSearchBus = () => navigation.navigate('AvailableBus');

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning,';
//     if (hour < 18) return 'Good Afternoon,';
//     return 'Good Evening,';
//   };

//   const handleSearchPress = () => {
//     Animated.timing(animation, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//     setIsSearchExpanded(true);
//   };

//   const handleCloseSearch = () => {
//     Animated.timing(animation, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//     setIsSearchExpanded(false);
//   };

//   const animatedStyle = {
//     width: animation.interpolate({ inputRange: [0, 1], outputRange: [60, width] }),
//     height: animation.interpolate({ inputRange: [0, 1], outputRange: [60, 210] }),
//     borderTopLeftRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 48] }),
//     borderTopRightRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 48] }),
//     borderBottomLeftRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
//     borderBottomRightRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
//     backgroundColor: animation.interpolate({ inputRange: [0, 1], outputRange: ['#0500FE', '#F7F6FB'] }),
//     bottom: animation.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
//     left: animation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
//   };

//   return (
//     <>
//       <View style={homeStyles.container}>
//         <View style={homeStyles.topContainer}>
//           <View style={homeStyles.subTopContainer}>
//             <View style={homeStyles.profileContainer}>
//               <Text style={homeStyles.profileText}>
//                 {user?.first_name?.charAt(0)?.toUpperCase() || ''}
//               </Text>
//             </View>
//             <View style={homeStyles.informationContainer}>
//               <Text style={homeStyles.goodmorningText}>{getGreeting()}</Text>
//               <Text style={homeStyles.userText}>{user?.first_name}</Text>
//             </View>
//             <View style={homeStyles.settingContainer}>
//               <TouchableOpacity onPress={handleNotificationPress}>
//                 <Image source={require('../../../images/notification.png')} style={homeStyles.notification} />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleSetting}>
//                 <Image source={require('../../../images/settings.png')} style={homeStyles.settings} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         <View style={homeStyles.mapContainer}>
//           <MapView
//             ref={mapRef}
//             style={homeStyles.map}
//             initialRegion={DEFAULT_REGION}
//             showsUserLocation={true}
//           >
//             {location && <Marker coordinate={location} title="You are here" />}
//           </MapView>
//         </View>

//         {/* Updated NotificationModal to pass userId instead of notifications array */}
//         <NotificationModal
//           visible={modalVisible}
//           onClose={() => setModalVisible(false)}
//           userId={user?.id}
//         />
//       </View>

//       <Animated.View style={[homeStyles.searchContainer, animatedStyle]}>
//         {!isSearchExpanded ? (
//           <TouchableOpacity onPress={handleSearchPress} style={{ justifyContent: "center", flex: 1 }}>
//             <Image source={require('../../../images/search.png')} style={{ alignSelf: 'center' }} />
//           </TouchableOpacity>
//         ) : (
//           <>
//             <View style={homeStyles.subSearchContainer}>
//               <TouchableOpacity onPress={handleCloseSearch}>
//                 <View style={homeStyles.stroke} />
//               </TouchableOpacity>
//               <Text style={homeStyles.rideText}>Looking for a ride?</Text>
//             </View>

//             <TouchableOpacity style={homeStyles.subMainSearchContainer} onPress={handleSearchBus}>
//               <View style={homeStyles.subOfMainSearchContainer}>
//                 <Image source={require('../../../images/search.png')} />
//                 <Text style={homeStyles.searchText}>Search Buses</Text>
//               </View>
//             </TouchableOpacity>
//           </>
//         )}
//       </Animated.View>
//     </>
//   );
// };

// export default HomeScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import RNGetLocation from 'react-native-get-location';
import { getToken, getUser } from '../../../utils/authStorage';
import { sendLocationToBackend } from './sendLocation';
import { NotificationModal } from '../../../components/NotificationModal';
import homeStyles from '../../../styles/homeStyles';

const { height, width } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 8.485255,
  longitude: 124.653642,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const HomeScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLocationRequestInProgress = useRef(false);
  const lastLocationTimeRef = useRef<number>(0);
  const lastSuccessfulLocationRef = useRef<any>(null);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to track your position",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  };

  // Get current location using react-native-get-location
  const getCurrentLocation = async () => {
    // Prevent multiple simultaneous location requests
    if (isLocationRequestInProgress.current) {
      console.log('Location request already in progress, skipping...');
      return;
    }

    // Throttle location requests to prevent too frequent calls
    const now = Date.now();
    if (now - lastLocationTimeRef.current < 4000) { // 4 second throttle
      console.log('Location request throttled');
      return;
    }

    isLocationRequestInProgress.current = true;
    lastLocationTimeRef.current = now;

    try {
      const location = await RNGetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000, // Increased timeout to 8 seconds
        maximumAge: 30000, // Accept cached locations up to 30 seconds old
      });

      const newLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setCurrentLocation(newLocation);
      setLocationError(null);
      lastSuccessfulLocationRef.current = newLocation;

      // Send to backend if token exists
      if (token) {
        sendLocationToBackend(location.latitude, location.longitude, token);
      }

      // Center map on location
      mapRef.current?.animateToRegion(newLocation, 1000);

    } catch (error: any) {
      // Only log errors that aren't cancellation-related or timeouts
      if (error.code !== 'CANCELLED' &&
        error.message !== 'Location cancelled by another request' &&
        error.code !== 'TIMEOUT') {
        console.error('Error getting location:', error);

        if (error.code === 'UNAVAILABLE') {
          setLocationError('Location services are not available');
        } else if (error.code === 'UNAUTHORIZED') {
          setLocationError('Location permission denied');
        } else {
          setLocationError('Failed to get location');
        }
      } else if (error.code === 'TIMEOUT') {
        // Timeout is expected, not a real error
        console.log('Location request timed out (will retry)');

        // Use last known location if available
        if (lastSuccessfulLocationRef.current) {
          setCurrentLocation(lastSuccessfulLocationRef.current);
          if (token) {
            sendLocationToBackend(
              lastSuccessfulLocationRef.current.latitude,
              lastSuccessfulLocationRef.current.longitude,
              token
            );
          }
        }
      } else {
        // This is expected behavior, no need to log as error
        console.log('Location request cancelled (expected behavior)');
      }
    } finally {
      isLocationRequestInProgress.current = false;
    }
  };

  // Start location updates every 5 seconds
  const startLocationUpdates = () => {
    // Get initial location immediately
    getCurrentLocation();

    // Then set up interval for every 5 seconds
    locationIntervalRef.current = setInterval(getCurrentLocation, 5000);
  };

  // Stop location updates
  const stopLocationUpdates = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    isLocationRequestInProgress.current = false;
  };

  // Fetch token and user
  useEffect(() => {
    const fetchData = async () => {
      const t = await getToken();
      const u = await getUser();
      setToken(t);
      setUser(u);
    };
    fetchData();
  }, []);

  // Setup location tracking
  useEffect(() => {
    const initLocationTracking = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        startLocationUpdates();
      } else {
        setLocationError('Location permission denied');
      }
    };

    initLocationTracking();

    // Cleanup on component unmount
    return () => stopLocationUpdates();
  }, [token]);

  const handleNotificationPress = () => setModalVisible(true);
  const handleSetting = () => navigation.navigate('Profile');
  const handleSearchBus = () => navigation.navigate('AvailableBus');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const handleSearchPress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSearchExpanded(true);
  };

  const handleCloseSearch = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSearchExpanded(false);
  };

  const animatedStyle = {
    width: animation.interpolate({ inputRange: [0, 1], outputRange: [60, width] }),
    height: animation.interpolate({ inputRange: [0, 1], outputRange: [60, 210] }),
    borderTopLeftRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 48] }),
    borderTopRightRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 48] }),
    borderBottomLeftRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
    borderBottomRightRadius: animation.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }),
    backgroundColor: animation.interpolate({ inputRange: [0, 1], outputRange: ['#0500FE', '#F7F6FB'] }),
    bottom: animation.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
    left: animation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
  };

  return (
    <>
      <View style={homeStyles.container}>
        <View style={homeStyles.topContainer}>
          <View style={homeStyles.subTopContainer}>
            <View style={homeStyles.profileContainer}>
              <Text style={homeStyles.profileText}>
                {user?.first_name?.charAt(0)?.toUpperCase() || ''}
              </Text>
            </View>
            <View style={homeStyles.informationContainer}>
              <Text style={homeStyles.goodmorningText}>{getGreeting()}</Text>
              <Text style={homeStyles.userText}>{user?.first_name}</Text>
            </View>
            <View style={homeStyles.settingContainer}>
              <TouchableOpacity onPress={handleNotificationPress}>
                <Image source={require('../../../images/notification.png')} style={homeStyles.notification} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSetting}>
                <Image source={require('../../../images/settings.png')} style={homeStyles.settings} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={homeStyles.mapContainer}>
          <MapView
            ref={mapRef}
            style={homeStyles.map}
            initialRegion={DEFAULT_REGION}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="You are here"
                description="Your current location"
                pinColor="blue"
              />
            )}
          </MapView>

          {locationError && (
            <View style={homeStyles.errorContainer}>
              <Text style={homeStyles.errorText}>{locationError}</Text>
            </View>
          )}
        </View>

        <NotificationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={user?.id}
        />
      </View>

      <Animated.View style={[homeStyles.searchContainer, animatedStyle]}>
        {!isSearchExpanded ? (
          <TouchableOpacity onPress={handleSearchPress} style={{ justifyContent: "center", flex: 1 }}>
            <Image source={require('../../../images/search.png')} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
        ) : (
          <>
            <View style={homeStyles.subSearchContainer}>
              <TouchableOpacity onPress={handleCloseSearch}>
                <View style={homeStyles.stroke} />
              </TouchableOpacity>
              <Text style={homeStyles.rideText}>Looking for a ride?</Text>
            </View>

            <TouchableOpacity style={homeStyles.subMainSearchContainer} onPress={handleSearchBus}>
              <View style={homeStyles.subOfMainSearchContainer}>
                <Image source={require('../../../images/search.png')} />
                <Text style={homeStyles.searchText}>Search Buses</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </>
  );
};

export default HomeScreen;