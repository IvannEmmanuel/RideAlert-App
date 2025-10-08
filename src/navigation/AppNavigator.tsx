// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { getToken, getRefreshToken, refreshAccessToken } from '../utils/authStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// All screens
import InitialScreen from '../screens/Initial/InitialScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import Home from '../screens/Dashboard/Home/Home';
import Panel from '../screens/Dashboard/PanelScreen/Panel';
import Register from '../screens/Register/RegisterScreen';
import InitialSecondPhase from '../screens/Initial/InitialSecondPhase/InitialSecondPhase';
import AvailableBus from '../screens/Dashboard/Bus/AvailableBus';
import Profile from '../screens/Dashboard/Profile/Profile';

const { height, width } = Dimensions.get('window');

export type RootStackParamList = {
  Initial: undefined;
  Login: undefined;
  Home: undefined;
  Panel: undefined;
  Register: undefined;
  InitialSecondPhase: undefined;
  AvailableBus: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthState = async () => {
    try {
      const accessToken = await getToken();
      const refreshToken = await getRefreshToken();
      const userData = await AsyncStorage.getItem('user');

      console.log('🔐 Auth Check:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        hasUserData: !!userData 
      });

      if (accessToken && refreshToken && userData) {
        setIsAuthenticated(true);
        console.log('✅ User is authenticated with valid tokens');
      } else {
        // Clear any partial auth data
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        setIsAuthenticated(false);
        console.log('❌ User is not authenticated - missing tokens');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      // On error, assume not authenticated and clear tokens
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  // Show your custom loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#fff' }}>
        <Image 
          source={require('../assets/Logo.png')} 
          style={{ 
            width: width * 0.8, 
            height: height * 0.3, 
            borderRadius: 20, 
            top: height * 0.3 
          }} 
        />
        <LottieView
          source={require('../images/Loading.json')}
          autoPlay
          loop
          style={{ 
            width: width * 0.7, 
            height: height * 0.7
          }}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? "Home" : "Initial"}
      >
        {isAuthenticated ? (
          // Authenticated screens - user is logged in
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Panel" component={Panel} />
            <Stack.Screen name="AvailableBus" component={AvailableBus} />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        ) : (
          // Unauthenticated screens - user needs to log in
          <>
            <Stack.Screen name="Initial" component={InitialScreen} />
            <Stack.Screen name="InitialSecondPhase" component={InitialSecondPhase} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;