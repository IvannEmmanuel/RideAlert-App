import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, Animated, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getToken, getUser } from '../../../utils/authStorage';
import { getFCMToken } from '../../../utils/fcmStorage';
import { requestLocationPermission, getCurrentLocation } from './useLocation';
import { sendLocationToBackend } from './sendLocation';
import Geolocation from '@react-native-community/geolocation';
import homeStyles from '../../../styles/homeStyles';
import { useNavigation } from '@react-navigation/native';
import Modal from "react-native-modal";

const { height, width } = Dimensions.get('window');

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
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const DEFAULT_LATITUDE = 8.485255;
  const DEFAULT_LONGITUDE = 124.653642;
  const DEFAULT_REGION = {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const notifications = [
    { id: "1", message: "RideAlert - Your Bugo-Igpit bus is already 100 meters nearby you.", createdAt: new Date(Date.now() - 5 * 60000) }, // 5  mins ago
    { id: "2", message: "RideAlert - Your Bugo-Igpit bus is already 100 meters nearby you.", createdAt: new Date(Date.now() - 2 * 60000) }, // 2 mins ago
    { id: "3", message: "RideAlert - Your Bugo-Igpit bus is already 100 meters nearby you.", createdAt: new Date(Date.now() - 10 * 60000) }, // 10 mins ago
  ];

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    }

    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    }

    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (diffInSeconds < 31536000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };



  const isNewNotification = (createdAt) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(createdAt)) / 60000);
    return diffInMinutes >= 1 && diffInMinutes <= 5;
  };

  const handleNotificationPress = () => {
    setModalVisible(true);
  }

  const handleSetting = () => {
    navigation.navigate('Profile')
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const handleSearchBus = () => {
    navigation.navigate('AvailableBus');
  }

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

              <TouchableOpacity style={homeStyles.subMainSearchContainer} onPress={handleSearchBus}>
                <View style={homeStyles.subOfMainSearchContainer}>
                  <Image source={require('../../../images/search.png')} />
                  <Text style={homeStyles.searchText}>Search Buses</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        coverScreen={false}
        backdropOpacity={0}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setModalVisible(false)}
        style={{ marginTop: height * 0.1, justifyContent: "flex-start" }}
      >
        <View style={homeStyles.modalContent}>
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              borderBottomColor: "#D8D8DF",
              borderBottomWidth: 1,
              paddingBottom: 8,
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            Notifications
          </Text>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={homeStyles.notificationItem}>
                <Text style={{ fontFamily: "Montserrat-Regular" }}>
                  {item.message}
                </Text>

                {isNewNotification(item.createdAt) && (
                  <View style={{
                    backgroundColor: "#FFEB15",
                    width: 21,
                    height: 14,
                    borderRadius: 4,
                    padding: height * 0.002,
                    flexDirection: 'row',
                  }}>
                    <View style={{ flexDirection: 'row', width: width * 1 }}>
                      <Text style={{ fontSize: 8, fontWeight: "Montserrat-Medium" }}>NEW</Text>
                      <Text style={{ fontSize: 8, fontFamily: "Montserrat-Regular", left: 5 }}>
                        {getTimeAgo(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </Modal >
    </View >
  );
};

export default HomeScreen;