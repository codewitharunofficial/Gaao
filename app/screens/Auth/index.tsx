import {
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
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <ThemedView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Image
          source={require("@/assets/images/Gaao-Icon.png")}
          style={{
            width: "20%",
            height: "20%",
            resizeMode: "contain",
            borderRadius: 20,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            handleSignUp();
          }}
          style={{
            width: "auto",
            height: "5%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "lightblue",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        >
          {/* <Link href={"/(tabs)"} replace={true} > */}
          <AntDesign name="google" color={"black"} size={24} />
          <ThemedText>Sign Up With Google</ThemedText>
          {/* </Link> */}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSignIn()}
          style={{
            width: "auto",
            height: "5%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "lightblue",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
        >
          {/* <Link href={"/(tabs)"} replace={true} > */}
          <AntDesign name="google" color={"black"} size={24} />
          <ThemedText>Sign In With Google</ThemedText>
          {/* </Link> */}
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
