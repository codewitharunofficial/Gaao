// LoadingScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

const LoadingScreen = () => {

  const  themeColor = useThemeColor({light: 'black', dark: 'white'});

  return (
    <ThemedView style={styles.container}>
      <Image 
        source={require('@/assets/images/Gaao-Icon.png')}
        style={styles.logo} 
      />
      <ActivityIndicator size="large" color="" style={styles.loader} />
      <ThemedText style={styles.text}>Please Wait...</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'visible'
    // backgroundColor: '#000',  // Dark background for a karaoke vibe
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
    // color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoadingScreen;
