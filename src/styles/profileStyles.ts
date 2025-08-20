import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileStyles = StyleSheet.create({
  container: {
    top: 20,
    paddingVertical: 10,
    width: '100%',
    height: height * 0.25,
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    paddingHorizontal: 20,
  },
  mainProfileContainer: {
    flexDirection: 'row'
  },
  profileContainer: {
    top: 10,
    height: 70,
    width: 70,
    borderRadius: 100,
    backgroundColor: '#464646ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  subTopHeader: {
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  fullNameText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22
  },
  emailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    bottom: 4
  },
  personalText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18
  },
  informationContainer: {
    backgroundColor: "#FFFFFF",
    width: 380,
    height: 330,
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  subFirstInformationContainer: {
    paddingHorizontal: 20,
  },
  subInformationContainer: {
    paddingHorizontal: 20,
    marginTop: 20
  },
  accountContainer: {
    paddingHorizontal: 20, top: 20 
  },
  accountText: { 
    fontFamily: 'Montserrat-Bold', fontSize: 16 
  },
  logoutContainer: { 
    backgroundColor: '#FA0A0A', 
    width: '100%', 
    height: 50, 
    borderRadius: 10, 
    justifyContent: 'center', 
    marginTop: 20 
  },
  logoutText: {
    textAlign: 'center', 
    color: '#FFFFFF', 
    fontSize: 18
  }
});

export default profileStyles;
