import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Link } from "expo-router";

const TrackCard = ({ coverPhoto, title, artists, lyrics, url, duration }) => {
  return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: "100%",
          height: 80,
          backgroundColor: "lightyellow",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          borderRadius: 5,
          marginTop: -8,
          paddingRight: 10,
        }}
      >
    
        {coverPhoto ? (
          <Image source={{ uri: coverPhoto }} width={80} height={80} />
        ) : (
          <ThemedView
            style={{
              width: 80,
              height: 80,
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: "black",
              backgroundColor: "lightgreen",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="mic-outline" color={"black"} size={40} />
          </ThemedView>
        )}
        <View
          style={{
            flexDirection: "column",
            backgroundColor: "none",
            flex: 1,
            padding: 10,
          }}
        >
          <ThemedText
            style={{
              color: "black",
              fontSize: 14,
              flex: 1,
              fontWeight: "bold",
            }}
          >
            {title}
          </ThemedText>
          <ThemedText style={{ color: "black", fontSize: 10 }}>
            {artists}
          </ThemedText>
        </View>
        <Link href={{pathname: '/screens', params: {title: title, artists: artists, lyrics: lyrics, url: url, coverPhoto: coverPhoto ? coverPhoto : null}}} asChild >
        <TouchableOpacity style={{backgroundColor: 'lightblue', padding: 10, borderRadius: 50 }} >
          <Entypo name="modern-mic" size={30} color={"black"} />
        </TouchableOpacity>
        </Link>

      </TouchableOpacity>
  );
};

export default TrackCard;

const styles = StyleSheet.create({});
