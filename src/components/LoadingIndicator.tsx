import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const HomeLoadingIndicator = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

export default HomeLoadingIndicator;