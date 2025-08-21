import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import initialScreenStyles from '../../styles/initialScreenStyles';

const InitialScreen = () => {
  const navigation = useNavigation();

  const getStartedPress = () => {
    navigation.navigate('InitialSecondPhase');
  }

  return (
      <ImageBackground
        source={require('../../images/puv.png')}
        style={initialScreenStyles.container}
        resizeMode="cover"
      >
        <View style={initialScreenStyles.subContainer}>
          <Text style={initialScreenStyles.mainText}>RideAlert</Text>
          <Text style={initialScreenStyles.subText}>Ride made easier.</Text>
        </View>
        <TouchableOpacity style={initialScreenStyles.buttonContainer} onPress={getStartedPress}>
          <Text style={initialScreenStyles.textButton}>Get Started</Text>
          <Image source={require('../../images/arrow-icon.png')} style={initialScreenStyles.arrowIcon}/>
        </TouchableOpacity>
      </ImageBackground>
  )
}

export default InitialScreen