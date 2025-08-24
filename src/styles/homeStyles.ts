import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FB',
    top: height * 0.02
  },
  topContainer: {
    flex: 0.125,
    top: height * 0.01,
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
    right: width * 0.03
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
    paddingHorizontal: width * 0.07,
    right: width * 0.05
  },
  goodmorningText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18
  },
  userText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 25,
  },
  settingContainer: {
    flexDirection: 'row',
    gap: width * 0.05,
    alignItems: 'center'
  },
  notification: {
    width: 30,
    height: 30,
  },
  settings: {
    width: 25,
    height: 25,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    justifyContent: 'center',
    position: 'absolute'
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
    width: width * 0.9,
    height: height * 0.06,
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05
  },
  subOfMainSearchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchText: {
    right: width * 0.2,
    fontSize: 24,
    fontFamily: 'Inter-Regular',
    color: '#FEFEFE'
  },
  stroke: {
    backgroundColor: '#000000',
    width: width * 0.4,
    height: height * 0.005,
    alignSelf: 'center',
  },
  rideText: {
    top: height * 0.015,
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
  modalText: {
    fontFamily: "Montserrat-Bold",
    borderBottomColor: "#D8D8DF",
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 10,
    fontSize: 16,

  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomColor: "#E0E0E0",
    borderBottomWidth: 1,
  },
  subNotificationItem: {
    backgroundColor: "#FFEB15",
    width: width * 0.08,
    paddingHorizontal: width * 0.012,
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  newText: {
    fontSize: 8,
    fontFamily: "Montserrat-Bold"
  },
  timeText: {
    fontSize: 8, 
    fontFamily: "Montserrat-Regular", 
    width: width * 0.2, 
    paddingHorizontal: 4
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