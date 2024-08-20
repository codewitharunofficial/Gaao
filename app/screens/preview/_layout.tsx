import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { KaraokeContext } from '@/hooks/Context/Karaoke';
import { RecordingContext } from '@/hooks/Context/Recording';
// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{presentation: "fullScreenModal", title: "Preview", animation: 'slide_from_left', headerBackVisible: false}} />
      </Stack>
    </ThemeProvider>
  );
}