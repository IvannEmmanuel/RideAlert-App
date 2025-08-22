import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { loginStyles as styles } from "../../styles/loginStyles";
import { BASE_URL } from '../../config/apiConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { getApp } from "@react-native-firebase/app";
import { getMessaging } from "@react-native-firebase/messaging";

const LoginNew = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate("Register");
  }

  const saveFcmToken = async (token: string, jwt: string, userId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/users/fcm-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          fcm_token: token,
          user_id: userId,
        }),
      });

      if (response.ok) {
        console.log("✅ FCM token saved to backend");
      } else {
        console.error("❌ Failed to save FCM token:", await response.text());
      }
    } catch (err) {
      console.error("❌ Error saving FCM token:", err);
    }
  };

  const handleLogin = async () => {
    setErrorMessage(""); // reset old error first

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });

      const access_token = response.data.access_token;
      const user = response.data.user;

      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful, token:", access_token);
      console.log("User data:", user);

      // 🔥 Fetch and sync FCM token
      try {
        const messaging = getMessaging(getApp());
        const fcmToken = await messaging.getToken();
        console.log("FCM Token:", fcmToken);

        if (fcmToken) {
          await saveFcmToken(fcmToken, access_token, user.id);
        }
      } catch (err) {
        console.error("Error fetching/saving FCM token:", err);
      }

      navigation.navigate("Home"); //Panel
    } catch (error) {
      console.log("Login failed:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Wrong email or password.");
        } else {
          setErrorMessage(
            error.response.data.message || "Something went wrong. Please try again."
          );
        }
      } else {
        setErrorMessage("Unable to connect. Check your internet connection.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Log in</Text>
        <Text style={styles.subLoginText}>
          Access your account to enjoy a safe,
          hassle-free ride with Orotsco Bus.
        </Text>
        <TextInput
          placeholder="Email*"
          value={email}
          onChangeText={setEmail}
          style={styles.emailInput}
          placeholderTextColor="#888" // Set a visible color
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password*"
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#888" // Set a visible color
          />
          <TouchableOpacity
            style={styles.emojiContainer}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Image
              source={
                passwordVisible
                  ? require("../../images/eye-close.png")
                  : require("../../images/eye-open.png")
              }
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.continueContainer}
          onPress={handleLogin}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        <View style={styles.accountContainer}>
          <Text style={styles.dontText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.createText}>Create now.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginNew;