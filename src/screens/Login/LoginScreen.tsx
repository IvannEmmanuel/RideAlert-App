import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import loginStyles from '../../styles/loginStyles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/apiConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });

        const access_token = response.data.access_token;
        await AsyncStorage.setItem('access_token', access_token);
        console.log('Login successful, token:', access_token);

      navigation.navigate('Panel');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <View style={loginStyles.topBanner} />
      <View style={loginStyles.card}>
        <Text style={loginStyles.title}>Login Account</Text>

        <View style={loginStyles.inputWrapper}>
          <Icon name="user" size={18} color="#777" style={loginStyles.icon} />
          <TextInput
            placeholder="Username or Email"
            style={loginStyles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#777"
          />
        </View>

        <View style={loginStyles.inputWrapper}>
          <Icon name="lock" size={18} color="#777" style={loginStyles.icon} />
          <TextInput
            placeholder="Password"
            style={loginStyles.input}
            placeholderTextColor="#777"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'}
              size={18}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={loginStyles.forgot}>
          <Text style={loginStyles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={loginStyles.loginButton} onPress={handleLogin}>
          <Text style={loginStyles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <Text style={loginStyles.orText}>OR</Text>

        <TouchableOpacity
          style={loginStyles.createButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={loginStyles.createText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
