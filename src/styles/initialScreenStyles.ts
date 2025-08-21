import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

const initialScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F7F6FB',
        justifyContent: 'space-around',
    },
    subContainer: {
        alignItems: 'center',
    },
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 70,
        color: '#0500FE',
        bottom: height * 0.01,
    },
    subText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 25,
        color: '#0065F8',
        bottom: height * 0.02,
    },
    buttonContainer: {
        flexDirection: 'row',
        top: height * 0.05,
        borderRadius: 50,
        alignItems: 'center',
        gap: width * 0.05,
    },
    textButton: {
        fontSize: 24,
        fontFamily: 'Montserrat-Regular',
        color: '#FFFFFF',
    },
    subTextButton: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        color: '#FFFFFF',
    },
    arrowIcon: {
        height: height * 0.015,
        width: width * 0.01
    }
})

export default initialScreenStyles;