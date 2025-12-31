//WORKING NI SIYA ANG PROBLEM ANI KAY PAG E KILL ANG APP.

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { View, Text, TouchableOpacity, Image, Animated, AppState } from 'react-native';
// import MapView, { Marker, Polyline } from 'react-native-maps';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getToken, getUser } from '../../../utils/authStorage';
// import { NotificationModal } from '../../../components/NotificationModal';
// import homeStyles from '../../../styles/homeStyles';
// import DEFAULT_REGION from './default_region';
// import { useLocation } from '../../../context/LocationContext';
// import { getAnimatedStyle } from './animateStyle/animatedStyle';
// import getGreeting from './utils/greeting';
// import getRouteCoordinates from './utils/getRouteCoordinates';
// import { useBus } from '../../../context/BusContext';
// import { BASE_URL } from '../../../config/apiConfig';
// import { sendLocationToBackend } from './sendLocation';

// interface User {
//   id: string;
//   first_name: string;
//   fleet_id?: string;
// }

// const CACHE_KEY = 'cached_buses_data';
// const SELECTED_BUS_KEY = 'selected_bus_data';
// const POLL_INTERVAL = 15000;
// const CACHE_DEBOUNCE = 2000; // Only cache every 2 seconds

// const useDebounce = (value: any, delay: number) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(handler);
//   }, [value, delay]);
//   return debouncedValue;
// };

// const HomeScreen: React.FC = () => {
//   const navigation = useNavigation();
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);

//   const mapRef = useRef<MapView>(null);
//   const animation = useRef(new Animated.Value(0)).current;
//   const lastSentTimeRef = useRef<number>(0);
//   const lastCacheTimeRef = useRef<number>(0);
//   const wsRef = useRef<WebSocket | null>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const appStateRef = useRef(AppState.currentState);
//   const isMountedRef = useRef(true);
//   const userRef = useRef<User | null>(null);
//   const tokenRef = useRef<string | null>(null);

//   const { location } = useLocation();
//   const { 
//     buses, 
//     setBuses, 
//     selectedBus, 
//     setSelectedBus, 
//     currentBusLocation, 
//     setCurrentBusLocation, 
//     routeCoordinates, 
//     setRouteCoordinates 
//   } = useBus();

//   const debouncedLocation = useDebounce(location, 3000);

//   // Debounced cache function to prevent excessive writes
//   const cacheBusesDataDebounced = useCallback(async (busesData: any[]) => {
//     const now = Date.now();
//     if (now - lastCacheTimeRef.current < CACHE_DEBOUNCE) return;
    
//     lastCacheTimeRef.current = now;
//     try {
//       await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(busesData));
//     } catch (error) {
//       // Silently fail - caching is not critical
//     }
//   }, []);

//   const loadCachedBuses = useCallback(async () => {
//     try {
//       const cached = await AsyncStorage.getItem(CACHE_KEY);
//       if (cached && isMountedRef.current) {
//         const busesData = JSON.parse(cached);
//         setBuses(busesData);
//         return busesData;
//       }
//     } catch (error) {
//       // Silently fail
//     }
//     return null;
//   }, [setBuses]);

//   const cacheSelectedBus = useCallback(async (bus: any) => {
//     try {
//       await AsyncStorage.setItem(SELECTED_BUS_KEY, JSON.stringify(bus));
//     } catch (error) {
//       // Silently fail
//     }
//   }, []);

//   const loadCachedSelectedBus = useCallback(async () => {
//     try {
//       const cached = await AsyncStorage.getItem(SELECTED_BUS_KEY);
//       if (cached && isMountedRef.current) {
//         const busData = JSON.parse(cached);
//         setSelectedBus(busData);
//         if (busData.location) {
//           setCurrentBusLocation(busData.location);
//         }
//         return busData;
//       }
//     } catch (error) {
//       // Silently fail
//     }
//     return null;
//   }, [setSelectedBus, setCurrentBusLocation]);

//   const fetchBusesViaHTTP = useCallback(async (fleetId: string, authToken: string) => {
//     if (!isMountedRef.current) return null;
    
//     try {
//       const response = await fetch(`https://${BASE_URL}/api/vehicles/available/${fleetId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${authToken}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok && isMountedRef.current) {
//         const data = await response.json();
//         setBuses(data);
//         cacheBusesDataDebounced(data);
//         return data;
//       }
//     } catch (error) {
//       // Silently fail
//     }
//     return null;
//   }, [setBuses, cacheBusesDataDebounced]);

//   const stopPolling = useCallback(() => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current);
//       pollingIntervalRef.current = null;
//     }
//   }, []);

//   const startPolling = useCallback((fleetId: string, authToken: string) => {
//     stopPolling();
//     fetchBusesViaHTTP(fleetId, authToken);
    
//     pollingIntervalRef.current = setInterval(() => {
//       if (isMountedRef.current && appStateRef.current === 'active') {
//         fetchBusesViaHTTP(fleetId, authToken);
//       }
//     }, POLL_INTERVAL);
//   }, [stopPolling, fetchBusesViaHTTP]);

//   const initWebSocket = useCallback((fleet_id: string) => {
//     if (wsRef.current) {
//       wsRef.current.onclose = null;
//       wsRef.current.close();
//       wsRef.current = null;
//     }

//     const wsUrl = `wss://${BASE_URL}/ws/vehicles/available/${fleet_id}`;
    
//     try {
//       const ws = new WebSocket(wsUrl);
      
//       ws.onopen = () => {
//         stopPolling();
//       };

//       ws.onmessage = (event) => {
//         if (!isMountedRef.current) return;
        
//         try {
//           const data = JSON.parse(event.data);
//           setBuses(data);
//           cacheBusesDataDebounced(data);
//         } catch (error) {
//           // Silently fail
//         }
//       };

//       ws.onerror = () => {
//         // Silently fail
//       };

//       ws.onclose = () => {
//         wsRef.current = null;
        
//         if (isMountedRef.current && tokenRef.current && userRef.current?.fleet_id) {
//           startPolling(userRef.current.fleet_id, tokenRef.current);
//         }
//       };

//       wsRef.current = ws;
//     } catch (error) {
//       if (tokenRef.current && userRef.current?.fleet_id) {
//         startPolling(userRef.current.fleet_id, tokenRef.current);
//       }
//     }
//   }, [stopPolling, startPolling, setBuses, cacheBusesDataDebounced]);

//   const cleanup = useCallback(() => {
//     if (wsRef.current) {
//       wsRef.current.onclose = null;
//       wsRef.current.close();
//       wsRef.current = null;
//     }
//     stopPolling();
//   }, [stopPolling]);

//   const fetchUserData = useCallback(async () => {
//     try {
//       const [t, u] = await Promise.all([getToken(), getUser()]);
//       if (isMountedRef.current) {
//         setToken(t);
//         setUser(u);
//         tokenRef.current = t;
//         userRef.current = u;
//       }
//       return { token: t, user: u };
//     } catch (error) {
//       return { token: null, user: null };
//     }
//   }, []);

//   // App state handler - only runs once
//   useEffect(() => {
//     const handleAppStateChange = async (nextAppState: string) => {
//       if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
//         await Promise.all([loadCachedBuses(), loadCachedSelectedBus()]);
//         const { token: t, user: u } = await fetchUserData();
//         if (u?.fleet_id && t) {
//           initWebSocket(u.fleet_id);
//         }
//       } else if (nextAppState === 'background') {
//         cleanup();
//       }
//       appStateRef.current = nextAppState;
//     };

//     const subscription = AppState.addEventListener('change', handleAppStateChange);
//     return () => subscription.remove();
//   }, []); // Empty deps - only run once

//   // Screen focus handler - memoized properly
//   useFocusEffect(
//     useCallback(() => {
//       loadCachedBuses();
//       loadCachedSelectedBus();

//       if (userRef.current?.fleet_id && tokenRef.current && !wsRef.current) {
//         initWebSocket(userRef.current.fleet_id);
//       }

//       return () => {
//         // Don't cleanup on unfocus
//       };
//     }, []) // Empty deps - stable reference
//   );

//   // Initial setup - only runs once
//   useEffect(() => {
//     const initialize = async () => {
//       await Promise.all([loadCachedBuses(), loadCachedSelectedBus()]);
//       const { token: t, user: u } = await fetchUserData();
//       if (u?.fleet_id && t) {
//         initWebSocket(u.fleet_id);
//       }
//     };

//     initialize();

//     return () => {
//       isMountedRef.current = false;
//       cleanup();
//     };
//   }, []); // Empty deps - only run once

//   // Cache selected bus when it changes - debounced
//   useEffect(() => {
//     if (selectedBus) {
//       const timeoutId = setTimeout(() => {
//         cacheSelectedBus(selectedBus);
//       }, 1000);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [selectedBus, cacheSelectedBus]);

//   // Location sending with throttle
//   useEffect(() => {
//     if (!debouncedLocation || !token) return;
    
//     const now = Date.now();
//     if (now - lastSentTimeRef.current < 7000) return;
    
//     lastSentTimeRef.current = now;
//     sendLocationToBackend(
//       debouncedLocation.latitude, 
//       debouncedLocation.longitude, 
//       token
//     ).catch(() => {});
//   }, [debouncedLocation, token]);

//   // Update current bus location - memoized comparison
//   useEffect(() => {
//     if (!selectedBus || buses.length === 0) return;
    
//     const updatedBus = buses.find(b => b.id === selectedBus.id);
//     if (updatedBus?.location) {
//       const locChanged = 
//         !currentBusLocation ||
//         currentBusLocation.latitude !== updatedBus.location.latitude ||
//         currentBusLocation.longitude !== updatedBus.location.longitude;
      
//       if (locChanged) {
//         setCurrentBusLocation(updatedBus.location);
//       }
//     }
//   }, [buses, selectedBus?.id]); // Removed currentBusLocation from deps

//   // Fetch route coordinates - debounced
//   useEffect(() => {
//     if (!currentBusLocation || !location) {
//       setRouteCoordinates([]);
//       return;
//     }

//     const timeoutId = setTimeout(async () => {
//       const coords = await getRouteCoordinates(location, currentBusLocation);
//       if (isMountedRef.current) {
//         setRouteCoordinates(coords);
//       }
//     }, 500); // Debounce route calculation

//     return () => clearTimeout(timeoutId);
//   }, [
//     currentBusLocation?.latitude, 
//     currentBusLocation?.longitude, 
//     location?.latitude, 
//     location?.longitude
//   ]);

//   const handleSearchPress = useCallback(() => {
//     Animated.timing(animation, { 
//       toValue: 1, 
//       duration: 300, 
//       useNativeDriver: false 
//     }).start();
//     setIsSearchExpanded(true);
//   }, [animation]);

//   const handleCloseSearch = useCallback(() => {
//     Animated.timing(animation, { 
//       toValue: 0, 
//       duration: 300, 
//       useNativeDriver: false 
//     }).start();
//     setIsSearchExpanded(false);
//   }, [animation]);

//   return (
//     <View style={homeStyles.container}>
//       <View style={homeStyles.topContainer}>
//         <View style={homeStyles.subTopContainer}>
//           <View style={homeStyles.profileContainer}>
//             <Text style={homeStyles.profileText}>
//               {user?.first_name?.charAt(0)?.toUpperCase() || 'U'}
//             </Text>
//           </View>
//           <View style={homeStyles.informationContainer}>
//             <Text style={homeStyles.goodmorningText}>{getGreeting()}</Text>
//             <Text style={homeStyles.userText}>{user?.first_name || 'User'}</Text>
//           </View>
//           <View style={homeStyles.settingContainer}>
//             <TouchableOpacity onPress={() => setModalVisible(true)}>
//               <Image 
//                 source={require('../../../images/notification.png')} 
//                 style={homeStyles.notification} 
//               />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//               <Image 
//                 source={require('../../../images/settings.png')} 
//                 style={homeStyles.settings} 
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       <View style={homeStyles.mapContainer}>
//         <MapView 
//           ref={mapRef} 
//           style={homeStyles.map} 
//           initialRegion={DEFAULT_REGION} 
//           showsUserLocation 
//           followsUserLocation={false} 
//           showsMyLocationButton
//         >
//           {location && (
//             <Marker 
//               coordinate={location} 
//               title="You are here" 
//               description="Your current location" 
//               image={require('../../../assets/user.png')} 
//             />
//           )}
//           {selectedBus && currentBusLocation && (
//             <Marker
//               key={`bus-${selectedBus.id}`}
//               coordinate={currentBusLocation}
//               title={selectedBus.route || 'Bus'}
//               description={`Bound For: ${selectedBus.bound_for || "Not available"}`}
//               image={require('../../../assets/bus.png')}
//             />
//           )}
//           {routeCoordinates.length > 0 && (
//             <Polyline 
//               coordinates={routeCoordinates} 
//               strokeColor="#3498db" 
//               strokeWidth={4} 
//             />
//           )}
//         </MapView>
//       </View>

//       <NotificationModal 
//         visible={modalVisible} 
//         onClose={() => setModalVisible(false)} 
//         userId={user?.id} 
//         fleetId={user?.fleet_id} 
//       />

//       <Animated.View style={[homeStyles.searchContainer, getAnimatedStyle(animation)]}>
//         {isSearchExpanded ? (
//           <View style={homeStyles.expandedSearchContent}>
//             <View style={homeStyles.subSearchContainer}>
//               <TouchableOpacity onPress={handleCloseSearch}>
//                 <View style={homeStyles.stroke} />
//               </TouchableOpacity>
//               <Text style={homeStyles.rideText}>Looking for a ride?</Text>
//             </View>
//             <TouchableOpacity 
//               style={homeStyles.subMainSearchContainer} 
//               onPress={() => navigation.navigate('AvailableBus')}
//             >
//               <View style={homeStyles.subOfMainSearchContainer}>
//                 <Image source={require('../../../images/search.png')} />
//                 <Text style={homeStyles.searchText}>Search Buses</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity 
//             onPress={handleSearchPress} 
//             style={homeStyles.collapsedSearchButton}
//           >
//             <Image 
//               source={require('../../../images/search.png')} 
//               style={homeStyles.searchIcon} 
//             />
//           </TouchableOpacity>
//         )}
//       </Animated.View>
//     </View>
//   );
// };

// export default HomeScreen;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, AppState, BackHandler } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, getUser } from '../../../utils/authStorage';
import { NotificationModal } from '../../../components/NotificationModal';
import homeStyles from '../../../styles/homeStyles';
import DEFAULT_REGION from './default_region';
import { useLocation } from '../../../context/LocationContext';
import { getAnimatedStyle } from './animateStyle/animatedStyle';
import getGreeting from './utils/greeting';
import getRouteCoordinates from './utils/getRouteCoordinates';
import { useBus } from '../../../context/BusContext';
import { BASE_URL, WS_BASE_URL } from '../../../config/apiConfig';
import { sendLocationToBackend } from './sendLocation';

const CACHE_KEY = 'cached_buses_data';
const SELECTED_BUS_KEY = 'selected_bus_data';
const LOCATION_LOCK_KEY = 'location_send_lock';
const LOCATION_MUTEX_KEY = 'location_send_mutex';
const POLL_INTERVAL = 15000;
const CACHE_DEBOUNCE_MS = 2000;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const LOCATION_SEND_INTERVAL = 7000;
const MUTEX_TIMEOUT = 3000;

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
};

// Global mutex implementation for location sending
class LocationSendMutex {
  private static instance: LocationSendMutex;
  private isLocked: boolean = false;
  private queue: Array<() => void> = [];

  static getInstance(): LocationSendMutex {
    if (!LocationSendMutex.instance) {
      LocationSendMutex.instance = new LocationSendMutex();
    }
    return LocationSendMutex.instance;
  }

  async acquireLock(timeoutMs: number = MUTEX_TIMEOUT): Promise<boolean> {
    return new Promise((resolve) => {
      const attemptLock = async () => {
        if (!this.isLocked) {
          // Double-check with AsyncStorage to coordinate across all instances
          try {
            const mutexData = await AsyncStorage.getItem(LOCATION_MUTEX_KEY);
            if (mutexData) {
              const { timestamp } = JSON.parse(mutexData);
              const now = Date.now();
              // If mutex is stale (older than timeout), clear it
              if (now - timestamp > timeoutMs) {
                await AsyncStorage.removeItem(LOCATION_MUTEX_KEY);
              } else {
                // Mutex is held by another instance
                resolve(false);
                return;
              }
            }

            // Acquire mutex
            this.isLocked = true;
            await AsyncStorage.setItem(LOCATION_MUTEX_KEY, JSON.stringify({ 
              timestamp: Date.now() 
            }));
            resolve(true);
          } catch (error) {
            console.error('Mutex acquire error:', error);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      };

      attemptLock();
    });
  }

  async releaseLock(): Promise<void> {
    this.isLocked = false;
    try {
      await AsyncStorage.removeItem(LOCATION_MUTEX_KEY);
    } catch (error) {
      console.error('Mutex release error:', error);
    }
  }
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const mapRef = useRef<MapView | null>(null);
  const animation = useRef(new Animated.Value(0)).current;

  const { location } = useLocation();
  const {
    buses,
    setBuses,
    selectedBus,
    setSelectedBus,
    currentBusLocation,
    setCurrentBusLocation,
    routeCoordinates,
    setRouteCoordinates
  } = useBus();

  const debouncedLocation = useDebounce(location, 3000);

  const isMountedRef = useRef(true);
  const wsRef = useRef<any>(null);
  const pollingRef = useRef<any>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<any>(null);
  const lastCacheTimeRef = useRef(0);
  const appStateRef = useRef(AppState.currentState);
  const tokenRef = useRef<string | null>(null);
  const userRef = useRef<any>(null);
  const selectedBusRef = useRef<any>(null);
  const locationSendMutex = useRef(LocationSendMutex.getInstance());

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // ---- CACHE helpers ----
  const cacheBusesDebounced = useCallback(async (data: any[]) => {
    const now = Date.now();
    if (now - lastCacheTimeRef.current < CACHE_DEBOUNCE_MS) return;
    lastCacheTimeRef.current = now;
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Cache save error:', e);
    }
  }, []);

  const cacheSelectedBus = useCallback(async (bus: any) => {
    try {
      if (!bus) {
        await AsyncStorage.removeItem(SELECTED_BUS_KEY);
      } else {
        await AsyncStorage.setItem(SELECTED_BUS_KEY, JSON.stringify(bus));
      }
    } catch (e) {
      console.error('Cache selected bus error:', e);
    }
  }, []);

  const loadCachedBuses = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw && isMountedRef.current) {
        const parsed = JSON.parse(raw);
        setBuses(parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Load cached buses error:', e);
    }
    return null;
  }, [setBuses]);

  const loadCachedSelectedBus = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(SELECTED_BUS_KEY);
      if (raw && isMountedRef.current) {
        const parsed = JSON.parse(raw);
        setSelectedBus(parsed);
        if (parsed?.location) setCurrentBusLocation(parsed.location);
        selectedBusRef.current = parsed;
        return parsed;
      }
    } catch (e) {
      console.error('Load cached selected bus error:', e);
    }
    return null;
  }, [setSelectedBus, setCurrentBusLocation]);

  useEffect(() => {
    selectedBusRef.current = selectedBus;
  }, [selectedBus]);

  // ---- persistent user/token load ----
  const fetchUserData = useCallback(async () => {
    try {
      const [t, u] = await Promise.all([getToken(), getUser()]);
      if (!isMountedRef.current) return { token: null, user: null };
      setToken(t);
      setUser(u);
      tokenRef.current = t;
      userRef.current = u;
      return { token: t, user: u };
    } catch (e) {
      console.error('Fetch user data error:', e);
      return { token: null, user: null };
    }
  }, []);


  // ---- polling control ----
  const startPolling = useCallback((fleetId?: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    pollingRef.current = setInterval(() => {
      if (!isMountedRef.current) return;
    }, POLL_INTERVAL);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // ---- websocket with exponential backoff reconnect ----
  const cleanWs = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.onclose = null;
        wsRef.current.close();
      } catch (e) {
        console.error('Clean WS error:', e);
      }
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptRef.current = 0;
  }, []);

  const scheduleReconnect = useCallback((fleetId?: string) => {
    reconnectAttemptRef.current = (reconnectAttemptRef.current || 0) + 1;
    const attempt = reconnectAttemptRef.current;
    const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, attempt), RECONNECT_MAX_MS);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    reconnectTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      initWebSocket(fleetId);
    }, delay);
  }, []);

  const initWebSocket = useCallback((fleetId?: string) => {
    const fid = fleetId || userRef.current?.fleet_id || selectedBusRef.current?.fleet_id;
    if (!fid) return;

    if (wsRef.current) {
      try {
        wsRef.current.onclose = null;
        wsRef.current.close();
      } catch (e) {
        console.error('Close existing WS error:', e);
      }
      wsRef.current = null;
    }
    stopPolling();

    const wsUrl = `${WS_BASE_URL}/ws/vehicles/available/${fid}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttemptRef.current = 0;
      };

      ws.onmessage = (evt: any) => {
        if (!isMountedRef.current) return;
        try {
          const rawData = JSON.parse(evt.data);
          const payload = rawData.vehicles || rawData;
          setBuses(payload);
          cacheBusesDebounced(payload);
        } catch (e) {
          console.error('WebSocket message parse error:', e);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        wsRef.current = null;
        if (!isMountedRef.current) return;
        startPolling(fid);
        scheduleReconnect(fid);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        try {
          ws.close();
        } catch (e) {
          console.error('Close on error failed:', e);
        }
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('WebSocket init error:', e);
      startPolling(fid);
      scheduleReconnect(fid);
    }
  }, [stopPolling, startPolling, cacheBusesDebounced, scheduleReconnect, setBuses]);

  // ---- cleanup on unmount ----
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanWs();
      stopPolling();
    };
  }, [cleanWs, stopPolling]);

  // ---- startup initialization ----
  useEffect(() => {
    const initialize = async () => {
      await loadCachedBuses();
      const cachedSelected = await loadCachedSelectedBus();
      const { token: t, user: u } = await fetchUserData();

      const fleetIdToUse = u?.fleet_id || cachedSelected?.fleet_id;
      if (fleetIdToUse) {
        initWebSocket(fleetIdToUse);
      }
    };

    initialize();
  }, []);

  // ---- AppState handler ----
  useEffect(() => {
    const onChange = async (next: string) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      if (prev.match(/inactive|background/) && next === 'active') {
        await loadCachedBuses();
        await loadCachedSelectedBus();
        await fetchUserData();

        const fleetId = userRef.current?.fleet_id || selectedBusRef.current?.fleet_id;
        if (fleetId) {
          if (!wsRef.current) initWebSocket(fleetId);
        } else {
          startPolling();
        }
      } else if (next === 'background') {
        cleanWs();
        stopPolling();
      }
    };

    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [cleanWs, stopPolling, initWebSocket, loadCachedBuses, loadCachedSelectedBus, fetchUserData, startPolling]);

  // ---- focus handler ----
  useFocusEffect(
    useCallback(() => {
      if (!wsRef.current) {
        const fleetId = userRef.current?.fleet_id || selectedBusRef.current?.fleet_id;
        if (fleetId) initWebSocket(fleetId);
        else startPolling();
      }
      return () => {};
    }, [initWebSocket, startPolling])
  );

  // ---- update currentBusLocation from buses ----
  useEffect(() => {
    if (!selectedBus || !buses || buses.length === 0) return;
    const updated = buses.find((b: any) => b.id === selectedBus.id);
    if (updated?.location) {
      const changed =
        !currentBusLocation ||
        currentBusLocation.latitude !== updated.location.latitude ||
        currentBusLocation.longitude !== updated.location.longitude;
      if (changed) setCurrentBusLocation(updated.location);
    }
  }, [buses, selectedBus?.id, currentBusLocation, setCurrentBusLocation]);

  // Cache buses whenever they update
  useEffect(() => {
    if (buses && buses.length > 0) cacheBusesDebounced(buses);
  }, [buses, cacheBusesDebounced]);

  // Cache selectedBus changes
  useEffect(() => {
    cacheSelectedBus(selectedBus);
  }, [selectedBus, cacheSelectedBus]);

  // ---- OPTIMIZED LOCATION SENDING with Mutex ----
  const sendLocationWithMutex = useCallback(async (lat: number, lng: number, tkn: string) => {
    try {
      // Check global timestamp first (fast check)
      const lockData = await AsyncStorage.getItem(LOCATION_LOCK_KEY);
      const now = Date.now();
      
      if (lockData) {
        const lastSentTime = parseInt(lockData, 10);
        if (now - lastSentTime < LOCATION_SEND_INTERVAL) {
          // Too soon, skip
          return;
        }
      }

      // Try to acquire mutex
      const acquired = await locationSendMutex.current.acquireLock();
      
      if (!acquired) {
        // Another instance is sending or has lock
        return;
      }

      try {
        // Double-check timestamp after acquiring lock
        const lockDataAfter = await AsyncStorage.getItem(LOCATION_LOCK_KEY);
        if (lockDataAfter) {
          const lastSentTimeAfter = parseInt(lockDataAfter, 10);
          if (now - lastSentTimeAfter < LOCATION_SEND_INTERVAL) {
            return;
          }
        }

        // Update timestamp BEFORE sending
        await AsyncStorage.setItem(LOCATION_LOCK_KEY, now.toString());
        
        // Send location
        await sendLocationToBackend(lat, lng, tkn);
        console.log('✅ Location sent successfully');
        
      } finally {
        // Always release mutex
        await locationSendMutex.current.releaseLock();
      }
      
    } catch (error) {
      console.error('Send location with mutex error:', error);
      // Ensure mutex is released on error
      await locationSendMutex.current.releaseLock();
    }
  }, []);

  useEffect(() => {
    if (!debouncedLocation || !tokenRef.current) return;
    
    sendLocationWithMutex(
      debouncedLocation.latitude,
      debouncedLocation.longitude,
      tokenRef.current
    );
  }, [debouncedLocation, sendLocationWithMutex]);

  // Route calculation debounce
  useEffect(() => {
    if (!currentBusLocation || !location) {
      setRouteCoordinates([]);
      return;
    }
    const t = setTimeout(async () => {
      const coords = await getRouteCoordinates(location, currentBusLocation);
      if (isMountedRef.current) setRouteCoordinates(coords);
    }, 500);
    return () => clearTimeout(t);
  }, [
    currentBusLocation?.latitude,
    currentBusLocation?.longitude,
    location?.latitude,
    location?.longitude,
    setRouteCoordinates,
  ]);

  // UI handlers
  const handleSearchPress = useCallback(() => {
    Animated.timing(animation, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    setIsSearchExpanded(true);
  }, [animation]);

  const handleCloseSearch = useCallback(() => {
    Animated.timing(animation, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    setIsSearchExpanded(false);
  }, [animation]);

  return (
    <View style={homeStyles.container}>
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

      <View style={homeStyles.mapContainer}>
        <MapView
          ref={(r) => {
            mapRef.current = r;
          }}
          style={homeStyles.map}
          initialRegion={DEFAULT_REGION}
          showsUserLocation
          followsUserLocation={false}
          showsMyLocationButton
        >
          {location && (
            <Marker
              coordinate={location}
              title="You are here"
              description="Your current location"
              image={require('../../../assets/user.png')}
            />
          )}

          {selectedBus && currentBusLocation && (
            <Marker
              key={`bus-${selectedBus.id}`}
              coordinate={currentBusLocation}
              title={selectedBus.route || 'Bus'}
              description={`Bound For: ${selectedBus.bound_for || 'Not available'}`}
              image={require('../../../assets/bus.png')}
            />
          )}

          {routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor="#3498db" strokeWidth={4} />
          )}
        </MapView>
      </View>

      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userId={user?.id}
        fleetId={user?.fleet_id}
      />

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
          <TouchableOpacity onPress={handleSearchPress} style={homeStyles.collapsedSearchButton}>
            <Image source={require('../../../images/search.png')} style={homeStyles.searchIcon} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default HomeScreen;