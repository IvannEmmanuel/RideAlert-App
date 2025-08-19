import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
  },
  topContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignSelf: 'center',
    height: 50,
    width: 50,
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
  goodmorningText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    marginBottom: -10,
  },
  userText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 25,
  },
  notification: {
    width: 37,
    height: 30,
  },
  settings: {
    width: 27,
    height: 27,
  },
  mapContainer: {
    flex: 0.9,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    backgroundColor: '#0500FE',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 30,
    borderRadius: 100,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainSearchContainer: {
    backgroundColor: '#F7F6FB',
    width: '100%',
    height: 210,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center'
  },
  subMainSearchContainer: {
    backgroundColor: '#0500FE',
    width: '90%',
    height: 60,
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  searchText: {
    right: 80,
    fontSize: 24,
    fontFamily: 'Inter-Regular',
    color: '#FEFEFE'
  },
  stroke: {
    backgroundColor: '#000000',
    width: 150,
    height: 5,
    alignSelf: 'center',
  },
  rideText: {
    top: 15,
    fontSize: 22,
    fontFamily: 'Montserrat-Bold'
  }
});

export default homeStyles;