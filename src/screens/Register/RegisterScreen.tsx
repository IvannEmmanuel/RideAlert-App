import {View, Text, TextInput, Button} from 'react-native';
import React, {useState} from 'react';
import registerStyles from '../../styles/registerStyles';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import { BASE_URL } from '../../config/apiConfig';

//// dli ipasa sa backend password == confirm_password then only the password i pasa sa backend

const RegisterScreen = () => {
  const [checked, setChecked] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  console.log(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    address,
    checked,
  );

  const handleRegister = async () => {
    try {
      if (password != confirmPassword) {
        console.log('Password and Confirm Password does not match');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/users/register`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          address: address,
          gender: checked,
        },
      );

      console.log(response.data);
      console.log('Registered Successfully');
      navigation.navigate('Login');
    } catch (e) {
      console.log('Error', e);
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>RideAlert Registration Form</Text>
      <Text style={registerStyles.text}>First name</Text>
      <TextInput
        placeholder="First name"
        style={registerStyles.input}
        autoCapitalize="words"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text style={registerStyles.text}>Last name</Text>
      <TextInput
        placeholder="Last name"
        style={registerStyles.input}
        autoCapitalize="words"
        value={lastName}
        onChangeText={setLastName}
      />
      <Text style={registerStyles.text}>Email</Text>
      <TextInput
        placeholder="Email"
        style={registerStyles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={registerStyles.text}>Password</Text>
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={registerStyles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Text style={registerStyles.text}>Confirm Password</Text>
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={registerStyles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Text style={registerStyles.text}>Address</Text>
      <TextInput
        placeholder="Address"
        style={registerStyles.input}
        autoCapitalize="none"
        value={address}
        onChangeText={setAddress}
      />
      <Text style={registerStyles.text}>Gender</Text>
      <View style={registerStyles.gender}>
        <RadioButton.Item
          color="#007AFF"
          position="leading"
          label="Male"
          value="Male"
          status={checked === 'Male' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('Male')}
        />
        <RadioButton.Item
          color="#007AFF"
          position="leading"
          label="Female"
          value="Female"
          status={checked === 'Female' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('Female')}
        />
      </View>
      <Button
        title="Register"
        accessibilityLabel="Register"
        onPress={handleRegister}
      />
    </View>
  );
};

export default RegisterScreen;
