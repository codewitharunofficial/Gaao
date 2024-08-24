// LoadingScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('./assets/Gaao-Icon.png')} 
        style={styles.logo} 
      />
      <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
      <Text style={styles.text}>Please Wait...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',  // Dark background for a karaoke vibe
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoadingScreen;
