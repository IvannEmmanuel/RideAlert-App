import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { removeToken } from '../../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import profileStyles from '../../../styles/profileStyles';
import { Image } from 'react-native';
import { getUser } from '../../../utils/authStorage';

const Profile = () => {
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Loading...';

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    navigation.navigate('InitialSecondPhase');
  };

  return (
    <View style={profileStyles.header}>
      <View style={profileStyles.container} />
      <View style={profileStyles.profileContainer}>
        <Text style={profileStyles.profileText}>
          {user?.first_name?.charAt(0)?.toUpperCase() || ''}
        </Text>
      </View>
      <View style={profileStyles.informationContainer}>
        <Text style={profileStyles.mainInformationText}>Personal Information</Text>
        <View style={profileStyles.stroke} />
        <View style={profileStyles.subInformationContainer}>
          <Text style={profileStyles.subInformationText}>Name</Text>
          <Text style={profileStyles.valueInformationText}>{user ? fullName || 'N/A' : ''}</Text>
          <Text style={profileStyles.subInformationText}>Gender</Text>
          <Text style={profileStyles.valueInformationText}>{user ? user.gender || 'N/A' : ''}</Text>
          <Text style={profileStyles.subInformationText}>Address</Text>
          <Text style={profileStyles.valueInformationText}>{user ? user.address || 'N/A' : ''}</Text>
        </View>
        <Text style={profileStyles.mainInformationText}>Contact Information</Text>
        <View style={profileStyles.stroke} />
        <View style={profileStyles.subInformationContainer}>
          <Text style={profileStyles.subInformationText}>Email</Text>
          <Text style={profileStyles.valueInformationText}>{user ? user.email || 'N/A' : ''}</Text>
        </View>
        <Text style={profileStyles.mainInformationText}>Account Settings</Text>
        <View style={profileStyles.stroke} />
      </View>
      <TouchableOpacity style={profileStyles.logoutButton} onPress={handleLogout}>
        <Text style={profileStyles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View >
  );
};

export default Profile;
