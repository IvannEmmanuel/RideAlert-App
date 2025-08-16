import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5AC2E6',
    },
    topBanner: {
        height: 180,
        backgroundColor: '#5AC2E6',
        //borderBottomLeftRadius: 30,
        //borderBottomRightRadius: 30,
    },
    card: {
        flex: 1,
        backgroundColor: '#f7f7f7ff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 30,  // internal spacing inside the card
        paddingVertical: 40,
        marginTop: -30,
        zIndex: 1,
        },

    title: {
        fontSize: 26,
        fontFamily: 'Inter-Bold',
        marginBottom: 50,
        color: '#000',
        },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        fontFamily: 'Inter-Regular',
        flex: 1,
        color: '#000',
    },
    forgot: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    forgotText: {
        fontFamily: 'Inter-Regular',
        color: '#dc143c',
        fontSize: 12,
    },
    loginButton: {
        backgroundColor: '#00BFFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    loginText: {
        fontFamily: 'Inter-Bold',
        color: '#fff',
        fontSize: 16,
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        color: '#555',
    },
    createButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    createText: {
        color: '#333',
        fontFamily: 'Inter-Bold',
    },
});