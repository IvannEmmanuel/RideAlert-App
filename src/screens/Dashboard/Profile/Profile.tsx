import {StyleSheet, View, Button} from 'react-native';
import React from 'react';
import {removeToken} from '../../../utils/authStorage';
import {useNavigation} from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await removeToken();
    console.log('User logged out');
    navigation.navigate('Login'); // Navigate to Login screen after logout
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Logout" onPress={handleLogout} color="#FF0000" />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
