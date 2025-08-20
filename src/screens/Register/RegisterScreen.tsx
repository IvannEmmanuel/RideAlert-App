import { BASE_URL } from '../../config/apiConfig';
import { registerStyles as styles } from "../../styles/registerStyles";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const Register = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const loginPress = () => {
    console.log("Navigating to Login screen");
    navigation.navigate("Login");
  };

  const register = async (firstName, lastName, email, password, address, gender) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        address,
        gender,
      });
      console.log("API Response:", response.status, response.data);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred.";
      console.error("Registration API error:", message);
      throw new Error(message);
    }
  };

  useEffect(() => {
    if (password || confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
      if (password) {
        const isValid = validatePassword(password);
        setPasswordValid(isValid);
        setShowPasswordRequirements(!isValid);
      }
    }
  }, [password, confirmPassword]);

  const handleContinue = async () => {
    setErrorMessage("");
    setShowError(false);

    if (!firstName || !lastName || !email || !password || !confirmPassword || !address || !isChecked) {
      setErrorMessage("Please fill out all required fields");
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowError(true);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password does not meet requirements");
      setShowError(true);
      return;
    }

    if (!isChecked) {
      setErrorMessage("Please accept the terms and conditions");
      setShowError(true);
      return;
    }

    if (!gender) {
      setErrorMessage("Please select a gender");
      setShowError(true);
      return;
    }

    try {
      const response = await register(firstName, lastName, email, password, address, gender);
      if (response.status >= 200 && response.status < 300) {
        console.log("Registration successful, showing success modal");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      Alert.alert(
        "Registration Error",
        error.message || "An unexpected error occurred. Please try again.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") },
          { text: "Go to Login", onPress: () => loginPress() },
        ]
      );
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  useEffect(() => {
    if (showSuccessModal) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );
      return () => backHandler.remove();
    }
  }, [showSuccessModal]);

  const validatePassword = (pass) => {
    let criteria = 0;
    if (pass.length >= 6) {
      if (/[A-Z]/.test(pass)) criteria++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) criteria++;
      if (/[0-9]/.test(pass)) criteria++;
      return criteria >= 3;
    }
    return false;
  };

  const RadioButton = ({ label, value, selected, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.radioButtonContainer}
        onPress={() => onPress(value)}
      >
        <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ScrollView for form content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.signUpContainer}>
              <Text style={styles.createText}>Create an account</Text>
              <Text style={styles.signUpText}>
                Book your ride with Orotsco Bus! Create your account to securely reserve your seat.
              </Text>

              {showError && (
                <View style={styles.errorSnackbar}>
                  <Text style={styles.errorSnackbarText}>{errorMessage}</Text>
                </View>
              )}

              <TextInput
                placeholder="First Name*"
                style={styles.firstNameInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#888" // Set a visible color
              />
              <TextInput
                placeholder="Last Name*"
                style={styles.lastNameInput}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#888" // Set a visible color
              />
              <TextInput
                placeholder="Address*"
                style={styles.addressInput}
                value={address}
                onChangeText={setAddress}
                autoCapitalize="none"
                placeholderTextColor="#888" // Set a visible color
              />
              <TextInput
                placeholder="Email*"
                style={styles.emailInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888" // Set a visible color
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password*"
                  style={[
                    styles.passwordInput,
                    !passwordValid && password.length > 0 && styles.inputError,
                  ]}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setShowPasswordRequirements(true)}
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

              {showPasswordRequirements && (
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsText}>
                    A six character password is required with at least 3 of the following:
                  </Text>
                  <Text style={styles.requirementItem}>1 upper-case character</Text>
                  <Text style={styles.requirementItem}>1 special character (e.g !@#*_)</Text>
                  <Text style={styles.requirementItem}>1 number</Text>
                </View>
              )}

              <View style={styles.gapSpace} />
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password*"
                  style={[
                    styles.confirmPasswordInput,
                    !passwordsMatch && confirmPassword.length > 0 && styles.inputError,
                  ]}
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#888" // Set a visible color
                />
                <TouchableOpacity
                  style={styles.emojiContainer}
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  <Image
                    source={
                      confirmPasswordVisible
                        ? require("../../images/eye-close.png")
                        : require("../../images/eye-open.png")
                    }
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              {!passwordsMatch && confirmPassword.length > 0 && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
              <View style={styles.genderContainer}>
                <Text style={styles.genderTitle}>Gender*</Text>
                <View style={styles.genderOptions}>
                  <RadioButton
                    label="Male"
                    value="Male"
                    selected={gender === "Male"}
                    onPress={setGender}
                  />
                  <RadioButton
                    label="Female"
                    value="Female"
                    selected={gender === "Female"}
                    onPress={setGender}
                  />
                </View>
              </View>
              <View style={styles.conditionContainer}>
                <Pressable
                  style={[styles.checkbox, isChecked && styles.checked]}
                  onPress={() => setIsChecked(!isChecked)}
                >
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
                <Text style={styles.text}>
                  By continuing, you agree to the terms & conditions and acknowledge the privacy policy.
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.continueContainer}
                  onPress={handleContinue}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.loginContainer}>
                <Text style={styles.accountText}>Already have an account? </Text>
                <TouchableOpacity onPress={loginPress}>
                  <Text style={styles.textLogin}>Log in</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.socialLoginContainer}>
                <TouchableOpacity style={styles.facebookContainer}>
                  <Image
                    source={require("../../images/facebook.png")}
                    style={styles.facebookLogo}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={require("../../images/google.png")}
                    style={styles.googleLogo}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Success modal outside ScrollView */}
      {showSuccessModal && (
        <View style={styles.successModalOverlay}>
          <View style={styles.successModal}>
            <Image
              source={require("../../images/success.png")}
              style={styles.successIcon}
            />
            <Text style={styles.successTitle}>SUCCESS</Text>
            <Text style={styles.successMessage}>
              You have successfully created an account.
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log("Closing success modal and navigating to Login");
                setShowSuccessModal(false);
                loginPress();
              }}
              style={styles.closeContainer}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Register;