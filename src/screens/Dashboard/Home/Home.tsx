import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getToken } from '../../../utils/authStorage';
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
  const mapRef = useRef<MapView>(null);

  const DEFAULT_LATITUDE = 8.485255;
  const DEFAULT_LONGITUDE = 124.653642;
  const DEFAULT_REGION = {
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      const t = await getToken();
      setToken(t);
    };
    fetchToken();
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
        1000, // 1 second animation
      );
    }
  }, [location]);

  // Log FCM token (for debugging)
  useEffect(() => {
    const FCMtoken = getFCMToken();
    console.log('FCM Token from Home:', FCMtoken);
  }, []);

  return (
    <View style={homeStyles.container}>
      <MapView
        ref={mapRef}
        style={{ flex: 1, width: '100%' }}
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
      <View style={homeStyles.searchContainer}>
        <View style={homeStyles.outerContainer}>
          <View style={homeStyles.strokeMainContainer}>
            <View style={homeStyles.strokeContainer} />
          </View>
          <View style={homeStyles.innerContainer}>
            <TextInput
              style={homeStyles.input}
              placeholder="Search location"
              placeholderTextColor="#888"
              mode="outlined"
              theme={{ roundness: 5 }}
            />
            <TextInput
              style={homeStyles.input}
              placeholder="Search for destination"
              placeholderTextColor="#888"
              mode="outlined"
              theme={{ roundness: 5 }}
            />
          </View>
          <TouchableOpacity style={homeStyles.button}>
            <Text style={homeStyles.buttonText}>Find Nearby bus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;