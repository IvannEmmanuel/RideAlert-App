import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

const availableBusStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F6FB',
        top: 20,
    },
    topContainer: {
        flexDirection: 'row',
        left: 10,
        alignItems: 'center',
        gap: 80,
    },
    availableText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
    },
    filterContainer: {
        backgroundColor: '#0500FE',
        width: 70,
        height: 24,
        left: 10,
        borderRadius: 20,
        top: 30,
        justifyContent: 'center',
        marginBottom: 50,
    },
    filterText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    bussesRow: {
        flexDirection: 'column',
        gap: 10
    },
    busRow: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingHorizontal: 10,
        gap: 10,
    },
    busContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#FEFEFE',
        width: '95%',
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 10
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    labelText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        width: 120,
    },
    valueText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        flex: 1
    },
    notifyButton: {
        right: 10,
        backgroundColor: '#1172FF',
        justifyContent: 'center',
        alignItems: 'center',
        width: 87,
        height: 26,
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
        width: '100%',
        height: 513,
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
        top: 20,
        left: 150,
        width: 15,
        height: 15
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
        paddingHorizontal: 20,
        marginBottom: 30,
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