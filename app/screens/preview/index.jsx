import {
  BackHandler,
  Button,
  Dimensions,
  Image,
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
import { useMusic } from "@/hooks/Context/Music";
import { handleTrackVolume } from "@/constants/effects";
import { pauseTrack, resumeTrack } from "@/constants/playerNodes";
import * as Sentry from '@sentry/react-native';

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
  // const { position, setPosition } = useContext(TrackControls);
  const [musicPosition, setMusicPosition] = useState(0);
  const [vocalPosition, setVocalPosition] = useState(0);
  const { trackVolume, setTrackVolume } = useContext(PlayerControls);
  // const { currentSound, setCurrentSound } = useContext(TrackControls);
  const { currentTrack, setCurrentTrack } = useContext(useMusic);
  const { currentVocals, setCurrentVocals } = useContext(VocalControls);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const { efxList, setEfxList } = useContext(EfxControls);
  const { appliedEfx, currentEfx } = useContext(EfxControls);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isVocalPlaying, setIsVocalPlaying] = useState(false);
  const [vocalsVolume, setVocalsVolume] = useState(1.0);
  const [mix, setMix] = useState(null);

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

  const handleMusicPause = async () => {
    const res = await pauseTrack(currentTrack);
    if (res) {
      setIsMusicPlaying(false);
      currentTrack.setOnPlaybackStatusUpdate((status) => {
        setMusicPosition(status.positionMillis);
      });
    } else {
      console.log(`Error While pausing the track`);
    }
  };

  async function playMusic() {
    try {
      if (currentTrack !== null) {
        await currentTrack.stopAsync();
      }
      const musicSound = await loadAndPlaySound(
        currentTrack,
        music,
        trackVolume
      );
      if (musicSound) {
        setIsMusicPlaying(true);
        setCurrentTrack(musicSound);
        musicSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsMusicPlaying(false);
          }
        });
      } else {
        console.log(`Error loading music`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const resumeMusic = async () => {
    const res = await resumeTrack(currentTrack, musicPosition);
    if (res) {
      console.log(`Track has been resumed`);
      setIsMusicPlaying(true);
    }
  };

  async function playVocals() {
    try {
      if (currentVocals !== null) {
        await currentVocals.stopAsync();
      }
      const vocalSound = await loadAndPlaySound(
        currentVocals,
        processedVocals ? processedVocals : vocals,
        vocalsVolume
      );
      if (vocalSound) {
        vocalSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsVocalPlaying(false);
          }
        });
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
    if (vocals || (processedVocals && currentTrack !== null)) {
      playVocals();
    }
  }, [processedVocals]);

  useEffect(() => {
    playMusic();
  }, [processedVocals]);

  useEffect(() => {
    handleTrackVolume(currentTrack, trackVolume);
  }, [trackVolume]);

  useEffect(() => {
    handleTrackVolume(currentVocals, vocalsVolume);
  }, [vocalsVolume]);

  const efx = [
    {
      id: 0,
      title: "Reverb",
      onPress: () => setApplyReverb(!applyReverb),
      image: require("@/assets/images/reverb.png"),
    },
    {
      id: 1,
      title: "Compressor",
      onPress: () => setApplyCompressor(!applyCompressor),
      image: require("@/assets/images/compressor.png"),
    },
    {
      id: 2,
      title: "Syncronize",
      onPress: () => setSync(!sync),
      image: require("@/assets/images/sync.jpg"),
    },
    {
      id: 3,
      title: "Equalizer",
      onPress: () => setApplyEQ(!applyEQ),
      image: require("@/assets/images/equalizer.jpg"),
    },
    {
      id: 4,
      title: "Mix-Tracks",
      onPress: () => handleMix(music, processedVocals ? processedVocals : vocals, trackVolume, vocalsVolume),
      image: require("@/assets/images/mix.jpg"),
    },
    {
      id: 4,
      title: "Master-Track",
      onPress: () => masterTrack(),
      image: require("@/assets/images/mastering.jpg"),
    },
  ];

  async function masterTrack() {}

  const handleMix = async (musicFile, vocalFile, musicVolume, vocalVolume) => {
    try {
      const result = await AudioProcessor.mixMusicAndVocals(
        musicFile,
        vocalFile,
        musicVolume,
        vocalVolume
      );
      if (result) {
        console.log("Mixing results:", result);
        setMix(result);
        const { musicSound: sound } = Audio.Sound.createAsync(
          { uri: result },
          { shouldPlay: false }
        );
      }
    } catch (error) {
      Sentry.captureException(error);
      // console.log(error);
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
            trackVolume={trackVolume}
            setTrackVolume={setTrackVolume}
            pauseTrack={() => handleMusicPause()}
            resumeTrack={() => resumeMusic()}
          />
          <VocalSlider
            isVocalPlaying={isVocalPlaying}
            setIsVocalPlaying={setIsVocalPlaying}
            vocalsVolume={vocalsVolume}
            setVocalsVolume={setVocalsVolume}
            url={processedVocals ? processedVocals : vocals}
            title={title}
            pauseVocals={() => {
              pauseTrack(currentVocals);
              setIsVocalPlaying(false);
              currentTrack.setOnPlaybackStatusUpdate((status) => {
                setVocalPosition(status.positionMillis);
              });
            }}
            resumeVocals={() => {
              resumeTrack(currentVocals, vocalPosition);
              setIsVocalPlaying(true);
            }}
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
        <TouchableOpacity
          onPress={() => {
            setEfxList([]);
            setIsProcessing(false);
            setProcessedVocals(vocals);
          }}
          style={{width: 'auto', height: '5%', backgroundColor: 'red', padding: 5, alignItems: 'center', justifyContent: 'center'}}
        >
          <Text style={{fontSize: 16, fontWeight: '400', color: '#ffffff'}} >Discard-Changes</Text>
        </TouchableOpacity>
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
                  justifyContent: "space-evenly",
                  // gap: 5,
                  borderRadius: 10,
                }}
                onPress={() => e.onPress()}
              >
                <Image
                  source={e.image}
                  style={{
                    width: 40,
                    height: 40,
                    resizeMode: "stretch",
                    borderRadius: 40,
                  }}
                />
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
