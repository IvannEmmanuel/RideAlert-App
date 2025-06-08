import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const registerStyles = StyleSheet.create({
    container: {
        marginTop: height * 0.03,
        padding: width * 0.05,
    },
    input: {
        height: height * 0.05,
        borderColor: 'gray',
        borderWidth: 1,
        margin: height * 0.01,
        paddingLeft: height * 0.01,
        color: 'black',
        borderRadius: 5,
        fontFamily: 'Inter-Regular'
    },
    title: {
        fontSize: height * 0.03,
        color: 'black',
        fontFamily: 'Inter-Bold',
        alignSelf: 'center',
        marginBottom: height * 0.02
    },
    text:{
        marginLeft: 10,
        fontFamily: 'Inter-Medium',
    },
    gender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
    }
})

export default registerStyles;