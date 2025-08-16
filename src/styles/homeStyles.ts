import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    alignSelf: 'center',
    top: height * 0.02,
    width: width * 0.8,
  },
  input: {
    backgroundColor: '#fff',
    height: height * 0.05,
    fontSize: 13,
    width: '80%',
    alignSelf: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'center',
    width: width * 0.5,
    backgroundColor: '#4895ef',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontFamily: 'Inter-Bold' 
  },
  searchContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    alignItems: 'center'
  },
  outerContainer: {
    backgroundColor: '#E6F3F4',
    borderRadius: 14,
    width: '95%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  innerContainer: {
    backgroundColor: '#fdfdfdff',
    width: '85%',
    height: '60%',
    elevation: 10,
    borderRadius: 14,
    justifyContent: 'center',
  },
  strokeMainContainer: {
    width: '100%',
    height: 20,
    alignSelf: 'center',
    backgroundColor: '#E6F3F4',
  },
  strokeContainer: {
    width: '55%',
    height: 5,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    alignSelf: 'center',
  }
});

export default homeStyles;
