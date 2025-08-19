import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getToken, getUser } from '../../../utils/authStorage';
import { getFCMToken } from '../../../utils/fcmStorage';
import { requestLocationPermission, getCurrentLocation } from './useLocation';
import { sendLocationToBackend } from './sendLocation';
import HomeLoadingIndicator from '../../../components/LoadingIndicator';
import Geolocation from '@react-native-community/geolocation';
import homeStyles from '../../../styles/homeStyles';
import { TextInput } from 'react-native-paper';

const HomeScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const mapRef = useRef<MapView>(null);
  const animation = useRef(new Animated.Value(0)).current;

  const DEFAULT_LATITUDE = 8.485255;
  const DEFAULT_LONGITUDE = 124.653642;
  const DEFAULT_REGION = {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const handleSearchPress = () => {
    if (!isSearchExpanded) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSearchExpanded(true);
    }
  };

  const handleCloseSearch = () => {
    if (isSearchExpanded) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setIsSearchExpanded(false);
    }
  };

  // Fetch token and user on mount
  useEffect(() => {
    const fetchData = async () => {
      const t = await getToken();
      const userData = await getUser();
      setToken(t);
      setUser(userData);
    };
    fetchData();
  }, []);

  // Request permission and get initial location
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
          getCurrentLocation(
            (loc) => {
              setLocation(loc);
              setLoading(false);
              if (token) {
                sendLocationToBackend(loc.latitude, loc.longitude, token);
              }
            },
            () => {
              console.error('Failed to get current location');
              setLoading(false);
            },
          );
        } else {
          console.warn('Location permission denied');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing location:', error);
        setLoading(false);
      }
    };
    initializeLocation();
  }, [token]);

  // Watch for location updates
  useEffect(() => {
    if (!token) return;

    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        sendLocationToBackend(latitude, longitude, token);
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 30,
        interval: 10000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, [token]);

  // Animate map to user when location changes
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  }, [location]);

  // Log FCM token (for debugging)
  useEffect(() => {
    const FCMtoken = getFCMToken();
    console.log('FCM Token from Home:', FCMtoken);
  }, []);

  const animatedStyle = {
    width: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [60, Dimensions.get('window').width],
    }),
    height: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [60, 210],
    }),
    borderTopLeftRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 48],
    }),
    borderTopRightRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 48],
    }),
    borderBottomLeftRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    }),
    borderBottomRightRadius: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    }),
    backgroundColor: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#0500FE', '#F7F6FB'],
    }),
    bottom: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    }),
    left: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    }),
  };

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
            <TouchableOpacity>
              <Image source={require('../../../images/notification.png')} style={homeStyles.notification} />
            </TouchableOpacity>
            <TouchableOpacity>
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
        >
          {location && (
            <Marker
              coordinate={location}
              title="You are here"
            />
          )}
        </MapView>
      </View>
      <TouchableOpacity
        onPress={handleSearchPress}
        disabled={isSearchExpanded}  // disable if already expanded
      >
        <Animated.View style={[homeStyles.searchContainer, animatedStyle]}>
          {!isSearchExpanded ? (
            <Image source={require('../../../images/search.png')} />
          ) : (
            <>
              <View style={homeStyles.subSearchContainer}>
                {/* stroke is now touchable to collapse */}
                <TouchableOpacity onPress={handleCloseSearch}>
                  <View style={homeStyles.stroke} />
                </TouchableOpacity>

                <Text style={homeStyles.rideText}>Looking for a ride?</Text>
              </View>

              <TouchableOpacity style={homeStyles.subMainSearchContainer}>
                <View style={homeStyles.subOfMainSearchContainer}>
                  <Image source={require('../../../images/search.png')} />
                  <Text style={homeStyles.searchText}>Search Buses</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>

    </View>
  );
};

export default HomeScreen;