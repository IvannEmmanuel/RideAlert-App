import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB'
  },
  topContainer: {
    flex: 0.125,
    top: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTopContainer: {
    flexDirection: 'row',
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
    right: 10
  },
  profileText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  informationContainer: {
    flexDirection: 'column',
    paddingHorizontal: 30,
    right: 10
  },
  goodmorningText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    marginBottom: -10
  },
  userText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 25,
  },
  settingContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },
  notification: {
    width: 34,
    height: 25,
  },
  settings: {
    width: 25,
    height: 25,
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
  subSearchContainer: {
    alignSelf: 'center',
    bottom: 30,
    justifyContent: 'center'
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
  subOfMainSearchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  },
  modalBackground: {
    marginTop: '50%',
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    left: height * 0.1,
    borderRadius: 10,
    width: width * 0.7,
    maxHeight: height * 0.25,
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#0500FE",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default homeStyles;