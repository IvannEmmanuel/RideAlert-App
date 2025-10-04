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

// HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Vibration } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getToken, getUser } from '../../../utils/authStorage';
import { NotificationModal } from '../../../components/NotificationModal';
import homeStyles from '../../../styles/homeStyles';
import DEFAULT_REGION from './default_region';
import { useLocation } from '../../../context/LocationContext';
import { getAnimatedStyle } from './animateStyle/animatedStyle';
import getGreeting from './utils/greeting';
import getRouteCoordinates from './utils/getRouteCoordinates';
import { useBus } from '../../../context/BusContext';
import { BASE_URL } from '../../../config/apiConfig';
import { sendLocationToBackend } from './sendLocation';

interface User {
  id: string;
  first_name: string;
  fleet_id?: string;
}

// Custom debounce hook
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number>(0);

  const mapRef = useRef<MapView>(null);
  const animation = useRef(new Animated.Value(0)).current;

  const { location, error } = useLocation();

  const {
    buses, setBuses,
    selectedBus, setSelectedBus,
    currentBusLocation, setCurrentBusLocation,
    routeCoordinates, setRouteCoordinates
  } = useBus();

  // Debounce location updates - ONLY send every 7 seconds
  const debouncedLocation = useDebounce(location, 7000);

  // Location sending to backend with 7-second debouncing
  useEffect(() => {
    console.log('🔍 Location effect triggered:', {
      hasLocation: !!debouncedLocation,
      location: debouncedLocation,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });

    if (!debouncedLocation || !token) {
      console.log('⏭️ Skipping send: missing location or token');
      return;
    }

    // Additional safety check - only send if 7 seconds have passed
    const now = Date.now();
    if (now - lastSentTime < 7000) {
      console.log('⏰ Additional cooldown active, skipping send');
      return;
    }

    console.log('📤 Sending location (7s debounce):', {
      lat: debouncedLocation.latitude,
      lng: debouncedLocation.longitude
    });

    setLastSentTime(now);

    sendLocationToBackend(debouncedLocation.latitude, debouncedLocation.longitude, token)
      .then(() => console.log('✅ Location sent to backend (7s debounce)'))
      .catch(err => console.error('❌ Failed to send location', err));
  }, [debouncedLocation, token]);

  // Update current bus location when buses or selected bus changes
  useEffect(() => {
    if (selectedBus && buses.length > 0) {
      const updatedBus = buses.find(b => b.id === selectedBus.id);
      if (updatedBus && updatedBus.location) {
        setCurrentBusLocation(updatedBus.location);
      }
    }
  }, [buses, selectedBus?.id]);

  // Fetch route coordinates when bus location or user location changes
  useEffect(() => {
    const fetchRoute = async () => {
      if (currentBusLocation && location) {
        console.log('Fetching route for bus location:', currentBusLocation);
        const coords = await getRouteCoordinates(location, currentBusLocation);
        setRouteCoordinates(coords);
      } else {
        setRouteCoordinates([]);
      }
    };

    fetchRoute();
  }, [currentBusLocation?.latitude, currentBusLocation?.longitude, location?.latitude, location?.longitude]);

  // WebSocket connection for real-time bus updates
  useEffect(() => {
    if (!user?.fleet_id) {
      console.log('⏭️ No fleet_id available, skipping WebSocket connection');
      return;
    }

    const wsUrl = `wss://${BASE_URL}/ws/vehicles/available/${user.fleet_id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket for fleet:", user.fleet_id);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("🚌 Available vehicles received:", data.length);
        setBuses(data);
      } catch (err) {
        console.log("❌ WebSocket parse error:", err);
      }
    };

    ws.onerror = (err) => {
      console.log("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket connection closed");
    };

    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      ws.close();
    };
  }, [user?.fleet_id]);

  // Fetch user data on component mount
  const fetchUserData = async () => {
    try {
      const [t, u] = await Promise.all([getToken(), getUser()]);
      setToken(t);
      setUser(u);
      console.log('👤 User data loaded:', {
        id: u?.id,
        name: u?.first_name,
        fleet_id: u?.fleet_id,
        hasToken: !!t
      });
    } catch (error) {
      console.error('❌ Failed to fetch user data:', error);
    }
  };

  // Handle search panel expansion
  const handleSearchPress = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSearchExpanded(true);
  };

  // Handle search panel collapse
  const handleCloseSearch = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsSearchExpanded(false);
  };

  // Initialize user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle location errors
  useEffect(() => {
    if (error) {
      console.error('📍 Location error:', error);
    }
  }, [error]);

  return (
    <View style={homeStyles.container}>
      {/* Top Header Section */}
      <View style={homeStyles.topContainer}>
        <View style={homeStyles.subTopContainer}>
          <View style={homeStyles.profileContainer}>
            <Text style={homeStyles.profileText}>
              {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={homeStyles.informationContainer}>
            <Text style={homeStyles.goodmorningText}>{getGreeting()}</Text>
            <Text style={homeStyles.userText}>{user?.first_name || 'User'}</Text>
          </View>
          <View style={homeStyles.settingContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={require('../../../images/notification.png')}
                style={homeStyles.notification}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image
                source={require('../../../images/settings.png')}
                style={homeStyles.settings}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Map Section */}
      <View style={homeStyles.mapContainer}>
        <MapView
          ref={mapRef}
          style={homeStyles.map}
          initialRegion={DEFAULT_REGION}
          showsUserLocation={true}
          followsUserLocation={false}
          showsMyLocationButton={true}
        >
          {/* User Location Marker */}
          {location && (
            <Marker
              coordinate={location}
              title="You are here"
              description="Your current location"
              image={require('../../../assets/user.png')}
            />
          )}

          {/* Selected Bus Marker */}
          {selectedBus && currentBusLocation && (
            <Marker
              key={`bus-${selectedBus.id}-${currentBusLocation.latitude}-${currentBusLocation.longitude}`}
              coordinate={{
                latitude: currentBusLocation.latitude,
                longitude: currentBusLocation.longitude,
              }}
              title={selectedBus.route || 'Bus'}
              description={`Bound For: ${selectedBus.bound_for || "Not available"}`}
              image={require('../../../assets/bus.png')}
            />
          )}

          {/* Route Polyline */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#3498db"
              strokeWidth={4}
              lineDashPattern={[0]}
            />
          )}
        </MapView>
      </View>

      {/* Notification Modal */}
      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userId={user?.id}
        fleetId={user?.fleet_id}
      />

      {/* Search Panel */}
      <Animated.View style={[homeStyles.searchContainer, getAnimatedStyle(animation)]}>
        {isSearchExpanded ? (
          <View style={homeStyles.expandedSearchContent}>
            <View style={homeStyles.subSearchContainer}>
              <TouchableOpacity onPress={handleCloseSearch}>
                <View style={homeStyles.stroke} />
              </TouchableOpacity>
              <Text style={homeStyles.rideText}>Looking for a ride?</Text>
            </View>
            <TouchableOpacity
              style={homeStyles.subMainSearchContainer}
              onPress={() => navigation.navigate('AvailableBus')}
            >
              <View style={homeStyles.subOfMainSearchContainer}>
                <Image source={require('../../../images/search.png')} />
                <Text style={homeStyles.searchText}>Search Buses</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleSearchPress}
            style={homeStyles.collapsedSearchButton}
          >
            <Image
              source={require('../../../images/search.png')}
              style={homeStyles.searchIcon}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default HomeScreen;