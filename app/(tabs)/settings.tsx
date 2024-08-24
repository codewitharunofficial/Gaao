import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, Button, TouchableOpacity, SafeAreaView } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useExpoRouter } from "expo-router/build/global-state/router-store";

export default function TabTwoScreen() {
  const router = useRouter();

  

  return (
    <SafeAreaView style={{width: '100%', height: '100%', paddingTop: '5%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} >
      <ThemedText>Settings Page</ThemedText>
      <ThemedView style={{width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => router.push('/Auth')} style={{width: '20%', height: "10%", flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'lightblue', borderRadius: 10, justifyContent: 'center'}} >

        <ThemedText style={{fontSize: 24}} >Log In</ThemedText>
      </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
