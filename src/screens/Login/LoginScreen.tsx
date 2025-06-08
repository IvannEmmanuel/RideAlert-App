import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import loginStyles from '../../styles/loginStyles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [saveToken, setSaveToken] = React.useState(null);

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.3:8000/users/login', {
        email,
        password,
      });

      const access_token = response.data.access_token;
      setSaveToken(access_token);

      // Save token to AsyncStorage to persist it
      await AsyncStorage.setItem('access_token', access_token);

      console.log('Login successful, token:', access_token);

      navigation.navigate('Panel');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.text}>Login your credentials</Text>

      <TextInput
        placeholder="Email"
        style={loginStyles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={loginStyles.input}
        value={password}
        onChangeText={setPassword}
      />

      <View style={loginStyles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#007AFF" />

        <Button
          title="Register"
          accessibilityLabel="Register"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
