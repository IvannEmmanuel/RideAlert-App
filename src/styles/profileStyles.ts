import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const profileStyles = StyleSheet.create({
  container: {
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.06,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  backButton: {
    marginBottom: height * 0.02,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#464646ff",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInitial: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "Inter-Bold",
  },

  userInfo: {
    marginLeft: width * 0.05,
  },

  fullNameText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#000",
  },

  emailText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },

  sectionTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "#222",
    marginTop: height * 0.03,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    alignSelf: "center",
    borderRadius: 12,
    marginTop: height * 0.03,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  infoRow: {
    marginBottom: height * 0.015,
  },

  infoLabel: {
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    color: "#333",
  },

  infoValue: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },

  accountContainer: {
    marginTop: height * 0.04,
    paddingHorizontal: width * 0.05,
  },

  accountTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 17,
    color: "#000",
  },

  logoutButton: {
    backgroundColor: "#f34747ff",
    width: width * 0.9,
    height: height * 0.06,
    alignSelf: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: height * 0.02,
  },

  logoutText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
  },
});

export default profileStyles;
