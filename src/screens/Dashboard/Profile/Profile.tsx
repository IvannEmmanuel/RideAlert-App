import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { removeToken } from '../../../utils/authStorage';
import { useNavigation } from '@react-navigation/native';
import profileStyles from '../../../styles/profileStyles';

const Profile = () => {
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'Janith Comaling',
    gender: 'Female',
    address: 'Cagayan De Oro',
    phone: '09123456789',
    email: '09123456789@gmail.com',
  });

  const handleLogout = async () => {
    await removeToken();
    navigation.navigate('Login');
  };

  const handleInputChange = (key: string, value: string) => {
    setProfileData({ ...profileData, [key]: value });
  };

  return (
    <ScrollView style={profileStyles.container}>
      <View style={profileStyles.header}>
        <Text style={profileStyles.headerTitle}>User Profile</Text>
      </View>

      <View style={profileStyles.avatarWrapper}>
        <TouchableOpacity style={profileStyles.avatarContainer}>
          <Icon name="account-circle" size={100} color="#bbb" />
          <Text style={profileStyles.changePhotoText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>

      <View style={profileStyles.section}>
        <View style={profileStyles.sectionHeader}>
          <Text style={profileStyles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Icon
              name={editMode ? 'content-save' : 'pencil'}
              size={18}
              color="#007bff"
            />
          </TouchableOpacity>
        </View>

        {['name', 'gender', 'address'].map((field) => (
          <View style={profileStyles.infoGroup} key={field}>
            <Text style={profileStyles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Text>
            {editMode ? (
              <TextInput
                style={profileStyles.input}
                value={profileData[field as keyof typeof profileData]}
                onChangeText={(text) => handleInputChange(field, text)}
              />
            ) : (
              <Text style={profileStyles.value}>
                {profileData[field as keyof typeof profileData]}
              </Text>
            )}
          </View>
        ))}
      </View>

      <View style={profileStyles.section}>
        <View style={profileStyles.sectionHeader}>
          <Text style={profileStyles.sectionTitle}>Contact Information</Text>
        </View>

        {['phone', 'email'].map((field) => (
          <View style={profileStyles.infoGroup} key={field}>
            <Text style={profileStyles.label}>
              {field === 'phone' ? 'Mobile Number' : 'Email'}
            </Text>
            {editMode ? (
              <TextInput
                style={profileStyles.input}
                value={profileData[field as keyof typeof profileData]}
                onChangeText={(text) => handleInputChange(field, text)}
              />
            ) : (
              <Text style={profileStyles.value}>
                {profileData[field as keyof typeof profileData]}
              </Text>
            )}
          </View>
        ))}
      </View>

      <View style={profileStyles.accountSettingsContainer}>
        <Text style={profileStyles.accountSettings}>Account Settings</Text>

        <TouchableOpacity>
          <Text style={[profileStyles.accountAction, profileStyles.delete]}>
            Delete Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[profileStyles.accountAction, profileStyles.logout]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
