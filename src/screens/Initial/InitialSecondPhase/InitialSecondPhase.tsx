import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const InitialSecondPhase = () => {

    const navigation = useNavigation();

    const loginPress = () => {
        navigation.navigate('Login');
    }

    const createPress = () => {
        navigation.navigate('Register');
    }

    return (
        <>
            <View style={styles.container}>
                <LottieView
                    source={require('../../../images/Initial_Screen.json')}
                    autoPlay
                    loop
                    style={styles.lottieContainer}
                />
                <View style={styles.taglineContainer}>
                    <Text style={styles.taglineText}>Never Miss Your Bus Again</Text>
                    <Text style={styles.taglineTextTwo}>Orotsco Bus at Your Fingertips</Text>
                </View>
            </View>
            <View style={styles.accountContainer}>
                <TouchableOpacity style={styles.createAccountButton} onPress={createPress}>
                    <Text style={styles.createAccountText}>Create an account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginAccountButton} onPress={loginPress}>
                    <Text style={styles.loginAccountText}>Log in</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default InitialSecondPhase;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    lottieContainer: {
        width: width * 1,
        height: height * 0.3
    },
    taglineContainer: {
        paddingHorizontal: 20,
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
        width: 380,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    createAccountText: {
        fontSize: 22,
        fontFamily: 'Inter-Regular',
        fontWeight: 400,
        color: '#FFFFFF',
    },
    loginAccountButton: {
        backgroundColor: '#D9D9D9',
        width: 380,
        height: 60,
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
});
