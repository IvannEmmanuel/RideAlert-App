import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');

const appStyles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  text: {
    fontSize: height * 0.05,
    textAlign: "center",
    margin: 10,
    fontFamily: "Inter-Medium",
  },
  pressContainer: {
    backgroundColor: "#007AFF",
    top: height * 0.05,
    padding: 10,
    borderRadius: 5,
  },
  pressText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default appStyles;