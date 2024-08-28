import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  Button,
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useExpoRouter } from "expo-router/build/global-state/router-store";
import { useContext, useEffect, useState } from "react";
import { Auth } from "@/hooks/Context/User";
import { useThemeColor } from "@/hooks/useThemeColor";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabTwoScreen() {
  const router = useRouter();

  const themeIcon = useThemeColor({ light: "lightgray", dark: "white" });
  const themeBack = useThemeColor({ light: "#000", dark: "#fff" });
  const themedText = useThemeColor({ light: "black", dark: "white" });
  const backgroundBtn = useThemeColor({
    light: "lightgreen",
    dark: "lightblue",
  });

  const [user, setUser] = useState({});

  async function fetchLoggedInUser(){
    try {
      const res = await AsyncStorage.getItem("user");
      if(res){
        const data = JSON.parse(res);
        if(data){
          setUser(data?.user);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, [])

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        paddingTop: "5%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          padding: "5%",
          gap: 20,
        }}
      >
        <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>
          Profile & Settings
        </ThemedText>
        <ThemedView
          style={{
            width: "100%",
            height: "30%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {user && user?.profilePic ? (
            <View
              style={{
                width: "auto",
                height: "auto",
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: 60,
                borderColor: themeBack,
              }}
            >
              <Image
                source={{ uri: user?.profilePic }}
                width={120}
                height={120}
                style={{ borderRadius: 60 }}
              />
            </View>
          ) : (
            <View
              style={{
                width: "auto",
                height: "auto",
                borderWidth: StyleSheet.hairlineWidth,
                borderRadius: 60,
                borderColor: themeBack,
                padding: 10,
              }}
            >
              <Ionicons name="person" size={100} color={themeIcon} />
            </View>
          )}
          {user && user?.name ? (
            <View
              style={{
                width: "auto",
                height: "auto",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <ThemedText
                style={{ color: themedText, marginTop: 10, fontSize: 20 }}
              >
                {user?.name}
              </ThemedText>
              <AntDesign
                name="edit"
                size={15}
                color={"blue"}
                style={{ marginTop: 10 }}
              />
            </View>
          ) : null}
        </ThemedView>
        <ThemedView
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "lightblue",
            borderRadius: 10,
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              width: "auto",
              height: "auto",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text>
              {user?.favourites ? user.favourites?.length : 0}
            </Text>
            <Text>Favourite Tracks</Text>
          </View>
          <View
            style={{
              width: "auto",
              height: "auto",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text>
              {user?.contributions ? user.constributions : 0}
            </Text>
            <Text>Contribution</Text>
          </View>
          <View
            style={{
              width: "auto",
              height: "auto",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text>{user?.exports ? user.exports?.length : 0}</Text>
            <Text>Recordings</Text>
          </View>
        </ThemedView>

        <View
          style={{
            width: "90%",
            height: "80%",
            flexDirection: "row",
            gap: 10,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {user && user.name ? (
            <TouchableOpacity
              onPress={() => {
                AsyncStorage.multiRemove(["token", "user"]);
                router.push("/screens/Auth");
              }}
              style={{
                width: "30%",
                height: "8%",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: backgroundBtn,
                borderRadius: 10,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Text style={{ fontSize: 20, color: themedText }}>Log-Out</Text>
              <Ionicons name="exit" size={20} color={"black"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/screens/Auth")}
              style={{
                width: "auto",
                height: "8%",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: backgroundBtn,
                borderRadius: 10,
                justifyContent: "center",
                alignSelf: "center",
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 20, color: themedText }}>
                Sign-In or Register
              </Text>
              <Ionicons name="person-outline" size={20} color={"black"} />
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
