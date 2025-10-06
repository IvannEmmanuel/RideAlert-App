import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import initialScreenStyles from "../../styles/initialScreenStyles";
import { BASE_URL } from "../../config/apiConfig";
import { refreshAccessToken } from "../../utils/authStorage";

const InitialScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const userData = await AsyncStorage.getItem("user");

      if (accessToken && userData) {
        try {
          // ✅ Try validating the current access token
          const res = await axios.get(`${BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (res.status === 200) {
            console.log("✅ Session restored (access token valid)");
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            return;
          }
        } catch (error) {
          // ❌ Token might be expired
          console.log("⚠️ Access token expired. Trying to refresh...");
          const newToken = await refreshAccessToken();

          if (newToken) {
            console.log("🔄 Access token refreshed. Redirecting...");
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            return;
          }
        }
      }

      // 🚪 If no tokens or refresh fails → go to Get Started screen
      setLoading(false);
    } catch (err) {
      console.error("❌ Error checking session:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const getStartedPress = () => {
    navigation.navigate("InitialSecondPhase");
  };

  if (loading) {
    return (
      <View style={[initialScreenStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ color: "#007AFF", marginTop: 10 }}>Checking session...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../images/puv.png")}
      style={initialScreenStyles.container}
      resizeMode="cover"
    >
      <View style={initialScreenStyles.subContainer}>
        <Text style={initialScreenStyles.mainText}>RideAlert</Text>
        <Text style={initialScreenStyles.subText}>Ride made easier.</Text>
      </View>
      <TouchableOpacity
        style={initialScreenStyles.buttonContainer}
        onPress={getStartedPress}
      >
        <Text style={initialScreenStyles.textButton}>Get Started</Text>
        <Image
          source={require("../../images/arrow-icon.png")}
          style={initialScreenStyles.arrowIcon}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default InitialScreen;
