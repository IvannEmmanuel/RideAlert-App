import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

const availableBusStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F6FB',
        top: height * 0.05,
    },
    topContainer: {
        flexDirection: 'row',
        left: width * 0.02,
        alignItems: 'center',
        gap: width * 0.2,
    },
    availableText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
    },
    filterContainer: {
        backgroundColor: '#0500FE',
        width: width * 0.2,
        height: height * 0.024,
        left: width * 0.02,
        borderRadius: 20,
        top: height * 0.03,
        justifyContent: 'center',
        marginBottom: height * 0.05,
    },
    filterText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    bussesRow: {
        flexDirection: 'column',
        gap: width * 0.01
    },
    busRow: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    busContainer: {
        paddingHorizontal: width * 0.01,
        paddingVertical: height * 0.02,
        backgroundColor: '#FEFEFE',
        width: width * 0.95,
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.005,
    },
    labelText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        width: width * 0.320,
        left: width * 0.02
    },
    valueText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        flex: 1
    },
    notifyButton: {
        right: width * 0.02,
        backgroundColor: '#1172FF',
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.2,
        height: height * 0.026,
        borderRadius: 6
    },
    notifyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#FFFFFF',
    },
    statusColor: {
        color: '#00C950',
        fontFamily: 'Montserrat-Bold'
    },
    notifyContainer: {
        bottom: 0,
        width: width * 1,
        height: 500,
        backgroundColor: '#F7F6FB',
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    lottieContainer: {
        width: width * 1,
        height: height * 0.3
    },
    closePic: {
        top: height * 0.02,
        left: width * 0.380,
        width: width * 0.03,
        height: height * 0.03
    },
    rideText: {
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        fontSize: 36
    },
    puvTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.03,
        marginBottom: height * 0.04,
    },
    puvText: {
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    },
    puvTextBold: {
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    },
});

export default availableBusStyle;