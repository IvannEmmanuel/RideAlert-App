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
    backgroundColor: "#111B56D4",
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
    zIndex: 1000
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
    backgroundColor: "#111B56D4",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  expandedSearchContent: {
    width: '100%',
  },
  collapsedSearchButton: {
    flex: 1,
    justifyContent: 'center',
  },
  searchIcon: {
    alignSelf: 'center',
  },
  debugContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  trackingBadge: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  trackingIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  trackingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  etaContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  etaCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  etaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  etaRoute: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  etaBadge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  etaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  etaDetails: {
    gap: 6,
  },
  etaBoundFor: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  etaBoundForValue: {
    color: "#1a1a1a",
    fontWeight: "700",
  },
  etaDistance: {
    fontSize: 13,
    color: "#999999",
    fontWeight: "400",
  },
  etaFloatingContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 20, // keeps spacing from edges
    zIndex: 10,
    elevation: 10,
  },
  etaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },

  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },

  etaLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  etaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },

  etaHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },

  etaSpeed: {
    fontSize: 13,
    color: '#27ae60',
    fontWeight: '600',
    fontStyle: 'italic',
  },

  etaUpdating: {
    fontSize: 11,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  etaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  confidenceBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confidenceHigh: {
    backgroundColor: '#d4edda',
  },

  confidenceMedium: {
    backgroundColor: '#fff3cd',
  },

  confidenceLow: {
    backgroundColor: '#f8d7da',
  },

  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  stoppedBanner: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ffc107',
  },

  stoppedText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },

  etaMessage: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default homeStyles;