import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileStyles = StyleSheet.create({
  container: {
    top: height * 0.02,
    paddingVertical: width * 0.01,
    width: width * 1,
    height: height * 0.25,
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    paddingHorizontal: width * 0.04,
  },
  mainProfileContainer: {
    flexDirection: 'row'
  },
  profileContainer: {
    top: height * 0.01,
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
    paddingHorizontal: width * 0.04
  },
  fullNameText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22
  },
  emailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    bottom: height * 0.004
  },
  personalText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18
  },
  informationContainer: {
    backgroundColor: "#FFFFFF",
    width: width * 0.9,
    height: height * 0.330,
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  subFirstInformationContainer: {
    paddingHorizontal: width * 0.040,
  },
  subInformationContainer: {
    paddingHorizontal: width * 0.040,
    marginTop: height * 0.02
  },
  accountContainer: {
    paddingHorizontal: width * 0.050, 
    top: height * 0.02 
  },
  accountText: { 
    fontFamily: 'Montserrat-Bold', 
    fontSize: 16 
  },
  logoutContainer: { 
    backgroundColor: '#f34747ff', 
    width: width * 0.9, 
    height: height * 0.05, 
    borderRadius: 10, 
    justifyContent: 'center', 
    marginTop: height * 0.02 
  },
  logoutText: {
    textAlign: 'center', 
    color: '#FFFFFF', 
    fontSize: 18
  },
  textLabel: { 
    fontFamily: 'Montserrat-Bold', 
    fontSize: 16 
  },
  textValue: { 
    fontFamily: 'Montserrat-Regular', 
    fontSize: 16 
  }
});

export default profileStyles;
