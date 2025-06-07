import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNotification } from "./src/notifications/useNotification";
import appStyles from "./src/styles/appStyles";

const App:React.FC = () => {

  useNotification();

  return (
    <View style={appStyles.container}>
      <Text style={appStyles.text}>RideAlert</Text>
      <TouchableOpacity
        onPress={() => {
          console.log("Button Pressed");
        }}
        style={appStyles.pressContainer}
      >
        <Text style={appStyles.pressText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;