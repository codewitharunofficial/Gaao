import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Link,
  useGlobalSearchParams,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { TrackControls } from "@/hooks/Context/Karaoke";
import { RecordedTrack } from "@/hooks/Context/Recording";
import PreviewScreen from "./preview";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useThemeColor} from '@/hooks/useThemeColor';

export default function Record() {
  const { title, lyrics, artists, url, coverPhoto } = useLocalSearchParams();

  const [fullScreen, setFullScreen] = useState(false);
  const [saveMusic, setSaveMusic] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [playing, setPlaying] = useState(false);
  const [pause, setPause] = useState(false);
  const { currentSound, setCurrentSound } = useContext(TrackControls);
  const { position, setPosition } = useContext(TrackControls);
  const { recordedTrack, setRecordedTrack } = useContext(RecordedTrack);
  const [isRecording, setIsRecording] = useState(false);
  const { vocals, setVocals } = useContext(RecordedTrack);
  const [finished, setFinished] = useState(false);
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);

  const theme = useThemeColor({light: 'black', dark: 'white'});

  const checkIfAvailable = async () => {
    try {
      const data = await AsyncStorage.getItem(`${title}`);
      if (data) {
        const uri = JSON.parse(data);
        setSaveMusic(uri);
        return true;
      } else {
        console.log("Offline Not Available");
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function downloadMusic() {
    try {
      const isAvailable = await checkIfAvailable();
      console.log(isAvailable);
      if (!isAvailable) {
        const fileUri = `${FileSystem.cacheDirectory}${title}.mp3`;
        const { uri } = await FileSystem.downloadAsync(url, fileUri);
        console.log("Audio File Saved To:", uri);
        await AsyncStorage.setItem(`${title}`, JSON.stringify(uri));
        setSaveMusic(uri);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loadMusic() {
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: saveMusic },
        { shouldPlay: false }
      );
      if (status.isLoaded) {
        setCurrentSound(sound);
      }
      console.log("Song Loaded Successfully");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    downloadMusic();
  }, []);

  useEffect(() => {
    if (saveMusic) {
      loadMusic();
    }
  }, [saveMusic]);

  const autoPlayTrack = async () => {
    try {
      await currentSound.playAsync();
      currentSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.isPlaying) {
          setPlaying(true);
          setPosition(status.positionMillis);
        } else if (status.isLoaded && status.didJustFinish) {
          currentSound.unloadAsync();
          setPlaying(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //maxscreen lyrics
  const handleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  //pause track

  const pauseTrack = async () => {
    try {
      await currentSound.pauseAsync();
      setPlaying(false);
      setPause(true);
    } catch (error) {
      console.log(error);
    }
  };

  const resumeTrack = async () => {
    try {
      console.log(position);
      await currentSound.playFromPositionAsync(position);
    } catch (error) {
      console.log(error);
    }
  };

  //asking for permission to record audio
  const getAudioPermissions = async () => {
    try {
      const { granted } = await permissionResponse;
      if (!granted) {
        await requestPermission();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAudioPermissions();
  }, [permissionResponse]);

  //For Recording Audio

  const singAlong = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting Recording...");
      setIsRecording(true);
      autoPlayTrack();
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecordedTrack(recording);

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isRecording) {
          console.log(status.durationMillis);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const stopSinging = async () => {
    try {
      await recordedTrack.stopAndUnloadAsync();
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setPlaying(false);
      setIsRecording(false);
      const uri = recordedTrack.getURI();

      if (uri) {
        const fileUri = `${
          FileSystem.documentDirectory
        }${title}_vocals${Math.floor(Math.random() * 10)}.mp3`;
        await FileSystem.moveAsync({ from: uri, to: fileUri });
        setVocals(fileUri);
        console.log("Vocals Saved at:", fileUri);
      }

      setFinished(true);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    setProcessedVocals(null);
  }, []);

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        <View
          style={{
            width: "90%",
            height: "30%",
            display: fullScreen ? "none" : "flex",
            flexDirection: "row",
            justifyContent: "center",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "lightblue",
          }}
        >
          {coverPhoto ? (
            <Image source={{ uri: coverPhoto }} style={styles.reactLogo} />
          ) : (
            <Image
              source={require("@/assets/images/newly-added.webp")}
              style={styles.reactLogo}
            />
          )}
        </View>
        <ScrollView
          scrollEnabled
          style={{
            width: "90%",
            height: "40%",
            backgroundColor: "lightblue",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 20,
          }}
        >
          <SimpleLineIcons
            onPress={() => {
              handleFullScreen();
            }}
            name="size-fullscreen"
            size={20}
            color={"white"}
            style={{ position: "absolute", right: 0, top: 0 }}
          />
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              lineHeight: 52,
              margin: 15,
            }}
          >
            {lyrics}
          </Text>
        </ScrollView>
        <View
          style={{
            width: "90%",
            height: "15%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {playing ? (
            <TouchableOpacity
              onPress={() => {
                pauseTrack();
              }}
              style={{
                width: "30%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: StyleSheet.hairlineWidth,
                borderRightColor: "black",
              }}
            >
              <Ionicons name="pause" size={40} color={theme} />
              <Text style={{ color: theme }}>Pause</Text>
            </TouchableOpacity>
          ) : finished ? (<TouchableOpacity
            onPress={ async () => {await currentSound.setPositionAsync(0); await recordedTrack.stopAndUnloadAsync(); setFinished(false)}}
            style={{
              width: "30%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRightWidth: StyleSheet.hairlineWidth,
              borderRightColor: "black",
            }}
          >
            <Ionicons name="reload-circle-outline" size={40} color={theme} />
            <Text style={{ color: "white" }}>Reset?</Text>
          </TouchableOpacity>) : (
            <TouchableOpacity
              onPress={() => {
                pause ? resumeTrack() : autoPlayTrack();
              }}
              style={{
                width: "30%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRightWidth: StyleSheet.hairlineWidth,
                borderRightColor: "black",
              }}
            >
              <Ionicons name="play" size={40} color={theme} />
              <Text style={{ color: "white" }}>Play</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              isRecording ? stopSinging() : singAlong();
            }}
            style={{
              width: "30%",
              height: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "black",
              borderRadius: 60,
              backgroundColor: isRecording ? "red" : "lightgreen",
            }}
          >
            <Entypo name="modern-mic" size={50} color={"black"} />
            <Text style={{ color: "black" }}>
              {isRecording ? "Finish" : "Start"}
            </Text>
          </TouchableOpacity>
          <Link
            href={{
              pathname: "/screens/preview",
              params: {
                vocals: vocals,
                music: saveMusic,
                coverPhoto: coverPhoto,
                title: title,
                artists: artists,
              },
            }}
            asChild
          >
            <TouchableOpacity
              style={{
                width: "30%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {finished ? (
                <MaterialIcons name="preview" size={40} color={theme} />
              ) : (
                <Ionicons name="musical-note" size={40} color={theme} />
              )}
              <Text style={{ color: theme }}>
                {finished ? "Preview" : "Key"}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  reactLogo: {
    height: "90%",
    width: "100%",
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "white",
    resizeMode: "contain",
  },
});
