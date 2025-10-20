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

import type React from "react"
import { useState, useEffect, useRef, useCallback, cache } from "react"
import { View, Text, TouchableOpacity, Image, Animated, AppState, BackHandler, AppStateStatus } from "react-native"
import MapView, { Marker, Polyline, Callout } from "react-native-maps"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getToken, getUser, refreshAccessToken } from "../../../utils/authStorage"
import { NotificationModal } from "../../../components/NotificationModal"
import homeStyles from "../../../styles/homeStyles"
import DEFAULT_REGION from "./default_region"
import { useLocation } from "../../../context/LocationContext"
import { getAnimatedStyle } from "./animateStyle/animatedStyle"
import getGreeting from "./utils/greeting"
import getRouteCoordinates from "./utils/getRouteCoordinates"
import { useBus } from "../../../context/BusContext"
import { WS_BASE_URL } from "../../../config/apiConfig"
import { sendLocationToBackend } from "./sendLocation"
import BusCallout from "../../../components/BusCallout"
import axios from "axios"
import { BASE_URL } from "../../../config/apiConfig"
import { isTokenExpired } from "../../../context/AuthContext"

const CACHE_KEY = "cached_buses_data"
const SELECTED_BUS_KEY = "selected_bus_data"
const LOCATION_LOCK_KEY = "location_send_lock"
const LOCATION_MUTEX_KEY = "location_send_mutex"
const ETA_DATA_KEY = "cached_eta_data"
const POLL_INTERVAL = 15000
const CACHE_DEBOUNCE_MS = 2000
const RECONNECT_BASE_MS = 1000
const RECONNECT_MAX_MS = 30000
const LOCATION_SEND_INTERVAL = 7000
const MUTEX_TIMEOUT = 3000
const ETA_POLL_INTERVAL = 5000 // Poll ETA every 10 seconds

const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}

// Global mutex implementation for location sending
// Improved mutex implementation
class LocationSendMutex {
  private static instance: LocationSendMutex;
  private isLocked = false;
  private pendingRelease: NodeJS.Timeout | null = null;

  static getInstance(): LocationSendMutex {
    if (!LocationSendMutex.instance) {
      LocationSendMutex.instance = new LocationSendMutex();
    }
    return LocationSendMutex.instance;
  }

  async acquireLock(timeoutMs: number = MUTEX_TIMEOUT): Promise<boolean> {
    if (this.isLocked) return false;

    this.isLocked = true;

    // Auto-release after timeout to prevent deadlocks
    this.pendingRelease = setTimeout(() => {
      this.isLocked = false;
      this.pendingRelease = null;
    }, timeoutMs);

    return true;
  }

  async releaseLock(): Promise<void> {
    if (this.pendingRelease) {
      clearTimeout(this.pendingRelease);
      this.pendingRelease = null;
    }
    this.isLocked = false;
  }

  isAcquired(): boolean {
    return this.isLocked;
  }
}

const HomeScreen: React.FC = () => {
  const [markerKey, setMarkerKey] = useState(0)
  const navigation = useNavigation()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  // NEW: ETA State
  const [etaData, setEtaData] = useState<any>(null)
  const [loadingEta, setLoadingEta] = useState(false)

  const mapRef = useRef<MapView | null>(null)
  const animation = useRef(new Animated.Value(0)).current
  const markerRef = useRef(null)

  const { location } = useLocation()
  const {
    buses,
    setBuses,
    selectedBus,
    setSelectedBus,
    currentBusLocation,
    setCurrentBusLocation,
    routeCoordinates,
    setRouteCoordinates,
  } = useBus()

  const debouncedLocation = useDebounce(location, 3000)

  const isMountedRef = useRef(true)
  const wsRef = useRef<any>(null)
  const vehicleWsRef = useRef<any>(null)
  const pollingRef = useRef<any>(null)
  const etaPollingRef = useRef<any>(null) // NEW: ETA polling ref
  const reconnectAttemptRef = useRef(0)
  const reconnectTimeoutRef = useRef<any>(null)
  const vehicleReconnectAttemptRef = useRef(0)
  const vehicleReconnectTimeoutRef = useRef<any>(null)
  const lastCacheTimeRef = useRef(0)
  const appStateRef = useRef(AppState.currentState)
  const tokenRef = useRef<string | null>(null)
  const userRef = useRef<any>(null)
  const selectedBusRef = useRef<any>(null)
  const locationRef = useRef<any>(null) // NEW: Location ref
  const locationSendMutex = useRef(LocationSendMutex.getInstance())
  const lastBusesStateRef = useRef<string>("")  // Track last sent state
  const lastSelectedBusStateRef = useRef<string>("")  // Track last selected bus state

  const compareAndUpdateBuses = useCallback((newBuses: any[]) => {
    if (!newBuses || !isMountedRef.current) return

    // Convert to JSON for comparison
    const newState = JSON.stringify(newBuses)

    // Only update if state actually changed
    if (lastBusesStateRef.current === newState) {
      console.log("ℹ️ Bus list unchanged, skipping update")
      return
    }

    lastBusesStateRef.current = newState

    console.log("🔄 Bus list changed, updating state")
    setBuses(newBuses)
    cacheBusesDebounced(newBuses)
  }, [setBuses, cacheBusesDebounced])

  const compareAndUpdateSelectedBus = useCallback((newSelectedBus: any) => {
    if (!isMountedRef.current) return

    const newState = JSON.stringify(newSelectedBus)

    if (lastSelectedBusStateRef.current === newState) {
      console.log("ℹ️ Selected bus unchanged")
      return
    }

    lastSelectedBusStateRef.current = newState

    console.log("🔄 Selected bus changed, updating")
    setSelectedBus(newSelectedBus)
    cacheSelectedBus(newSelectedBus)
  }, [setSelectedBus, cacheSelectedBus])

  useEffect(() => {
    const backAction = () => true
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => backHandler.remove()
  }, [])

  // ---- CACHE helpers ----
  const cacheBusesDebounced = useCallback(async (data: any[]) => {
    const now = Date.now()
    if (now - lastCacheTimeRef.current < CACHE_DEBOUNCE_MS) return
    lastCacheTimeRef.current = now
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Cache save error:", e)
    }
  }, [])

  const cacheEtaData = useCallback(async (data: any) => {
    try {
      if (!data) {
        await AsyncStorage.removeItem(ETA_DATA_KEY)
      } else {
        await AsyncStorage.setItem(ETA_DATA_KEY, JSON.stringify(data))
      }
    } catch (e) {
      console.error("Cache ETA data error:", e)
    }
  }, [])

  const cacheSelectedBus = useCallback(async (bus: any) => {
    try {
      if (!bus) {
        await AsyncStorage.removeItem(SELECTED_BUS_KEY)
      } else {
        await AsyncStorage.setItem(SELECTED_BUS_KEY, JSON.stringify(bus))
      }
    } catch (e) {
      console.error("Cache selected bus error:", e)
    }
  }, [])

  const loadCachedBuses = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY)
      if (raw && isMountedRef.current) {
        const parsed = JSON.parse(raw)
        setBuses(parsed)
        return parsed
      }
    } catch (e) {
      console.error("Load cached buses error:", e)
    }
    return null
  }, [setBuses])

  const loadCachedSelectedBus = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(SELECTED_BUS_KEY)
      if (raw && isMountedRef.current) {
        const parsed = JSON.parse(raw)
        setSelectedBus(parsed)
        if (parsed?.location) setCurrentBusLocation(parsed.location)
        selectedBusRef.current = parsed
        return parsed
      }
    } catch (e) {
      console.error("Load cached selected bus error:", e)
    }
    return null
  }, [setSelectedBus, setCurrentBusLocation])

  const loadCachedEtaData = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(ETA_DATA_KEY)
      if (raw && isMountedRef.current) {
        const parsed = JSON.parse(raw)
        // Check if it matches the current selected bus
        if (selectedBusRef.current && parsed.vehicle_id === selectedBusRef.current.id) {
          setEtaData(parsed)
          return parsed
        }
      }
    } catch (e) {
      console.error("Load cached ETA data error:", e)
    }
    return null
  }, [])

  useEffect(() => {
    selectedBusRef.current = selectedBus
  }, [selectedBus])



  useEffect(() => {
    locationRef.current = location
  }, [location])

  // ---- persistent user/token load ----
  const fetchUserData = useCallback(async () => {
    try {
      const [t, u] = await Promise.all([getToken(), getUser()])
      if (!isMountedRef.current) return { token: null, user: null }
      setToken(t)
      setUser(u)
      tokenRef.current = t
      userRef.current = u
      return { token: t, user: u }
    } catch (e) {
      console.error("Fetch user data error:", e)
      return { token: null, user: null }
    }
  }, [])

  // ---- polling control ----
  const startPolling = useCallback((fleetId?: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    pollingRef.current = setInterval(() => {
      if (!isMountedRef.current) return
    }, POLL_INTERVAL)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  // ---- websocket with exponential backoff reconnect ----
  const cleanWs = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.onclose = null
        wsRef.current.close()
      } catch (e) {
        console.error("Clean WS error:", e)
      }
      wsRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    reconnectAttemptRef.current = 0
  }, [])

  // ---- vehicle/device-specific websocket helpers ----
  const cleanVehicleWs = useCallback(() => {
    if (vehicleWsRef.current) {
      try {
        vehicleWsRef.current.onclose = null
        vehicleWsRef.current.close()
      } catch (e) {
        console.error("Clean vehicle WS error:", e)
      }
      vehicleWsRef.current = null
    }
    if (vehicleReconnectTimeoutRef.current) {
      clearTimeout(vehicleReconnectTimeoutRef.current)
      vehicleReconnectTimeoutRef.current = null
    }
    vehicleReconnectAttemptRef.current = 0
  }, [])

  const scheduleVehicleReconnect = useCallback((vehicleId?: string, deviceId?: string) => {
    vehicleReconnectAttemptRef.current = (vehicleReconnectAttemptRef.current || 0) + 1
    const attempt = vehicleReconnectAttemptRef.current
    const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, attempt), RECONNECT_MAX_MS)
    if (vehicleReconnectTimeoutRef.current) clearTimeout(vehicleReconnectTimeoutRef.current)
    vehicleReconnectTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return
      initVehicleWebSocket(vehicleId, deviceId)
    }, delay)
  }, [])

  const initVehicleWebSocket = useCallback((vehicleId?: string, deviceId?: string) => {
    // pick one endpoint: prefer vehicle-level subscription if vehicleId known
    const vid = vehicleId || selectedBusRef.current?.id
    const did = deviceId || selectedBusRef.current?.device_id
    const endpoint = vid ? `${WS_BASE_URL}/ws/vehicle/${vid}/location` : did ? `${WS_BASE_URL}/ws/device/${did}/location` : null
    if (!endpoint) return

    // close existing
    if (vehicleWsRef.current) {
      try {
        vehicleWsRef.current.onclose = null
        vehicleWsRef.current.close()
      } catch (e) {
        console.error("Close existing vehicle WS error:", e)
      }
      vehicleWsRef.current = null
    }

    try {
      const ws = new WebSocket(endpoint)

      ws.onopen = () => {
        console.log("Vehicle WS connected", endpoint)
        vehicleReconnectAttemptRef.current = 0
      }

      ws.onmessage = (evt: any) => {
        if (!isMountedRef.current) return
        try {
          const raw = JSON.parse(evt.data)
          const msg = raw || {}

          // support both { type: 'location_update', latitude, longitude } and simple payloads
          const lat = msg.latitude ?? msg.location?.latitude
          const lng = msg.longitude ?? msg.location?.longitude
          const vId = msg.vehicle_id ?? msg.vehicleId ?? vid
          const dId = msg.device_id ?? msg.deviceId ?? did

          if (lat != null && lng != null) {
            const loc = { latitude: Number(lat), longitude: Number(lng) }
            // update current bus location
            setCurrentBusLocation(loc)

            // also update buses array so other UI stays consistent
            setBuses((prev: any[]) => {
              if (!prev || prev.length === 0) return prev
              return prev.map((b) => {
                if (b.id === vId || b.device_id === dId) {
                  return { ...b, location: loc }
                }
                return b
              })
            })
          }
        } catch (e) {
          console.error("Vehicle WS message parse error:", e)
        }
      }

      ws.onclose = () => {
        console.log("Vehicle WS closed")
        vehicleWsRef.current = null
        if (!isMountedRef.current) return
        // schedule reconnect
        scheduleVehicleReconnect(vid, did)
      }

      ws.onerror = (err: any) => {
        console.error("Vehicle WS error:", err)
        try {
          ws.close()
        } catch (e) {
          console.error("Close on vehicle WS error failed:", e)
        }
      }

      vehicleWsRef.current = ws
    } catch (e) {
      console.error("Init vehicle WS error:", e)
      scheduleVehicleReconnect(vid, did)
    }
  }, [setCurrentBusLocation, setBuses])

  // Start vehicle-specific WS when a bus is selected
  useEffect(() => {
    if (!selectedBus) return
    const vid = selectedBus?.id
    const did = selectedBus?.device_id
    initVehicleWebSocket(vid, did)

    return () => {
      // keep vehicle WS active only while this bus is selected
      cleanVehicleWs()
    }
  }, [selectedBus, initVehicleWebSocket, cleanVehicleWs])

  const scheduleReconnect = useCallback((fleetId?: string) => {
    reconnectAttemptRef.current = (reconnectAttemptRef.current || 0) + 1
    const attempt = reconnectAttemptRef.current
    const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, attempt), RECONNECT_MAX_MS)
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
    reconnectTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return
      initWebSocket(fleetId)
    }, delay)
  }, [])

  const initWebSocket = useCallback(
    (fleetId?: string) => {
      const fid = fleetId || userRef.current?.fleet_id || selectedBusRef.current?.fleet_id
      if (!fid) return

      if (wsRef.current) {
        try {
          wsRef.current.onclose = null
          wsRef.current.close()
        } catch (e) {
          console.error("Close existing WS error:", e)
        }
        wsRef.current = null
      }
      stopPolling()

      const wsUrl = `${WS_BASE_URL}/ws/vehicles/available/${fid}`

      try {
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          console.log("WebSocket connected")
          reconnectAttemptRef.current = 0
        }

        ws.onmessage = (evt: any) => {
          if (!isMountedRef.current) return
          try {
            const rawData = JSON.parse(evt.data)
            const payload = rawData.vehicles || rawData

            // Use comparison function instead of direct update
            compareAndUpdateBuses(payload)
          } catch (e) {
            console.error("WebSocket message parse error:", e)
          }
        }

        ws.onclose = () => {
          console.log("WebSocket closed")
          wsRef.current = null
          if (!isMountedRef.current) return
          startPolling(fid)
          scheduleReconnect(fid)
        }

        ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          try {
            ws.close()
          } catch (e) {
            console.error("Close on error failed:", e)
          }
        }

        wsRef.current = ws
      } catch (e) {
        console.error("WebSocket init error:", e)
        startPolling(fid)
        scheduleReconnect(fid)
      }
    },
    [stopPolling, startPolling, cacheBusesDebounced, scheduleReconnect, setBuses],
  )

  const fetchEtaData = useCallback(async () => {
    const currentSelectedBus = selectedBusRef.current
    const currentLocation = locationRef.current
    const currentToken = tokenRef.current

    if (!currentSelectedBus || !currentLocation || !currentToken) {
      return
    }

    // Check if token is expired BEFORE making the request
    if (isTokenExpired(currentToken)) {
      console.log("🔄 Token expired locally, refreshing before ETA request...")
      const refreshed = await refreshAccessToken()
      if (!refreshed) {
        console.warn("❌ Token refresh failed")
        return
      }
      // Get updated token after refresh
      const newToken = await getToken()
      tokenRef.current = newToken
    }

    try {
      setLoadingEta(true)
      const response = await axios.post(
        `${BASE_URL}/vehicles/calculate-eta`,
        {
          vehicle_id: currentSelectedBus.id,
          user_location: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            "Content-Type": "application/json",
          },
          timeout: 8000,
        },
      )

      if (isMountedRef.current) {
        setEtaData(response.data)
        cacheEtaData(response.data)
        console.log("✅ ETA updated:", response.data.eta_formatted)
      }
    } catch (error) {
      const e: any = error
      console.error("❌ Error fetching ETA:", e?.response?.data || e?.message)
      if (isMountedRef.current && !etaData) {
        setEtaData(null)
        cacheEtaData(null)
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingEta(false)
      }
    }
  }, [cacheEtaData, isTokenExpired, refreshAccessToken])

  // ---- NEW: ETA POLLING CONTROL ----
  const startEtaPolling = useCallback(() => {
    if (etaPollingRef.current) {
      clearInterval(etaPollingRef.current)
      etaPollingRef.current = null
    }

    if (!selectedBusRef.current || !locationRef.current) {
      console.log("⏸️ ETA polling not started - missing bus or location")
      return
    }

    console.log("▶️ Starting ETA real-time polling (every 10s)")

    // Fetch immediately
    fetchEtaData()

    // Then poll every 10 seconds
    etaPollingRef.current = setInterval(() => {
      if (!isMountedRef.current) return
      if (!selectedBusRef.current || !locationRef.current) {
        stopEtaPolling()
        return
      }
      fetchEtaData()
    }, ETA_POLL_INTERVAL)
  }, [fetchEtaData])

  const stopEtaPolling = useCallback(() => {
    if (etaPollingRef.current) {
      console.log("⏹️ Stopping ETA polling")
      clearInterval(etaPollingRef.current)
      etaPollingRef.current = null
    }
  }, [])

  // ---- cleanup on unmount ----
  useEffect(() => {
    console.log('🏠 HomeScreen mounted');
    return () => {
      console.log('🏠 HomeScreen unmounted');
      isMountedRef.current = false;
      cleanWs();
      cleanVehicleWs();
      stopPolling();
      stopEtaPolling();
    };
  }, []);

  // ---- startup initialization ----
  useEffect(() => {
    const initialize = async () => {
      await loadCachedBuses()
      const cachedSelected = await loadCachedSelectedBus()
      await loadCachedEtaData()
      const { token: t, user: u } = await fetchUserData()

      const fleetIdToUse = u?.fleet_id || cachedSelected?.fleet_id
      if (fleetIdToUse) {
        initWebSocket(fleetIdToUse)
      }
    }

    initialize()
  }, [])

  // ---- AppState handler ----
  useEffect(() => {
    const onChange = async (next: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if (prev.match(/inactive|background/) && next === "active") {
        console.log('📱 App became active - initializing...');
        await initializeApp();
      } else if (next === "background") {
        console.log('📱 App backgrounded - cleaning up...');
        cleanupApp();
      }
    };

    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, []);

  const initializeApp = useCallback(async () => {
    await loadCachedBuses();
    await loadCachedSelectedBus();
    await loadCachedEtaData();
    await fetchUserData();

    const fleetId = userRef.current?.fleet_id || selectedBusRef.current?.fleet_id;
    if (fleetId && !wsRef.current) {
      initWebSocket(fleetId);
    }

    if (selectedBusRef.current) {
      initVehicleWebSocket(selectedBusRef.current.id, selectedBusRef.current.device_id);
    }

    if (selectedBusRef.current && locationRef.current) {
      startEtaPolling();
    }
  }, [/* include all dependencies */]);

  const cleanupApp = useCallback(() => {
    cleanWs();
    cleanVehicleWs();
    stopPolling();
    stopEtaPolling();
  }, [cleanWs, cleanVehicleWs, stopPolling, stopEtaPolling]);

  // ---- focus handler ----
  useFocusEffect(
    useCallback(() => {
      if (!wsRef.current) {
        const fleetId = userRef.current?.fleet_id || selectedBusRef.current?.fleet_id
        if (fleetId) initWebSocket(fleetId)
        else startPolling()
      }
      if (selectedBusRef.current && locationRef.current && !etaPollingRef.current) {
        console.log("🔄 Restarting ETA polling on focus")
        startEtaPolling()
      }
      return () => { }
    }, [initWebSocket, startPolling]),
  )

  // ---- update currentBusLocation from buses ----
  useEffect(() => {
    if (!selectedBus || !buses?.length) return

    const updatedBus = buses.find((b) => b.id === selectedBus.id)
    if (!updatedBus) return

    // Use comparison function
    compareAndUpdateSelectedBus(updatedBus)

    // Handle both status_detail and status_details
    const prevStatusDetail = selectedBus.status_detail || selectedBus.status_details
    const updatedStatusDetail = updatedBus.status_detail || updatedBus.status_details

    // Check if any important properties changed
    const hasChanges =
      updatedBus.status !== selectedBus.status ||
      updatedStatusDetail !== prevStatusDetail ||
      updatedBus.bound_for !== selectedBus.bound_for ||
      updatedBus.route !== selectedBus.route ||
      updatedBus.available_seats !== selectedBus.available_seats

    // Update marker position
    if (updatedBus.location) {
      setCurrentBusLocation(updatedBus.location)
    }

    // Log changes for debugging
    if (hasChanges) {
      console.log("🔄 Bus data changed:", {
        status: `${selectedBus.status} -> ${updatedBus.status}`,
        status_detail: `${prevStatusDetail} -> ${updatedStatusDetail}`,
        bound_for: `${selectedBus.bound_for} -> ${updatedBus.bound_for}`,
        available_seats: `${selectedBus.available_seats} -> ${updatedBus.available_seats}`,
      })

      // Force marker remount to update callout
      setMarkerKey((prev) => prev + 1)
    }
  }, [buses, compareAndUpdateSelectedBus])

  useEffect(() => {
    if (selectedBus && location) {
      console.log('🚀 Starting ETA polling - selected bus and location available');
      startEtaPolling();
    } else {
      console.log('⏹️ Stopping ETA polling - no selected bus or location');
      stopEtaPolling();
      setEtaData(null);
      cacheEtaData(null);
    }

    return () => {
      stopEtaPolling();
    };
  }, [!!selectedBus, !!location]); // Simpler dependencies

  // Cache buses whenever they update
  useEffect(() => {
    if (buses && buses.length > 0) cacheBusesDebounced(buses)
  }, [buses, cacheBusesDebounced])

  // Cache selectedBus changes
  useEffect(() => {
    cacheSelectedBus(selectedBus)
  }, [selectedBus, cacheSelectedBus])

  // ---- OPTIMIZED LOCATION SENDING with Mutex ----
  const sendLocationWithMutex = useCallback(async (lat: number, lng: number, tkn: string) => {
    // Quick check if already locked
    if (locationSendMutex.current.isAcquired()) {
      console.log('🔒 Location send already in progress, skipping');
      return;
    }

    try {
      // Check timestamp first
      const lockData = await AsyncStorage.getItem(LOCATION_LOCK_KEY);
      const now = Date.now();

      if (lockData) {
        const lastSentTime = Number.parseInt(lockData, 10);
        if (now - lastSentTime < LOCATION_SEND_INTERVAL) {
          console.log('⏰ Location sent too recently, skipping');
          return;
        }
      }

      // Acquire mutex
      const acquired = await locationSendMutex.current.acquireLock();
      if (!acquired) {
        console.log('🔒 Could not acquire location mutex, skipping');
        return;
      }

      try {
        // Double-check after acquiring lock
        const lockDataAfter = await AsyncStorage.getItem(LOCATION_LOCK_KEY);
        if (lockDataAfter) {
          const lastSentTimeAfter = Number.parseInt(lockDataAfter, 10);
          if (now - lastSentTimeAfter < LOCATION_SEND_INTERVAL) {
            return;
          }
        }

        console.log('📍 Sending location to backend...');
        await AsyncStorage.setItem(LOCATION_LOCK_KEY, now.toString());
        await sendLocationToBackend(lat, lng, tkn);
        console.log('✅ Location sent successfully');

      } finally {
        await locationSendMutex.current.releaseLock();
      }
    } catch (error) {
      console.error('❌ Send location error:', error);
      await locationSendMutex.current.releaseLock();
    }
  }, []);

  // Replace your current location sending useEffect with this:
  useEffect(() => {
    if (!debouncedLocation || !tokenRef.current) return;

    // Additional guard to prevent sending when no real location change
    const shouldSendLocation = debouncedLocation.latitude && debouncedLocation.longitude;

    if (shouldSendLocation) {
      console.log('🔄 Attempting to send location...');
      sendLocationWithMutex(debouncedLocation.latitude, debouncedLocation.longitude, tokenRef.current);
    }
  }, [debouncedLocation?.latitude, debouncedLocation?.longitude, sendLocationWithMutex]);

  // Route calculation debounce
  useEffect(() => {
    if (!currentBusLocation || !location) {
      setRouteCoordinates([])
      return
    }
    const t = setTimeout(async () => {
      const coords = await getRouteCoordinates(location, currentBusLocation)
      if (isMountedRef.current) setRouteCoordinates(coords)
    }, 500)
    return () => clearTimeout(t)
  }, [
    currentBusLocation?.latitude,
    currentBusLocation?.longitude,
    location?.latitude,
    location?.longitude,
    setRouteCoordinates,
  ])

  // UI handlers
  const handleSearchPress = useCallback(() => {
    Animated.timing(animation, { toValue: 1, duration: 300, useNativeDriver: false }).start()
    setIsSearchExpanded(true)
  }, [animation])

  const handleCloseSearch = useCallback(() => {
    Animated.timing(animation, { toValue: 0, duration: 300, useNativeDriver: false }).start()
    setIsSearchExpanded(false)
  }, [animation])

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.topContainer}>
        <View style={homeStyles.subTopContainer}>
          <View style={homeStyles.profileContainer}>
            <Text style={homeStyles.profileText}>{user?.first_name?.charAt(0)?.toUpperCase() || "U"}</Text>
          </View>
          <View style={homeStyles.informationContainer}>
            <Text style={homeStyles.goodmorningText}>{getGreeting()}</Text>
            <Text style={homeStyles.userText}>{user?.first_name || "User"}</Text>
          </View>
          <View style={homeStyles.settingContainer}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={require("../../../images/notification.png")} style={homeStyles.notification} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image source={require("../../../images/settings.png")} style={homeStyles.settings} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* NEW: ETA Display (Outside Map, Above Callout) */}
      {selectedBus && etaData && (
        <View style={homeStyles.etaFloatingContainer}>
          <View style={homeStyles.etaCard}>
            <Text style={homeStyles.etaTitle}>Bus {etaData.vehicle_route}</Text>
            <View style={homeStyles.etaRow}>
              <Text style={homeStyles.etaLabel}>Distance:</Text>
              <Text style={homeStyles.etaValue}>{((etaData.distance_km ?? 0).toFixed(2))} km</Text>
            </View>
            <View style={homeStyles.etaRow}>
              <Text style={homeStyles.etaLabel}>ETA:</Text>
              <Text style={[homeStyles.etaValue, homeStyles.etaHighlight]}>{etaData.eta_formatted}</Text>
            </View>
            {etaData.current_speed_kmh > 0 && (
              <View style={homeStyles.etaRow}>
                <Text style={homeStyles.etaLabel}>Speed:</Text>
                <Text style={homeStyles.etaSpeed}>{((etaData.current_speed_kmh ?? 0).toFixed(1))} km/h</Text>
              </View>
            )}
            {etaData.is_stopped && (
              <View style={homeStyles.stoppedBanner}>
                <Text style={homeStyles.stoppedText}>Temporarily Stopped</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={homeStyles.mapContainer}>
        <MapView
          ref={(r) => {
            mapRef.current = r
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
              image={require("../../../assets/user.png")}
            />
          )}

          {selectedBus && currentBusLocation && (
            <Marker
              ref={markerRef}
              key={`bus-${selectedBus.id}-${markerKey}`} // Add markerKey to force remount
              coordinate={currentBusLocation}
              image={require("../../../assets/bus.png")}
            >
              <Callout tooltip>
                <BusCallout selectedBus={selectedBus} />
              </Callout>
            </Marker>
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
              onPress={() => navigation.navigate("AvailableBus")}
            >
              <View style={homeStyles.subOfMainSearchContainer}>
                <Image source={require("../../../images/search.png")} />
                <Text style={homeStyles.searchText}>Search Buses</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleSearchPress} style={homeStyles.collapsedSearchButton}>
            <Image source={require("../../../images/search.png")} style={homeStyles.searchIcon} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  )
}

export default HomeScreen