import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ModalPortal } from "react-native-modals";
import { useColorScheme } from "@/hooks/useColorScheme";
import { KaraokeContext } from "@/hooks/Context/Karaoke";
import { RecordingContext } from "@/hooks/Context/Recording";
import { VisualizerContext } from "@/hooks/Context/WaveForm";
import { PlayerContext } from "@/hooks/Context/Player";
import { EfxContext } from "@/hooks/Context/ProcessedAudio";
import { UserContext } from "@/hooks/Context/User";
import { VocalContext } from "@/hooks/Context/Vocals";
import { MusicProvider } from "@/hooks/Context/Music";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserContext>
      <VisualizerContext>
        <MusicProvider>
      <VocalContext>
        <EfxContext>
        <PlayerContext>
        <KaraokeContext>
          <RecordingContext>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="screens" options={{ headerShown: false }} />
            </Stack>
            <ModalPortal />
          </RecordingContext>
        </KaraokeContext>
        </PlayerContext>
        </EfxContext>
      </VocalContext>
        </MusicProvider>
      </VisualizerContext>
      </UserContext>
    </ThemeProvider>
  );
}
