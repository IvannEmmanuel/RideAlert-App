import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // 👈 import
import { removeToken, getUser } from '../../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import profileStyles from '../../../styles/profileStyles';
import { getMessaging } from '@react-native-firebase/messaging';
import { api } from '../../../utils/api';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);

  const handleBack = () => {
    navigation.navigate('Home')
  }

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Loading...';

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const currentUser = await getUser();

      // Optional: also delete the token from FCM so a new one is generated next login
      await getMessaging().deleteToken();

      // Tell backend to clear token
      await api.delete(`/users/fcm-token?user_id=${currentUser.id}`);

      // Remove local auth token
      await removeToken();

      // Navigate away
      navigation.navigate('InitialSecondPhase');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#8785f1ff', '#D8D8DF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={profileStyles.container}
      >
        <TouchableOpacity onPress={handleBack}>
          <Image source={require('../../../images/back-arrow.png')} />
        </TouchableOpacity>
        <View style={profileStyles.mainProfileContainer}>
          <View style={profileStyles.profileContainer}>
            <Text style={profileStyles.profileText}>
              {user?.first_name?.charAt(0)?.toUpperCase() || ''}
            </Text>
          </View>
          <View style={profileStyles.subTopHeader}>
            <Text style={profileStyles.fullNameText}>{fullName || 'N/A'}</Text>
            <Text style={profileStyles.emailText}>{user?.email}</Text>
          </View>
        </View>
        <View style={{ top: 60 }}>
          <Text style={profileStyles.personalText}>Personal Information</Text>
        </View>
      </LinearGradient>
      <View style={profileStyles.informationContainer}>
        <View style={profileStyles.subFirstInformationContainer}>
          <Text style={profileStyles.textLabel}>Name</Text>
          <Text style={profileStyles.textValue}>{user?.first_name}</Text>
        </View>
        <View style={profileStyles.subInformationContainer}>
          <Text style={profileStyles.textLabel}>Last Name</Text>
          <Text style={profileStyles.textValue}>{user?.last_name}</Text>
        </View>
        <View style={profileStyles.subInformationContainer}>
          <Text style={profileStyles.textLabel}>Gender</Text>
          <Text style={profileStyles.textValue}>{user?.gender}</Text>
        </View>
        <View style={profileStyles.subInformationContainer}>
          <Text style={profileStyles.textLabel}>City</Text>
          <Text style={profileStyles.textValue}>{user?.address}</Text>
        </View>
      </View>

      <View style={profileStyles.accountContainer}>
        <Text style={profileStyles.accountText}>Account Settings</Text>
        <TouchableOpacity style={profileStyles.logoutContainer} onPress={handleLogout}>
          <Text style={profileStyles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Profile;
