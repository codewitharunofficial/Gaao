import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Auth } from "@/hooks/Context/User";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { setNavigation } from "@/hooks/navigationRef";
// WebBrowser.maybeCompleteAuthSession();

const index = () => {
  const { user, setUser } = useContext(Auth);
  const [token, setToken] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loggingIn, setLogginIn] = useState(false);

  const router = useRouter();

  setNavigation(router);

  // const navigation = useNavigation();

  const androidClientId = "632816505768-19ut7in277tncklho1fonidsa6uve3mq.apps.googleusercontent.com"

  // console.log(androidClientId);

  const config = {
    androidClientId: androidClientId
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleToken = async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      if (token) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("expiresIn", JSON.stringify(authentication.expiresIn));
        await AsyncStorage.setItem("issuedAt", JSON.stringify(authentication.issuedAt));
        const userData = await fetchUserInfo(token);

        if (userData && isSigningUp) {
          await signUp(userData);
        } else if(userData && loggingIn){
           await logIn(userData?.email);
        } else {
          console.log("Error While Fetching user from google");
        }
      }
    }
  };

  const fetchUserInfo = async (token) => {
    console.log("token in fetch user function:", token);
    try {
      if (token) {
        const { data } = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data) {
          console.log(data);
          return data;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signUp = async (userData) => {
      try {
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_URL}/api/v1/users/registration`,
          userData
        );
        if (data.success) {
          setUser(data);
        }
        router.replace("/(tabs)");
        await AsyncStorage.setItem("user", JSON.stringify(data));
        setIsSigningUp(false);
      } catch (error) {
        console.log(error.message);
      }
  };

  const logIn = async (email) => {
          
    try {
      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_URL}/api/v1/users/login`, {email: email});

      if(data && data.success){
         setUser(data);
         await AsyncStorage.setItem("user", JSON.stringify(data));
         router.replace("/(tabs)");
         setLogginIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const isTokenExpired = async (issuedAt, expiresIn) => {
    const now = Date.now() / 1000;
    const expiryTime = issuedAt + expiresIn;
    return now > expiryTime;
  }

  async function checkToken() {
    try {
      const res = await AsyncStorage.getItem("token");
      const res1 = await AsyncStorage.getItem("expiresIn");
      const res2 = await AsyncStorage.getItem("issuedAt");

      if(res1 && res2){
        const issuedAt = JSON.parse(res2);
        const expiresIn = JSON.parse(res1);

        if(issuedAt && expiresIn){
         const expired = await isTokenExpired(issuedAt, expiresIn);
         setIsExpired(expired);
        }
      }

      if(res){
        setToken(res);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const loginIfToken = async (token) => {
    try {
      const data = await fetchUserInfo(token);
      
      if(data){
        logIn(data?.email);
      } else {
        console.log("Something went wrong while getting data");
      }
    } catch (error) {
      console.log(error)
    }
  }

useEffect(() => {
  checkToken();
}, []);

  useEffect(() => {
    handleToken();
  }, [response]);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      try {
        const res = await AsyncStorage.getItem("user");
        if (res) {
          const data = JSON.parse(res);
          if (data) {
            setUser(data);
            // router.replace("/(tabs)");
            return true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const activeUser = checkIfLoggedIn();
    // console.log(activeUser);
  }, []);

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
          onPress={() => {promptAsync(); setIsSigningUp(true)}}
          style={{
            width: "35%",
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
          onPress={() => {token && !isExpired ? loginIfToken(token) : promptAsync(); setLogginIn(true)}}
          style={{
            width: "35%",
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
