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

const getRefreshToken = async () => {
  const token = await AsyncStorage.getItem("refresh_token");
  return token;
};

const refreshAccessToken = async () => {
  try {
    const refresh_token = await getRefreshToken();
    if (!refresh_token) return null;

    const response = await axios.post(`${BASE_URL}/users/refresh_token`, {
      refresh_token,
    });

    const newAccessToken = response.data.access_token;
    await AsyncStorage.setItem("access_token", newAccessToken);

    console.log("🔄 Access token refreshed successfully");
    return newAccessToken;
  } catch (err) {
    console.error("❌ Failed to refresh token:", err);
    return null;
  }
};


export { saveToken, getToken, removeToken, getUser, getRefreshToken, refreshAccessToken };