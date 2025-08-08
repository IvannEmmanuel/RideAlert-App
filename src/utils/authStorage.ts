import AsyncStorage from '@react-native-async-storage/async-storage';

const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.log('Error saving user data', e);
  }
}

const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('access_token', token);
  } catch (e) {
    console.log('Error saving token', e);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    return token;
  } catch (e) {
    console.log('Error fetching token', e);
    return null;
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
  } catch (e) {
    console.log('Error removing token', e);
  }
};

export { saveToken, getToken, removeToken, getUser };