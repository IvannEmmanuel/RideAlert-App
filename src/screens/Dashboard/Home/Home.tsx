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
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getToken, getUser } from '../../../utils/authStorage';
import { NotificationModal } from '../../../components/NotificationModal';
import homeStyles from '../../../styles/homeStyles';
import DEFAULT_REGION from './default_region';
import { useLocation } from '../../../context/LocationContext';
import { getAnimatedStyle } from './animateStyle/animatedStyle';

interface User {
  id: string;
  first_name: string;
  fleet_id?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bus = route.params?.bus;
  const [buses, setBuses] = useState<any[]>([]);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const mapRef = useRef<MapView>(null);
  const animation = useRef(new Animated.Value(0)).current;

  const { location, error } = useLocation();

  useEffect(() => {
    if (!user?.fleet_id) return;

    const wsUrl = `ws://192.168.1.7:8000/ws/vehicles/available/${user.fleet_id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("Connected to WS for fleet", user.fleet_id);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Available vehicles:", data);
        setBuses(data); // keep updating buses in state
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = (err) => console.error("WS error:", err);
    ws.onclose = () => console.log("WS closed");

    return () => ws.close();
  }, [user?.fleet_id]);

  // Fetch user data
  const fetchUserData = async () => {
    const [t, u] = await Promise.all([getToken(), getUser()]);
    setToken(t);
    setUser(u);
  };

  // Handle navigation and UI interactions
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  // Effects
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log('Bus from params:', bus);
    if (bus?.location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: bus.location.latitude,
          longitude: bus.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [bus]);

  return (
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
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={require('../../../images/notification.png')} style={homeStyles.notification} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
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
          showsUserLocation
          followsUserLocation
        >
          {location && (
            <Marker coordinate={location} title="You are here" pinColor="blue" />
          )}
          {buses
            .filter((b) => bus && b.id === bus.id) // only keep the one you selected
            .map((b) =>
              b.location ? (
                <Marker
                  key={b.id}
                  coordinate={{
                    latitude: b.location.latitude,
                    longitude: b.location.longitude,
                  }}
                  title={b.route}
                  description={`Seats: ${b.available_seats}`}
                  pinColor="red"
                />
              ) : null
            )
          }
        </MapView>
      </View>

      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userId={user?.id}
      />

      <Animated.View style={[homeStyles.searchContainer, getAnimatedStyle(animation)]}>
        {isSearchExpanded ? (
          <View>
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
          <TouchableOpacity onPress={handleSearchPress} style={{ flex: 1, justifyContent: 'center' }}>
            <Image source={require('../../../images/search.png')} style={{ alignSelf: 'center' }} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default HomeScreen;