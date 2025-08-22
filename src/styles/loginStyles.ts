import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const loginStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    alignItems: "center"
  },
  loginContainer: {
    top: height * 0.1,
    justifyContent: "center",
    width: height * 0.44,
  },
  loginText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 36,
  },
  subLoginText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    marginBottom: height * 0.05,
  },
  emailInput: {
    height: height * 0.07,
    fontSize: 16,
    paddingLeft: height * 0.02,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: height * 0.02,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    height: height * 0.07,
    fontSize: 16,
    paddingLeft: height * 0.02,
    paddingRight: height * 0.08,
    borderRadius: 10,
    borderWidth: 1,
    width: "100%",
    color: '#000'
  },
  emojiContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  eyeIcon: {
    width: 30,
    height: 20,
    tintColor: "#1E1E1E",
  },
  continueContainer: {
    backgroundColor: "#111B56D4",
    borderRadius: 20,
    height: height * 0.07,
    justifyContent: "center",
    top: height * 0.03,
    marginBottom: height * 0.05,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
  forgotContainer: {
    width: height * 0.25,
    alignSelf: "center",
  },
  forgotText: {
    fontSize: 15,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
  },
  accountContainer: {
    flexDirection: "row",
    top: height * 0.3,
    justifyContent: "center",
  },
  dontText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
  },
  createText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    color: "#111B56",
  },
  errorContainer: { 
    alignSelf: "center", top: 5 
  },
  errorText: { 
    color: "red", top: 5 
  }
});

module.exports = { loginStyles };