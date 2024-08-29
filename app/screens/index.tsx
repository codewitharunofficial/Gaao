import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  Link,
  useLocalSearchParams,
} from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { TrackControls } from "@/hooks/Context/Karaoke";
import { RecordedTrack } from "@/hooks/Context/Recording";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NativeModules } from "react-native";
import LoadingScreen from "@/components/LoadingScreen";

export default function Record() {
  const { title, lyrics, artists, url, coverPhoto, format } = useLocalSearchParams();

  const [fullScreen, setFullScreen] = useState(false);
  const [saveMusic, setSaveMusic] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [playing, setPlaying] = useState(false);
  const [pause, setPause] = useState(false);
  const { currentSound, setCurrentSound } = useContext(TrackControls);
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const { position, setPosition } = useContext(TrackControls);
  const { recordedTrack, setRecordedTrack } = useContext(RecordedTrack);
  const [isRecording, setIsRecording] = useState(false);
  const { vocals, setVocals } = useContext(RecordedTrack);
  const [finished, setFinished] = useState(false);
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordedMusic, setRecordedMusic] = useState();
  const {AudioProcessor} = NativeModules;
  const [loading, setLoading] = useState(false);

  const theme = useThemeColor({ light: "black", dark: "white" });


  const checkIfAvailable = async () => {
    try {
      const data = await AsyncStorage.getItem(`${title}`);
      if (data) {
        const uri = JSON.parse(data);
        // const asset = await MediaLibrary.createAssetAsync(uri);
        // const ifAlbum = await MediaLibrary.getAlbumAsync("Gaao");
        // if(ifAlbum !== null){
        //   await MediaLibrary.addAssetsToAlbumAsync([asset], ifAlbum, false);
        //   console.log("Adding file to Gaao");
        // } else {
        //   const gaao = await MediaLibrary.createAlbumAsync("Gaao", asset, false);
        //   console.log("No Directory Found, Creating Gaao...")

        // }

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
        const fileUri = `${FileSystem.documentDirectory}${title}.${format}`;
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
      setIsLoaded(true);
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
          setEndPosition(status.positionMillis);
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
      setStartPosition(position);
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
      setStartPosition(0);
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
        }${title}recording_${Date.now()}.wav`;
        await FileSystem.moveAsync({ from: uri, to: fileUri });
        setVocals(fileUri);
        console.log("Vocals Saved at:", fileUri);
      }
      setLoading(true);

      if(uri){
        const outPutFilePAth = `${FileSystem.documentDirectory}_trimmed_${title}${Date.now()}.wav`;

      const music = await AudioProcessor.trimAudio(saveMusic, outPutFilePAth, startPosition, endPosition );
      if(music){
        setRecordedMusic(music);
        setLoading(false);
      }
      }

      setFinished(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setProcessedVocals(null);
  }, []);

  // useEffect(() => {
  //    createDirectories();
  // }, [])

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
              }}
            >
              <Ionicons name="pause" size={40} color={theme} />
              <Text style={{ color: theme }}>Pause</Text>
            </TouchableOpacity>
          ) : finished ? (
            <TouchableOpacity
              onPress={async () => {
                setFinished(false);
                await currentSound.stopAsync();
                await recordedTrack.stopAndUnloadAsync();
                setRecordedTrack();
              }}
              style={{
                width: "30%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="reload-circle-outline" size={40} color={theme} />
              <Text style={{ color: theme }}>Reset?</Text>
            </TouchableOpacity>
          ) : (
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
              }}
            >
              <Ionicons name="play" size={40} color={theme} />
              <Text style={{ color: theme }}>Play</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            disabled={isLoaded ? false : true}
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
                music: recordedMusic,
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
        <LoadingScreen visible={loading} />
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
