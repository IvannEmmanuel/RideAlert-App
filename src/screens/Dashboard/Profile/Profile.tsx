import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { getMessaging } from "@react-native-firebase/messaging";
import { removeToken, getUser } from "../../../utils/authStorage";
import { api } from "../../../utils/api";
import { useBus } from "../../../context/BusContext";
import profileStyles from "../../../styles/profileStyles";

const { height } = Dimensions.get("window");

const Profile = () => {
  const navigation = useNavigation();
  const { resetBusData } = useBus();
  const [user, setUser] = useState<any>(null);

  const fullName = user ? `${user.first_name} ${user.last_name}` : "Loading...";

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleBack = () => {
    navigation.navigate("Home");
  };

  const handleLogout = async () => {
    try {
      const currentUser = await getUser();

      // Delete FCM token
      await getMessaging().deleteToken();

      // Notify backend
      await api.delete(`/users/fcm-token?user_id=${currentUser.id}`);

      // Remove local tokens
      await removeToken();

      // Reset context
      resetBusData();

      // Navigate back to login phase
      navigation.reset({
        index: 0,
        routes: [{ name: "InitialSecondPhase" }],
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={["#8785f1ff", "#D8D8DF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={profileStyles.container}
      >
        <TouchableOpacity onPress={handleBack} style={profileStyles.backButton}>
          <Image
            source={require("../../../images/back-arrow.png")}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={profileStyles.headerContent}>
          <View style={profileStyles.profileCircle}>
            <Text style={profileStyles.profileInitial}>
              {user?.first_name?.charAt(0)?.toUpperCase() || ""}
            </Text>
          </View>

          <View style={profileStyles.userInfo}>
            <Text style={profileStyles.fullNameText}>{fullName}</Text>
            <Text style={profileStyles.emailText}>{user?.email}</Text>
          </View>
        </View>

        <Text style={profileStyles.sectionTitle}>Personal Information</Text>
      </LinearGradient>

      {/* Info Section */}
      <View style={profileStyles.infoCard}>
        <View style={profileStyles.infoRow}>
          <Text style={profileStyles.infoLabel}>First Name</Text>
          <Text style={profileStyles.infoValue}>{user?.first_name || "—"}</Text>
        </View>
        <View style={profileStyles.infoRow}>
          <Text style={profileStyles.infoLabel}>Last Name</Text>
          <Text style={profileStyles.infoValue}>{user?.last_name || "—"}</Text>
        </View>
        <View style={profileStyles.infoRow}>
          <Text style={profileStyles.infoLabel}>Gender</Text>
          <Text style={profileStyles.infoValue}>{user?.gender || "—"}</Text>
        </View>
        <View style={profileStyles.infoRow}>
          <Text style={profileStyles.infoLabel}>City</Text>
          <Text style={profileStyles.infoValue}>{user?.address || "—"}</Text>
        </View>
        <View style={profileStyles.infoRow}>
          <Text style={profileStyles.infoLabel}>City</Text>
          <Text style={profileStyles.infoValue}>{user?.company_name || "—"}</Text>
        </View>
      </View>

      {/* Account Settings */}
      <View style={profileStyles.accountContainer}>
        <Text style={profileStyles.accountTitle}>Account Settings</Text>
        <TouchableOpacity
          style={profileStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={profileStyles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: height * 0.1 }} />
    </ScrollView>
  );
};

export default Profile;
