import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import initialScreenStyles from "../../styles/initialScreenStyles";
import { BASE_URL } from "../../config/apiConfig";
import { refreshAccessToken } from "../../utils/authStorage";
import LottieView from "lottie-react-native";

const { height, width } = Dimensions.get('window');

const InitialScreen = () => {
  const navigation = useNavigation();
  
  const getStartedPress = () => {
    navigation.navigate("InitialSecondPhase");
  };

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
