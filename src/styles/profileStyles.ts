import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileStyles = StyleSheet.create({
  header: {
    backgroundColor: '#FFF',
    flex: 1
  },
  container: {
    backgroundColor: '#5AC2E6',
    flex: 0.5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30
  },
  profileContainer: {
    alignSelf: 'center',
    top: -60,
    height: '15%',
    width: '30%',
    borderRadius: 100,
    backgroundColor: '#5e5e5eff'
  },
  informationContainer: {
    top: -20,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  mainInformationText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    bottom: 10,
  },
  stroke: {
    alignSelf: 'center',
    width: 370,
    backgroundColor: '#D9D9D9',
    height: 3,
  },
  subInformationContainer: {
    marginBottom: 20,
  },
  valueInformationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15
  },
  subInformationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#757575',
    marginTop: 10,
  },
  logoutButton: {
    paddingHorizontal: 20
  },
  logoutText: {
    color: '#0065F8',
    fontFamily: 'Inter-Medium',
    fontSize: 15
  },
  profileText: {
    color: '#fff',
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    flex: 1
  }
});

export default profileStyles;
