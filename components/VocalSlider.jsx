import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { ThemedText } from "./ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import WaveForm from "./WaveForm";
import { Visualizer } from "@/hooks/Context/WaveForm";
import { handleTrackVolume } from "@/constants/effects";

const VocalSlider = ({ url, title, isVocalPlaying, setIsVocalPlaying, vocalsVolume, setVocalsVolume, pauseVocals, resumeVocals }) => {
  
  const { setVocalsWave } = useContext(Visualizer);


  return (
    <View
      style={{
        flex: 0.5,
        width: "90%",
        borderRadius: 10,
        padding: 10,
        flexDirection: "column",
        gap: 10,
      }}
    >
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "white",
          textAlign: "center",
        }}
      >
        {title + "-" + "Vocals"}
      </ThemedText>
      <View
        style={{
          width: "100%",
          height: "60%",
          padding: 0,
          backgroundColor: "lightgreen",
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <View
          style={{
            width: "20%",
            height: "100%",
            backgroundColor: "orange",
            flexDirection: 'column',
            alignItems: "center",
            justifyContent: "center",
            gap: 5
          }}
        >
          <MaterialIcons name="multitrack-audio" size={40} color={"black"} />
          <Slider
            value={vocalsVolume}
            maximumValue={1}
            minimumValue={0}
            onValueChange={(value) => {
              setVocalsVolume(value)
            }}
            style={{
              width: "95%",
              height: "20%",
              borderColor: "blue",
            }}
          />
        </View>
        {isVocalPlaying ? (
          <Ionicons
            onPress={() => pauseVocals()}
            name="pause"
            size={30}
            color={"black"}
          />
        ) : (
          <Ionicons
            onPress={() => {resumeVocals()}}
            
            name="play"
            size={30}
            color={"black"}
          />
        )}
        <View style={{ width: "70%", height: "75%", alignItems: "center", justifyContent: 'center' }}>
          <WaveForm uri={url} setVocalsWave={setVocalsWave} />
        </View>
      </View>
    </View>
  );
};

export default VocalSlider;

const styles = StyleSheet.create({});
