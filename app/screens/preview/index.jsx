import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import VocalSlider from "@/components/VocalSlider";
import MusicSlider from "@/components/MusicSlider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Audio } from "expo-av";
import { NativeModules } from "react-native";
import ReverbOptions from "@/components/ReverbOptions";
import { RecordedTrack } from "@/hooks/Context/Recording";
import { BottomModal, ModalContent } from "react-native-modals";
import { useThemeColor } from "@/hooks/useThemeColor";
import ReverbModel from "@/components/Models/ReverbModel";
import CompressorModal from "@/components/Models/CompressorModel";
import EqualizerModel from "@/components/Models/EqualizerModel";

const PreviewScreen = () => {
  const { AudioProcessor } = NativeModules;

  const { vocals, music, coverPhoto, title, artists } = useLocalSearchParams();

  const { height } = Dimensions.get("window");
  const theme = useThemeColor({ light: "lightblue", dark: "#000" });
  const modalColor = useThemeColor({ light: "yellow", dark: "lightblue" });

  const [vocalLoaded, setVocalLoaded] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);
  const [loadedMusic, setLoadedMusic] = useState();
  const [loadedVocals, setLoadedVocals] = useState();

  const [reverbPreset, setReverbPreset] = useState("");
  const [applyReverb, setApplyReverb] = useState(false);
  const [applyCompressor, setApplyCompressor] = useState(false);
  const [sync, setSync] = useState(false);
  const [applyEQ, setApplyEQ] = useState(false);
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);

  async function loadMusic() {
    try {
      if (loadedMusic) {
        await loadedMusic.stopAsync();
        loadedMusic.replayAsync();
      }
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: music },
        { shouldPlay: false }
      );
      if (status.isLoaded) {
        setMusicLoaded(true);
        setLoadedMusic(sound);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadProcessedVocals() {
    try {
      if (loadedVocals) {
        await loadedVocals.stopAsync();
        loadedVocals.unloadAsync();
      } else {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: processedVocals },
          {
            shouldPlay: false,
          }
        );
        if (status.isLoaded) {
          setVocalLoaded(true);
          setLoadedVocals(sound);
          await loadMusic();
          if (loadedMusic) {
            await loadedMusic.playAsync();
            await sound.playAsync();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const playMix = async () => {
    try {
      await loadMusic();
      if (loadedMusic) {
        await loadProcessedVocals();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if(processedVocals){
  //     loadProcessedVocals();
  //   }
  // }, [processedVocals]);

  const efx = [
    {
      id: 0,
      title: "Reverb",
      onPress: () => setApplyReverb(!applyReverb),
    },
    {
      id: 1,
      title: "Compressor",
      onPress: () => setApplyCompressor(!applyCompressor),
    },
    {
      id: 2,
      title: "Syncronize",
      onPress: () => setSync(!sync),
    },
    {
      id: 3,
      title: "Equalizer",
      onPress: () => setApplyEQ(!applyEQ),
    },
  ];

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <ThemedView
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "45%",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "white",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <MusicSlider url={music} title={title} />
          <VocalSlider url={processedVocals ? processedVocals : vocals} />
        </View>
        <View
          style={{ display: "flex", justifyContent: "flex-end", margin: 0 }}
        >
          {applyReverb && (
            <ReverbModel
              applyReverb={applyReverb}
              setApplyReverb={setApplyReverb}
              modalColor={modalColor}
              height={height}
              vocals={vocals}
              title={title}
            />
          )}
          {applyCompressor && (
            <CompressorModal
              applyCompressor={applyCompressor}
              setApplyCompressor={setApplyCompressor}
              modalColor={modalColor}
              height={height}
              vocals={vocals}
              title={title}
            />
          )}
          {
            applyEQ && (
              <EqualizerModel applyEQ={applyEQ}
              setApplyEQ={setApplyEQ}
              modalColor={modalColor}
              height={height}
              vocals={vocals}
              title={title} />
            )
          }
        </View>
        <View
          style={{
            width: "100%",
            height: "100%",
            padding: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          {efx &&
            efx.map((e, idx) => (
              <TouchableOpacity
                key={idx}
                style={{
                  width: "48%",
                  backgroundColor: "orange",
                  flexDirection: "row",
                  height: "10%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  borderRadius: 10,
                }}
                onPress={() => e.onPress()}
                title="Apply Reverb"
                color="lightblue"
              >
                <MaterialIcons name="surround-sound" size={30} color={theme} />
                <ThemedText>{e.title}</ThemedText>
              </TouchableOpacity>
            ))}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({});
