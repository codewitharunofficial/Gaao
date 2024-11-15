import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Link } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";

const TrackCard = ({
  coverPhoto,
  title,
  artists,
  lyrics,
  url,
  duration,
  format,
}) => {
  const themedBg = useThemeColor({ light: "#4CC9F0", dark: "#0093E9" });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        width: "90%",
        height: 80,
        backgroundColor: themedBg,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        borderRadius: 5,
        marginTop: -8,
        paddingRight: 10,
      }}
    >
      {coverPhoto ? (
        <Image
          source={{ uri: coverPhoto }}
          width={80}
          height={80}
          resizeMode="stretch"
        />
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
          {title && title?.length > 20 ? `${title.slice(0, 20)}...` : title}
        </ThemedText>
        <ThemedText style={{ color: "black", fontSize: 10 }}>
          {artists}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={{ backgroundColor: "lightgreen", padding: 10, borderRadius: 50 }}
      >
        <MaterialIcons name="favorite-outline" size={30} color={"black"} />
        {/* <MaterialIcons name="favorite" size={30} color={"black"} /> */}
      </TouchableOpacity>
      <Link
        href={{
          pathname: "/screens",
          params: {
            title: title,
            artists: artists,
            lyrics: lyrics,
            url: url,
            coverPhoto: coverPhoto ? coverPhoto : null,
            format: format,
          },
        }}
        asChild
      >
        <TouchableOpacity
          style={{
            backgroundColor: "lightblue",
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Entypo name="modern-mic" size={30} color={"black"} />
        </TouchableOpacity>
      </Link>
    </TouchableOpacity>
  );
};

export default TrackCard;

const styles = StyleSheet.create({});
