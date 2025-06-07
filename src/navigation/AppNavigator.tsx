// AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import InitialScreen from '../screens/Initial/InitialScreen';

export type RootStackParamList = {
  Initial: undefined;
  // You can add other screens here later, e.g. Home: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Initial"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Initial" component={InitialScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
