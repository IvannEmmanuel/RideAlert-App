// screens/Initial/InitialScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNotification } from "../../../src/notifications/useNotification";
import appStyles from "../../../src/styles/appStyles";
import { useNavigation } from "@react-navigation/native";


const InitialScreen: React.FC = () => {
      useNotification();

  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={appStyles.container}>
      <View style={appStyles.card}>
        <Image
          source={require("../../../src/images/bus_image.png")}
          style={appStyles.image}
          resizeMode="contain"
        />
        <Text style={appStyles.text}>Ride Alert</Text>
        <TouchableOpacity
          onPress={handleGetStarted}
          style={appStyles.pressContainer}
        >
          <Text style={appStyles.pressText}>Get Started</Text>
          <Text style={appStyles.arrow}>></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InitialScreen;
