import {Text, View} from 'react-native';
import React from 'react';
import {getToken} from '../../utils/authStorage';
import {getFCMToken} from '../../utils/fcmStorage';
import homeStyles from '../../styles/homeStyles';

const Home = () => {
  const token = getToken();
  console.log('Token from Home:', token);

  const FCMtoken = getFCMToken();
  console.log('FCM Token from Home:', FCMtoken);

  return (
    <View style={homeStyles.container}>
      <Text>Home</Text>
    </View>
  );
};

export default Home;
