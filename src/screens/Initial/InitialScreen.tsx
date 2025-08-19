import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from 'react-native';

const InitialScreen = () => {
  const navigation = useNavigation();

  const getStartedPress = () => {
    navigation.navigate('InitialSecondPhase');
  }

  return (
      <ImageBackground
        source={require('../../images/puv.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.subContainer}>
          <Text style={styles.mainText}>RideAlert</Text>
          <Text style={styles.subText}>Ride made easier.</Text>
        </View>
        <TouchableOpacity style={styles.buttonContainer} onPress={getStartedPress}>
          <Text style={styles.textButton}>Get Started</Text>
          <Image source={require('../../images/arrow-icon.png')} style={styles.arrowIcon}/>
        </TouchableOpacity>
      </ImageBackground>
  )
}

export default InitialScreen

const styles = StyleSheet.create({
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
    bottom: 10,
  },
  subText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 25,
    color: '#0065F8',
    bottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    top: 50,
    borderRadius: 50,
    alignItems: 'center',
    gap: 50,
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
    height: 15,
    width: 10
  }
})