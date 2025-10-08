// // AppNavigator.tsx
// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

// // Tanan screens
// import InitialScreen from '../screens/Initial/InitialScreen';
// import LoginScreen from '../screens/Login/LoginScreen';
// import Home from '../screens/Dashboard/Home/Home'
// import Panel from '../screens/Dashboard/PanelScreen/Panel';
// import Register from '../screens/Register/RegisterScreen';
// import InitialSecondPhase from '../screens/Initial/InitialSecondPhase/InitialSecondPhase';
// import AvailableBus from '../screens/Dashboard/Bus/AvailableBus';
// import Profile from '../screens/Dashboard/Profile/Profile';

// export type RootStackParamList = {
//   Initial: undefined;
//   Login: undefined;
//   Home: undefined;
//   Panel: undefined;
//   Register: undefined;
//   InitialSecondPhase: undefined;
//   AvailableBus: undefined;
//   Profile: undefined
//   // You can add other screens here later, e.g. Home: undefined
// };

// //adb reverse tcp:8081 tcp:8081 to run it again

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator: React.FC = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Initial"
//         screenOptions={{headerShown: false}}>
//         <Stack.Screen name="Initial" component={InitialScreen} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Home" component={Home}/>
//         <Stack.Screen name="Panel" component={Panel} />
//         <Stack.Screen name="Register" component={Register} />
//         <Stack.Screen name="InitialSecondPhase" component={InitialSecondPhase} />
//         <Stack.Screen name="AvailableBus" component={AvailableBus}/>
//         <Stack.Screen name="Profile" component={Profile}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;


// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../context/AuthContext'; // Import AuthContext

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
  // Use AuthContext instead of local state
  const { isAuthenticated, isLoading } = useAuth();

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