import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getToken } from '../../../utils/authStorage';
import { getFCMToken } from '../../../utils/fcmStorage';
import { requestLocationPermission, getCurrentLocation } from './useLocation';
import { sendLocationToBackend } from './sendLocation';
import HomeLoadingIndicator from '../../../components/LoadingIndicator';
import homeStyles from '../../../styles/homeStyles';

const HomeScreen = () => {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation(
          loc => {
            setLocation(loc);
            setLoading(false);
            if (token) sendLocationToBackend(loc.latitude, loc.longitude, token);
          },
          () => setLoading(false)
        );
      } else {
        setLoading(false);
      }
    })();
  }, [token]);

  const FCMtoken = getFCMToken();
  console.log('FCM Token from Home:', FCMtoken);

  if (loading) return <HomeLoadingIndicator />;

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={location} title="You are here" />
        </MapView>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Location not available</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
