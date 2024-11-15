import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Auth } from "@/hooks/Context/User";
import { useRouter } from "expo-router";
import { setNavigation } from "@/hooks/navigationRef";
import Toast from "react-native-simple-toast";
import { googleSignIn } from "@/constants/functions";

const index = () => {
  const { user, setUser } = useContext(Auth);
  const {width, height} = Dimensions.get('window');

  const router = useRouter();

  setNavigation(router);


  const signUp = async (userData) => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/api/v1/users/registration`,
        userData
      );
      if (data.success) {
        setUser(data);
        Toast.show(`Welcome! ${data?.user.name}`, 3000);
      }
      router.replace("/(tabs)");
      await AsyncStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.log(error.message);
      Toast.show(error.message, 3000);
    }
  };

  const logIn = async (email) => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_URL}/api/v1/users/login`,
        { email: email }
      );

      if (data && data.success) {
        setUser(data);
        Toast.show(`Welcome! ${data?.user.name}`, 3000);
        await AsyncStorage.setItem("user", JSON.stringify(data));
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log(error);
      Toast.show(error.message, 3000);
    }
  };

  const handleSignIn = async () => {
    try {
      const userDetails = await googleSignIn();
      if (userDetails) {
        logIn(userDetails.email);
      }
    } catch (error) {
      Toast.show(error.message, 3000);
    }
  };

  const handleSignUp = async () => {
    try {
      const userDetails = await googleSignIn();
      if (userDetails) {
        signUp(userDetails);
      }
    } catch (error) {
      Toast.show(error.message, 3000);
    }
  };

  return (
    <SafeAreaView style={{ width: width, height: height }}>
      <ThemedView
        style={{
          width: width,
          height: height,
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Image
          source={require("@/assets/images/Gaao-Icon.png")}
          style={{
            width: 100,
            height: 100,
            resizeMode: "stretch",
            borderRadius: 50,
          }}
        />
        <ThemedText>Explore Gaao..!! Happy Singing</ThemedText>
        <TouchableOpacity
          onPress={() => {
            handleSignUp();
          }}
          style={{
            width: width / 2.5,
            height: height / 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: 20,
            paddingHorizontal: 10
          }}
        >
          <Image source={require('@/assets/images/GoogleSignUp.png')} resizeMode="contain" style={{width: width / 3, height: height/20, borderRadius: 20}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSignIn()}
          style={{
            width: width / 2.5,
            height: height / 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "orange",
            borderRadius: 20,
            paddingHorizontal: 10
          }}
        >

          <Image source={require('@/assets/images/GoogleSignIn.png')} resizeMode="contain" style={{width: width / 3, height: 50}} />
          {/* </Link> */}
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
