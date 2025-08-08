import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {removeToken} from '../../../utils/authStorage';
import {useNavigation} from '@react-navigation/native';
import profileStyles from '../../../styles/profileStyles';
import {Image} from 'react-native';
import {getUser} from '../../../utils/authStorage';

const Profile = () => {
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fullName = user ? `${user.first_name} ${user.last_name}` : 'Loading...';

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser (userData);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await removeToken();
    navigation.navigate('Login');
  };

  const handleInputChange = (key: string, value: string) => {
    setProfileData({...profileData, [key]: value});
  };

  return (
    <ScrollView style={profileStyles.container}>
      <Image
        source={require('../../../../src/images/bus_image.png')}
        style={profileStyles.image}
        resizeMode="contain"
      />
      <View style={profileStyles.section}>
        <View style={profileStyles.sectionHeader}>
          <Text style={profileStyles.sectionTitle}>Personal Information</Text>
        </View>

        <View>
          <Text style={profileStyles.label}>{fullName}</Text>
          <Text style={profileStyles.label}>{user.gender}</Text>
        </View>
      </View>

      <View style={profileStyles.section}>
        <View style={profileStyles.sectionHeader}>
          <Text style={profileStyles.sectionTitle}>Contact Information</Text>
        </View>
        <Text style={profileStyles.label}>{user.email}</Text>
        <Text style={profileStyles.label}>{user.address || 'N/A'}</Text>
      </View>

      <View style={profileStyles.accountSettingsContainer}>
        <Text style={profileStyles.accountSettings}>Account Settings</Text>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[profileStyles.accountAction, profileStyles.logout]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={profileStyles.accountSettings}/>
      </View>
    </ScrollView>
  );
};

export default Profile;
