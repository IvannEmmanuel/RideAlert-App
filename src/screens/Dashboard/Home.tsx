import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import {getToken, removeToken} from '../../utils/authStorage';
import {getFCMToken} from '../../utils/fcmStorage';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const token = getToken();
  console.log('Token from Home:', token);

  const FCMtoken = getFCMToken();
  console.log('FCM Token from Home:', FCMtoken);

  const navigation = useNavigation();

  const handleRemoveToken = async () => {
    try {
      await removeToken();
      console.log('Token removed successfully');
      navigation.navigate('Login'); // Navigate to Login screen after removing token
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{bottom: 20}}>Home</Text>
      <Button title="Remove Token" onPress={handleRemoveToken} />
        <Text style={{marginTop: 20}}>Token: {token}</Text>
    </View>
  );
};

export default Home;
