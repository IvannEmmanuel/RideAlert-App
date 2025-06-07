// AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Tanan screens
import InitialScreen from '../screens/Initial/InitialScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import Home from '../screens/Dashboard/Home';

export type RootStackParamList = {
  Initial: undefined;
  Login: undefined;
  Home: undefined;
  // You can add other screens here later, e.g. Home: undefined
};

//adb reverse tcp:8081 tcp:8081 to run it again

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Initial"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Initial" component={InitialScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
