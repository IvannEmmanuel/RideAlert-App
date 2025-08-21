import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import initialSecondPhaseStyles from '../../../styles/initialSecondPhaseStyles';

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
            <View style={initialSecondPhaseStyles.container}>
                <LottieView
                    source={require('../../../images/Initial_Screen.json')}
                    autoPlay
                    loop
                    style={initialSecondPhaseStyles.lottieContainer}
                />
                <View style={initialSecondPhaseStyles.taglineContainer}>
                    <Text style={initialSecondPhaseStyles.taglineText}>Never Miss Your Bus Again</Text>
                    <Text style={initialSecondPhaseStyles.taglineTextTwo}>Orotsco Bus at Your Fingertips</Text>
                </View>
            </View>
            <View style={initialSecondPhaseStyles.accountContainer}>
                <TouchableOpacity style={initialSecondPhaseStyles.createAccountButton} onPress={createPress}>
                    <Text style={initialSecondPhaseStyles.createAccountText}>Create an account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={initialSecondPhaseStyles.loginAccountButton} onPress={loginPress}>
                    <Text style={initialSecondPhaseStyles.loginAccountText}>Log in</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default InitialSecondPhase;