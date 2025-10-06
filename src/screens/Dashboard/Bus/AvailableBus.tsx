import { Image, Text, TouchableOpacity, View, Animated, Dimensions, AppState } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import availableBusStyle from '../../../styles/availableBus';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { getUser, getToken } from '../../../utils/authStorage';
import { BASE_URL } from '../../../config/apiConfig';
import { useBus } from '../../../context/BusContext';

const { height } = Dimensions.get('window');

const CACHE_KEY = 'cached_buses_data';
const POLL_INTERVAL = 15000;
const CACHE_DEBOUNCE = 2000;

const AvailableBus = () => {
  const { setSelectedBus, setBuses: setGlobalBuses, buses: globalBuses } = useBus();
  const navigation = useNavigation();
  const [isNotifyVisible, setIsNotifyVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [buses, setLocalBuses] = useState<any[]>([]);
  const slideAnim = useState(new Animated.Value(height))[0];
  const wsRef = useRef<WebSocket | null>(null);
  const [filter, setFilter] = useState<'All' | 'IGPIT' | 'BUGO'>('All');
  const appStateRef = useRef(AppState.currentState);
  const isMountedRef = useRef(true);
  const fleetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastCacheTimeRef = useRef<number>(0);

  const onPressBack = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const showNotification = useCallback((route: string) => {
    setSelectedRoute(route);
    setIsNotifyVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const hideNotification = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsNotifyVisible(false));
  }, [slideAnim]);

  const cacheBusesDataDebounced = useCallback(async (busesData: any[]) => {
    const now = Date.now();
    if (now - lastCacheTimeRef.current < CACHE_DEBOUNCE) return;
    
    lastCacheTimeRef.current = now;
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(busesData));
    } catch (error) {
      // Silently fail
    }
  }, []);

  const loadCachedBuses = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached && isMountedRef.current) {
        const busesData = JSON.parse(cached);
        setLocalBuses(busesData);
        setGlobalBuses(busesData);
        return busesData;
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  }, [setGlobalBuses]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const fetchBusesViaHTTP = useCallback(async () => {
    if (!fleetIdRef.current || !tokenRef.current || !isMountedRef.current) return null;

    try {
      const response = await fetch(`https://${BASE_URL}/api/vehicles/available/${fleetIdRef.current}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok && isMountedRef.current) {
        const data = await response.json();
        setLocalBuses(data);
        setGlobalBuses(data);
        cacheBusesDataDebounced(data);
        return data;
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  }, [setGlobalBuses, cacheBusesDataDebounced]);

  const startPolling = useCallback(() => {
    stopPolling();
    fetchBusesViaHTTP();
    
    pollingIntervalRef.current = setInterval(() => {
      if (isMountedRef.current && appStateRef.current === 'active') {
        fetchBusesViaHTTP();
      }
    }, POLL_INTERVAL);
  }, [stopPolling, fetchBusesViaHTTP]);

  const toggleNotify = useCallback(async (vehicleId: string, enable: boolean) => {
    try {
      const token = tokenRef.current || await getToken();
      if (!token) return false;

      const response = await fetch(`${BASE_URL}/users/toggle-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notify: enable,
          vehicle_id: vehicleId
        })
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Silently fail
    }
    return false;
  }, []);

  const initWebSocket = useCallback((fleetId: string) => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `${BASE_URL}/ws/vehicles/available/${fleetId}`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        stopPolling();
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        
        try {
          const data = JSON.parse(event.data);
          setLocalBuses(data);
          setGlobalBuses(data);
          cacheBusesDataDebounced(data);
        } catch (err) {
          // Silently fail
        }
      };

      ws.onerror = () => {
        // Silently fail
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (isMountedRef.current) {
          startPolling();
        }
      };

      wsRef.current = ws;
    } catch (error) {
      startPolling();
    }
  }, [stopPolling, startPolling, setGlobalBuses, cacheBusesDataDebounced]);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    stopPolling();
  }, [stopPolling]);

  // App state handler - only runs once
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        await loadCachedBuses();
        if (fleetIdRef.current) {
          initWebSocket(fleetIdRef.current);
        }
      } else if (nextAppState === 'background') {
        cleanup();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []); // Empty deps

  // Screen focus handler - stable
  useFocusEffect(
    useCallback(() => {
      loadCachedBuses();

      if (fleetIdRef.current && !wsRef.current) {
        initWebSocket(fleetIdRef.current);
      }

      return () => {
        // Keep connections alive
      };
    }, []) // Empty deps
  );

  // Initial setup - only runs once
  useEffect(() => {
    const initialize = async () => {
      const user = await getUser();
      const token = await getToken();
      const fleetId = user?.fleet_id;

      if (!fleetId) return;

      fleetIdRef.current = fleetId;
      tokenRef.current = token;

      await loadCachedBuses();
      initWebSocket(fleetId);
    };

    initialize();

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, []); // Empty deps

  // Sync with global context - only when it actually changes
  useEffect(() => {
    if (globalBuses && globalBuses.length > 0) {
      const hasChanged = JSON.stringify(buses) !== JSON.stringify(globalBuses);
      if (hasChanged) {
        setLocalBuses(globalBuses);
      }
    }
  }, [globalBuses]); // Only globalBuses as dep

  const filteredBuses = filter === 'All'
    ? buses
    : buses.filter(bus => bus.bound_for?.toUpperCase() === filter);

  const handleNotifyPress = useCallback(async (bus: any) => {
    if (!bus.location) {
      console.warn("This bus has no location yet.");
      return;
    }

    const success = await toggleNotify(bus.id, true);

    if (success) {
      setSelectedBus(bus);
      setGlobalBuses(prev => {
        const exists = prev.find(b => b.id === bus.id);
        if (exists) {
          return prev.map(b => (b.id === bus.id ? bus : b));
        }
        return [...prev, bus];
      });

      showNotification(bus.route);

      setTimeout(() => {
        hideNotification();
        navigation.navigate('Home');
      }, 2000);
    }
  }, [toggleNotify, setSelectedBus, setGlobalBuses, showNotification, hideNotification, navigation]);

  return (
    <>
      <View style={availableBusStyle.container}>
        <View style={availableBusStyle.topContainer}>
          <TouchableOpacity onPress={onPressBack}>
            <Image source={require('../../../images/back-arrow.png')} />
          </TouchableOpacity>
          <Text style={availableBusStyle.availableText}>Available Buses</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[
              availableBusStyle.filterContainer,
              filter === 'All' && availableBusStyle.activeFilterButton
            ]}
            onPress={() => setFilter('All')}
          >
            <Text
              style={[
                availableBusStyle.filterText,
                filter === 'All' && availableBusStyle.activeFilterText
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              availableBusStyle.filterContainer,
              filter === 'IGPIT' && availableBusStyle.activeFilterButton
            ]}
            onPress={() => setFilter('IGPIT')}
          >
            <Text
              style={[
                availableBusStyle.filterText,
                filter === 'IGPIT' && availableBusStyle.activeFilterText
              ]}
            >
              Igpit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              availableBusStyle.filterContainer,
              filter === 'BUGO' && availableBusStyle.activeFilterButton
            ]}
            onPress={() => setFilter('BUGO')}
          >
            <Text
              style={[
                availableBusStyle.filterText,
                filter === 'BUGO' && availableBusStyle.activeFilterText
              ]}
            >
              Bugo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={availableBusStyle.bussesRow}>
          {filteredBuses.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#666', fontSize: 16 }}>
                No buses available at the moment
              </Text>
            </View>
          ) : (
            filteredBuses.map((bus, index) => (
              <View key={bus.id || index} style={availableBusStyle.busRow}>
                <View style={availableBusStyle.busContainer}>
                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Route</Text>
                    <Text style={availableBusStyle.valueText}>{bus.route}</Text>
                  </View>

                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Bound For</Text>
                    <Text style={availableBusStyle.valueText}>{bus.bound_for || 'N/A'}</Text>
                  </View>

                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Status</Text>
                    <Text style={[
                      availableBusStyle.valueText,
                      availableBusStyle.statusColor
                    ]}>
                      {bus.status}
                    </Text>
                    <TouchableOpacity
                      style={availableBusStyle.notifyButton}
                      onPress={() => handleNotifyPress(bus)}
                    >
                      <Text style={availableBusStyle.notifyText}>Notify</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Available Seats</Text>
                    <Text style={availableBusStyle.valueText}>{bus.available_seats}</Text>
                  </View>
                  <View style={availableBusStyle.rowContainer}>
                    <Text style={availableBusStyle.labelText}>Plate</Text>
                    <Text style={availableBusStyle.valueText}>{bus.plate}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {isNotifyVisible && (
        <Animated.View
          style={[
            availableBusStyle.notifyContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity onPress={hideNotification}>
            <Image
              source={require('../../../images/close.png')}
              style={availableBusStyle.closePic}
            />
          </TouchableOpacity>
          <LottieView
            source={require('../../../images/Notify.json')}
            autoPlay
            loop
            style={availableBusStyle.lottieContainer}
          />
          <Text style={availableBusStyle.rideText}>Ride Alert Enabled!</Text>
          <View style={availableBusStyle.puvTextContainer}>
            <Text style={availableBusStyle.puvText}>You will be notified when a </Text>
            <Text style={availableBusStyle.puvTextBold}>{selectedRoute}</Text>
            <Text style={availableBusStyle.puvText}> bus is nearby!</Text>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default AvailableBus;