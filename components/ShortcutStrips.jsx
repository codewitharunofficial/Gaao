import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "./ThemedText";

const ShortcutStrips = ({icon, color, title}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flex: 0.48,
        backgroundColor: "yellow",
        height: 60,
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 10,
        borderRadius: 10
      }}
     >
        <Ionicons name={icon} size={40} color={color} />
        <ThemedText style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: 'black'}} >{title}</ThemedText>
        
         </TouchableOpacity>
  );
};

export default ShortcutStrips;

const styles = StyleSheet.create({});
