import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

const initialSecondPhaseStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: "#F7F6FB"
    },
    lottieContainer: {
        width: width * 1,
        height: height * 0.3
    },
    taglineContainer: {
        paddingHorizontal: width * 0.05,
        zIndex: 1,
    },
    taglineText: {
        fontSize: 20,
        fontFamily: 'Inter-Regular',
        textAlign: 'left'
    },
    taglineTextTwo: {
        fontSize: 30,
        fontFamily: 'Inter-Bold',
        textAlign: 'left'
    },
    accountContainer: {
        bottom: height * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAccountButton: {
        backgroundColor: '#0500FE',
        width: width * 0.9,
        height: height * 0.06,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.02,
    },
    createAccountText: {
        fontSize: 22,
        fontFamily: 'Inter-Regular',
        fontWeight: 400,
        color: '#FFFFFF',
    },
    loginAccountButton: {
        backgroundColor: '#D9D9D9',
        width: width * 0.9,
        height: height * 0.06,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginAccountText: {
        fontSize: 22,
        fontFamily: 'Inter-Regular',
        fontWeight: 400,
        color: '#000000',
    }
})

export default initialSecondPhaseStyles;