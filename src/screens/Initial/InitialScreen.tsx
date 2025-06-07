// screens/Initial/InitialScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
      <Text style={appStyles.text}>RideAlert</Text>
      <TouchableOpacity
        onPress={handleGetStarted}
        style={appStyles.pressContainer}
      >
        <Text style={appStyles.pressText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InitialScreen;