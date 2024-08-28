import {
  BackHandler,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { PlayerControls } from "@/hooks/Context/Player";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";
import SyncModal from "@/components/Models/SyncModal";
import { TrackControls } from "@/hooks/Context/Karaoke";
import { VocalControls } from "@/hooks/Context/Vocals";

const PreviewScreen = () => {
  const { AudioProcessor } = NativeModules;

  const { vocals, music, coverPhoto, title, artists } = useLocalSearchParams();

  const { height } = Dimensions.get("window");
  const theme = useThemeColor({ light: "lightblue", dark: "#000" });
  const modalColor = useThemeColor({ light: "yellow", dark: "lightblue" });
  const [applyReverb, setApplyReverb] = useState(false);
  const [applyCompressor, setApplyCompressor] = useState(false);
  const [sync, setSync] = useState(false);
  const [applyEQ, setApplyEQ] = useState(false);
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);
  const { trackVolume, setTrackVolume } = useContext(PlayerControls);
  const { currentSound, setCurrentSound } = useContext(TrackControls);
  const { currentVocals, setCurrentVocals } = useContext(VocalControls);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const { efxList, setEfxList } = useContext(EfxControls);
  const { appliedEfx, currentEfx } = useContext(EfxControls);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isVocalPlaying, setIsVocalPlaying] = useState(false);
  const [vocalsVolume, setVocalsVolume] = useState(1.0);
  

  const loadAndPlaySound = async (sound, filePath, volume) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: filePath },
        { shouldPlay: true, volume: volume }
      );
      if (newSound && status.isLoaded) {
        return newSound;
      } else {
        console.log(`Failed to load sound`);
      }
    } catch (error) {
      console.log(error);
    }
  };

 
  async function playMusic() {
    try {
      if(currentSound !== null){
        await currentSound.stopAsync();
      }
      const musicSound = await loadAndPlaySound(
        currentSound,
        music,
        trackVolume
      );
      if (musicSound) {
        setIsMusicPlaying(true);
        setCurrentSound(musicSound);
      } else {
        console.log(`Error loading music`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function playVocals() {
    try {
      if(currentVocals !== null){
        await currentVocals.stopAsync();
      }
      const vocalSound = await loadAndPlaySound(
        currentVocals,
        processedVocals ? processedVocals : vocals,
        vocalsVolume
      );
      if (vocalSound) {
        setIsVocalPlaying(true);
        setCurrentVocals(vocalSound);
      } else {
        console.log(`Error loading vocals`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (vocals || processedVocals) {
      playVocals();
    }
  }, [processedVocals]);

  useEffect(() => {
    playMusic();
  }, [processedVocals]);

  console.log(currentVocals, currentSound);

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

  const handleMix = async () => {
    try {
      const result = await AudioProcessor.mixMusicAndVocals(
        music,
        processedVocals,
        1,
        0.5
      );
      if (result) {
        console.log(result);
        const { musicSound: sound } = Audio.Sound.createAsync(
          { uri: result },
          { shouldPlay: true }
        );
      }
    } catch (error) {
      console.log(error);
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
          <MusicSlider
            url={music}
            title={title}
            isMusicPlaying={isMusicPlaying}
            setIsMusicPlaying={setIsMusicPlaying}
          />
          <VocalSlider
            isVocalPlaying={isVocalPlaying}
            setIsVocalPlaying={setIsVocalPlaying}
            vocalsVolume={vocalsVolume}
            setVocalsVolume={setVocalsVolume}
            url={processedVocals ? processedVocals : vocals}
            title={title}
          />
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
              vocals={
                isProcessing && processedVocals ? processedVocals : vocals
              }
              title={title}
            />
          )}
          {applyCompressor && (
            <CompressorModal
              applyCompressor={applyCompressor}
              setApplyCompressor={setApplyCompressor}
              modalColor={modalColor}
              height={height}
              vocals={
                isProcessing && processedVocals ? processedVocals : vocals
              }
              title={title}
            />
          )}
          {applyEQ && (
            <EqualizerModel
              applyEQ={applyEQ}
              setApplyEQ={setApplyEQ}
              modalColor={modalColor}
              height={height}
              vocals={
                isProcessing && processedVocals ? processedVocals : vocals
              }
              title={title}
            />
          )}
          {sync && (
            <SyncModal
              applySync={sync}
              setApplySync={setSync}
              modalColor={modalColor}
              height={height}
              vocals={
                isProcessing && processedVocals ? processedVocals : vocals
              }
              title={title}
            />
          )}
        </View>
        <Button
          title="Discard Changes"
          onPress={() => {
            setEfxList([]);
            setIsProcessing(false);
            setProcessedVocals(vocals);
          }}
          color={"red"}
        />
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
          <Button title="Mix" onPress={() => handleMix()} color={"lightblue"} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({});
