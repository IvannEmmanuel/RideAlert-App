// availableBus.js (styles)
import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get('window');

const availableBusStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFDFE',
        top: 20
    },
    topContainer: {
        flexDirection: 'row',
        left: 10,
        alignItems: 'center',
        gap: 80,
    },
    availableText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20
    },
    filterContainer: {
        backgroundColor: '#0500FE',
        width: 70,
        height: 24,
        left: 10,
        borderRadius: 20,
        top: 30,
        justifyContent: 'center',
        marginBottom: 50
    },
    filterText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#FFFFFF',
        textAlign: 'center'
    },
    busRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        gap: 10
    },
    busContainer: {
        backgroundColor: '#F7F6FB',
        width: '45%',
        height: 230,
        borderRadius: 10,
        alignItems: 'center'
    },
    orotscoPicture: {
        top: 10,
        width: 150,
        height: 81,
        borderRadius: 10
    },
    routeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 150,
        marginTop: 10
    },
    leftText: {
        fontFamily: 'Montserrat-Bold'
    },
    rightText: {
        fontFamily: 'Montserrat-Regular'
    },
    statusText: {
        fontFamily: 'Montserrat-Regular',
        color: '#00C950'
    },
    statusTextOther: {
        fontFamily: 'Montserrat-Regular',
        color: '#FF6900'
    },
    notifyContainer: {
        marginTop: 10,
        backgroundColor: '#1172FF',
        height: 26,
        width: '85%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifyText: {
        color: '#FFF',
        fontFamily: 'Inter-Regular'
    }
})

export default availableBusStyle;
