import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('window');

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
    marginBottom: 10,
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
});

export default homeStyles;
