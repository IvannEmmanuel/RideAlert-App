import React, { useEffect, useState } from 'react';
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
  const { width, height } = Dimensions.get('window');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch token on mount
  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, []);

  // Request permission and get initial location
  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation(
          loc => {
            setLocation(loc);
            setLoading(false);
            if (token) {
              sendLocationToBackend(loc.latitude, loc.longitude, token);
            }
          },
          () => {
            setLoading(false);
          },
        );
      } else {
        setLoading(false);
      }
    })();
  }, [token]);

  // Watch for location changes with distanceFilter: 30
  useEffect(() => {
    if (!token) return;

    const watchId = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        sendLocationToBackend(latitude, longitude, token);
      },
      error => {
        console.error('Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 30,
        interval: 10000,
      },
    );

    // Cleanup on unmount
    return () => Geolocation.clearWatch(watchId);
  }, [token]);

  const FCMtoken = getFCMToken();
  console.log('FCM Token from Home:', FCMtoken);

  if (loading) return <HomeLoadingIndicator />;

  return (
    <>
      <View style={homeStyles.container}>
        {location ? (
          <MapView
            style={{ flex: 1, width: '100%' }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}>
            <Marker coordinate={location} title="You are here" />
          </MapView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Location not available</Text>
          </View>
        )}
        <View style={homeStyles.searchContainer}>
          <View style={homeStyles.outerContainer}>
            <View style={homeStyles.strokeMainContainer}>
              <View style={homeStyles.strokeContainer} />
            </View>
            <View style={homeStyles.innerContainer}>
              <TextInput
                style={homeStyles.input}
                placeholder="Search location"
                placeholderTextColor={'#888'}
                mode='outlined'
                theme={{ roundness: 5 }}
              />
              <TextInput
                style={homeStyles.input}
                placeholder="Search for destination"
                placeholderTextColor={'#888'}
                mode='outlined'
                theme={{ roundness: 5 }}
              />
            </View>
            <TouchableOpacity style={homeStyles.button}>
              <Text style={homeStyles.buttonText}>Find Nearby bus</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeScreen;
