import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const registerStyles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
    },
    createText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 32,
    },
    signUpContainer: {
        width: height * 0.44,
        marginTop: height * 0.1,
        marginBottom: height * 0.05,
        justifyContent: "center",
    },
    signUpText: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        marginBottom: height * 0.04,
    },
    errorSnackbar: {
        backgroundColor: "#FF3B30",
        padding: 10,
        borderRadius: 6,
        marginBottom: 15,
    },
    errorSnackbarText: {
        color: "#FFF",
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        textAlign: "center",
    },
    firstNameInput: {
        borderRadius: 10,
        height: height * 0.07,
        paddingLeft: height * 0.02,
        borderColor: "#000",
        borderWidth: 1,
        marginBottom: height * 0.02,
        fontSize: 16,
    },
    lastNameInput: {
        borderRadius: 10,
        height: height * 0.07,
        paddingLeft: height * 0.02,
        borderColor: "#000",
        borderWidth: 1,
        marginBottom: height * 0.02,
        fontSize: 16,
    },
    addressInput: {
        borderRadius: 10,
        height: height * 0.07,
        paddingLeft: height * 0.02,
        borderColor: "#000",
        borderWidth: 1,
        marginBottom: height * 0.02,
        fontSize: 16,
    },
    emailInput: {
        borderRadius: 10,
        height: height * 0.07,
        paddingLeft: height * 0.02,
        borderColor: "#000",
        borderWidth: 1,
        marginBottom: height * 0.02,
        fontSize: 16,
    },
    passwordContainer: {
        width: "100%",
        position: "relative",
    },
    passwordInput: {
        height: height * 0.07,
        fontSize: 16,
        paddingLeft: height * 0.02,
        paddingRight: height * 0.08,
        borderRadius: 10,
        borderWidth: 1,
        width: "100%",
        color: "#000"
    },
    confirmPasswordInput: {
        height: height * 0.07,
        fontSize: 16,
        paddingLeft: height * 0.02,
        paddingRight: height * 0.08,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
        width: "100%",
        color: "#000"
    },
    inputError: {
        borderColor: "red",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        fontFamily: "Montserrat-Medium",
    },
    requirementsContainer: {
        backgroundColor: "#E6E6F8",
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        marginBottom: 8,
    },
    requirementsText: {
        fontSize: 14,
        fontFamily: "Montserrat-Medium",
        color: "#333",
        marginBottom: 5,
    },
    requirementItem: {
        fontSize: 13,
        fontFamily: "Montserrat-Regular",
        color: "#333",
        marginLeft: 10,
        marginTop: 2,
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
    conditionContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: height * 0.01,
    },
    checkbox: {
        width: 20,
        borderRadius: 2,
        height: 20,
        borderWidth: 2,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
    },
    checked: {
        backgroundColor: "#000",
    },
    checkmark: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
    text: {
        marginLeft: height * 0.02,
        fontSize: 13,
        color: "#000",
        fontFamily: "Montserrat-Regular",
    },
    continueContainer: {
        backgroundColor: "#111B56D4",
        borderRadius: 20,
        height: height * 0.07,
        justifyContent: "center",
        top: height * 0.01,
        marginBottom: height * 0.03,
    },
    continueText: {
        color: "#FFFFFF",
        fontSize: 18,
        textAlign: "center",
    },
    loginContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
    accountText: {
        fontSize: 16,
        fontFamily: "Montserrat-Medium",
    },
    textLogin: {
        fontSize: 16,
        fontFamily: "Montserrat-Bold",
        color: "#111B56",
    },
    orContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: height * 0.01,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#000",
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 16,
        color: "#000",
        fontFamily: "Montserrat-Medium",
    },
    socialLoginContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
    facebookLogo: {
        width: width * 0.1,
        height: height * 0.05,
    },
    facebookContainer: {
        marginRight: height * 0.02,
    },
    googleLogo: {
        width: width * 0.1,
        height: height * 0.05,
    },
    successModalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent for overlay effect
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Higher zIndex to ensure it’s on top
    },
    successModal: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: height * 0.03,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: width * 0.8,
        maxWidth: 400, // Limit max width for larger screens
    },
    successIcon: {
        width: 80,
        height: 80,
        marginBottom: height * 0.015,
    },
    successTitle: {
        fontFamily: "Montserrat-Bold",
        fontSize: 24,
        color: "#222",
        marginBottom: height * 0.01,
    },
    successMessage: {
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
        textAlign: "center",
        color: "#444",
    },
    closeContainer: {
        marginTop: height * 0.02,
        backgroundColor: "#FF3B30",
        width: height * 0.12,
        height: height * 0.04,
        borderRadius: 10,
        justifyContent: "center",
    },
    closeText: {
        color: "#FFF",
        fontFamily: "Montserrat-Medium",
        textAlign: "center",
    },
    gapSpace: {
        marginBottom: height * 0.02,
    },
    genderContainer: {
        marginTop: 15,
        marginBottom: 10,
    },
    genderTitle: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        marginBottom: 5,
    },
    genderOptions: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#111B56D4",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    radioCircleSelected: {
        borderColor: "#111B56D4",
    },
    radioDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: "#111B56D4",
    },
    radioLabel: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
    },
});

module.exports = { registerStyles };