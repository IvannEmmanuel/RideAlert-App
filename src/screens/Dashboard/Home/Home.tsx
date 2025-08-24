import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { getToken, getUser } from '../../../utils/authStorage';
import { getFCMToken } from '../../../utils/fcmStorage';
import { requestLocationPermission, getCurrentLocation } from './useLocation';
import { sendLocationToBackend } from './sendLocation';
import { useNotifications } from '../../../hooks/useNotifications';
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
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const mapRef = useRef<MapView>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const notifications = useNotifications(user?.id);

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

  // // Fetch FCM token
  // useEffect(() => {
  //   const fetchFCM = async () => {
  //     const fcm = await getFCMToken();
  //     console.log('FCM Token from Home:', fcm);
  //   };
  //   setTimeout(fetchFCM, 2000);
  // }, []);

  // Request location permission and get initial location
  useEffect(() => {
    const initializeLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation(
          (loc) => {
            setLocation(loc);
            if (token) sendLocationToBackend(loc.latitude, loc.longitude, token);
          },
          () => console.error('Failed to get current location')
        );
      } else {
        console.warn('Location permission denied');
      }
    };
    if (token) initializeLocation();
  }, [token]);

  // Watch for location updates
  useEffect(() => {
    if (!token) return;

    const watchId = Geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        sendLocationToBackend(latitude, longitude, token);
      },
      (err) => console.error('Error watching position:', err),
      {
        enableHighAccuracy: true,
        distanceFilter: 30,
        interval: 10000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [token]);

  // Animate map to user location
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [location]);

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
          >
            {location && <Marker coordinate={location} title="You are here" />}
          </MapView>
        </View>

        <NotificationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          notifications={notifications}
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
