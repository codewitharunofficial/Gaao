import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import Feather from "@expo/vector-icons/Feather";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import Ionicons from "@expo/vector-icons/Ionicons";
import WaveForm from "./WaveForm";
import { TrackControls } from "@/hooks/Context/Karaoke";
import { Visualizer } from "@/hooks/Context/WaveForm";
import { PlayerControls } from "@/hooks/Context/Player";
import { RecordedTrack } from "@/hooks/Context/Recording";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";

const MusicSlider = ({ title, url, isMusicPlaying, setIsMusicPlaying, trackVolume, setTrackVolume, pauseTrack, resumeTrack }) => {
  
  const { setMusicWave } = useContext(Visualizer);
  // const {trackVolume, setTrackVolume} = useContext(PlayerControls);
  


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
        {title}-Music
      </ThemedText>
      <View
        style={{
          width: "100%",
          height: "60%",
          padding: 0,
          backgroundColor: "purple",
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "20%",
            height: "100%",
            backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="mic" size={30} color={"white"} />
        </View>
        {isMusicPlaying ? (
          <Ionicons
            onPress={() => pauseTrack()}
            name="pause"
            size={30}
            color={"black"}
          />
        ) : (
          <Ionicons
            onPress={() => resumeTrack()}
            name="play"
            size={30}
            color={"black"}
          />
        )}
        <View style={{ width: "70%", height: "75%", alignItems: "center" }}>
          <WaveForm uri={url} setMusicWave={setMusicWave} />
          <Slider
            value={trackVolume}
            maximumValue={1}
            minimumValue={0}
            onValueChange={(value) => {
              setTrackVolume(value);
            }}
            style={{
              width: "95%",
              height: "20%",
              position: "absolute",
              bottom: "35%",
              borderColor: "blue",
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default MusicSlider;

const styles = StyleSheet.create({});
