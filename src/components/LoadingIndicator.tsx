import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const HomeLoadingIndicator = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Please wait map is being load</Text>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

export default HomeLoadingIndicator;