import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const registerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5AC2E6',
    },

    topBanner: {
        height: height * 0.25,
        backgroundColor: '#5AC2E6',
    },

    card: {
        flex: 1,
        backgroundColor: '#f7f7f7ff',
        marginHorizontal: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 30,
        marginTop: -80,
        zIndex: 1,
    },

    title: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        marginBottom: 20,
        color: '#000',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    label: {
        fontSize: 13,
        fontFamily: 'Inter-Regular',
        color: '#8d99ae',
        fontWeight: '500',
        marginBottom: 4,
        marginTop: 10,
    },

    halfInput: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 15,
        color: 'black',
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        color: 'black',
        marginVertical: 6,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
    },

    gender: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginVertical: 6,
    },

    genderIcon: {
        marginRight: 8,
    },

    registerButton: {
        backgroundColor: '#00BFFF',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 10,
    },

    registerButtonText: {
        color: '#fff',
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        fontSize: 15,
    },

    orText: {
        color: '#555',
        marginVertical: 10,
        fontSize: 15,
        textAlign: 'center',
    },

    backButton: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    backButtonText: {
        color: '#333',
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        fontSize: 15,
    },
});

export default registerStyles;
