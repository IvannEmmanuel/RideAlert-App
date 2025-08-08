import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f9',
    paddingTop: height * 0.05,
  },
  image:{
    width: width * 0.8,
    height: width * 0.4,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    //fontWeight: '700',
    color: '#1d3557',
    marginTop: -36,
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  // Avatar
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -36,
    marginBottom: 16,
    zIndex: 2,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#4895ef',
    opacity: 0.85,
  },

  // Section Block
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
    color: '#1d3557',
  },

  // Field Group
  infoGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#8d99ae',
    marginBottom: 2,
    fontWeight: '500'
  },
  value: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#2b2d42',
    paddingVertical: 2,
  },
  input: {
    fontSize: 15,
    color: '#1e1e1e',
    backgroundColor: '#f6f7f8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dce0e4',
  },

  // Account Settings
  accountSettingsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  accountSettings: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    fontWeight: '600',
    color: '#1d3557',
    textAlign: 'left',
    marginBottom: 20, // Adds clean space before buttons
    },
  accountAction: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  delete: {
    color: '#e63946',
    backgroundColor: '#ffe5e9',
  },
  logout: {
    color: '#1d3557',
    backgroundColor: '#eaf1f8',
  },
});

export default profileStyles;
