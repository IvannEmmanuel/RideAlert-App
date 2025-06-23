import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import registerStyles from '../../styles/registerStyles';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/apiConfig';

const RegisterScreen = () => {
  const [checked, setChecked] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        console.log('Password and Confirm Password does not match');
        return;
      }

      const response = await axios.post(`${BASE_URL}/users/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        address,
        gender: checked,
      });

      console.log(response.data);
      console.log('Registered Successfully');
      navigation.navigate('Login');
    } catch (e) {
      console.log('Error', e);
    }
  };

  return (
    <View style={registerStyles.container}>
      <View style={registerStyles.topBanner} />
      <View style={registerStyles.card}>
        <Text style={registerStyles.title}>Create Account</Text>

        {/* First and Last Name Side-by-Side */}
        <View style={registerStyles.row}>
          <TextInput
            placeholder="First name"
            style={[registerStyles.halfInput, { fontFamily: 'Inter-Regular' }]}
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#8d99ae"
          />
          <TextInput
            placeholder="Last name"
            style={[registerStyles.halfInput, { fontFamily: 'Inter-Regular' }]}
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#8d99ae"
          />
        </View>

        {/* Email */}
        <TextInput
          placeholder="Email"
          style={registerStyles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#8d99ae"
        />

        {/* Password with Eye Icon */}
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Password"
            secureTextEntry={securePassword}
            style={registerStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#8d99ae"
          />
          <TouchableOpacity
            onPress={() => setSecurePassword(!securePassword)}
            style={{ position: 'absolute', right: 16, bottom: 22 }}
          >
            <Icon
              name={securePassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password with Eye Icon */}
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={secureConfirmPassword}
            style={registerStyles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#8d99ae"
          />
          <TouchableOpacity
            onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
            style={{ position: 'absolute', right: 16, bottom: 22 }}
          >
            <Icon
              name={secureConfirmPassword ? 'eye-off' : 'eye'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Address */}
        <TextInput
          placeholder="Address"
          style={registerStyles.input}
          autoCapitalize="none"
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#8d99ae"
        />

        {/* Gender Selection */}
        <View style={registerStyles.gender}>
          <Icon
            name="gender-male-female"
            size={20}
            color="#007AFF"
            style={registerStyles.genderIcon}
          />
          <RadioButton.Item
            color="#007AFF"
            position="leading"
            label="Male"
            value="Male"
            status={checked === 'Male' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('Male')}
            labelStyle={{
              fontFamily: 'Inter-Regular',
              fontSize: 15,
              color: '#1e1e1e',
            }}
            />
          <RadioButton.Item
            color="#007AFF"
            position="leading"
            label="Female"
            value="Female"
            status={checked === 'Female' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('Female')}
            labelStyle={{
              fontFamily: 'Inter-Regular',
              fontSize: 15,
              color: '#1e1e1e',
            }}
          />
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={registerStyles.registerButton}
          onPress={handleRegister}
        >
          <Text style={registerStyles.registerButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <Text style={registerStyles.orText}>OR</Text>

        {/* Back to Login */}
        <TouchableOpacity
          style={registerStyles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={registerStyles.backButtonText}>BACK TO LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
