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
import { Link, useLocalSearchParams } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useContext, useEffect, useState } from "react";
import { Audio } from "expo-av";
import { TrackControls } from "@/hooks/Context/Karaoke";
import { RecordedTrack } from "@/hooks/Context/Recording";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NativeModules } from "react-native";
import LoadingScreen from "@/components/LoadingScreen";
import Toast from "react-native-simple-toast";
import * as MediaLibrary from "expo-media-library";
import * as Sentry from "@sentry/react-native";
import RNFS from 'react-native-fs';
// import { NativeModules } from "expo-modules-core";

export default function Record() {
  const { title, lyrics, artists, url, coverPhoto, format } =
    useLocalSearchParams();
    const {StoragePermissionModule} = NativeModules;

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
  const { AudioProcessor } = NativeModules;
  const [loading, setLoading] = useState(false);
  const [isPemrission, setIsPermission] = useState(false);

  const theme = useThemeColor({ light: "white", dark: "white" });
  const themedBg = useThemeColor({ light: "#8E2DE2", dark: "#000" });
  const buttonColorIn = useThemeColor({ dark: "#E9C46A", light: "#F4A261" });


  // async function askPermission(){
  //   try {
  //     const hasPermission = await StoragePermissionModule.checkStoragePermission();
  //     console.log( "Permissions:", hasPermission);
  //     if(!hasPermission){
  //       const perm = await StoragePermissionModule.requestStoragePermission();
  //       console.log("Asked Permissions", perm);
  //       if(perm){
  //         Toast.show("Permissions Approved", 3000);
  //         return true
  //       } else {
  //         Toast.show("Please Give Storage Permissions", 2000);
  //         return false;
  //       }
  //     } else {
  //       Toast.show("Permissions Given Already", 3000);
  //       return true;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // } 

  // useEffect(() => {
  //   // getPermission();
  //   //askPermission();
  //   Toast.show(`File is in ${format}`, 3000);
  // }, []);

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
      Toast.show(error.message, 2000);
      Sentry.captureException(error);
    }
  };

  // const options = {};

  async function downloadMusic() {
    try {
     const musicUrl = url;
     const filePath = `${RNFS.CachesDirectoryPath}_audio_${Date.now()}`;
     
     const result = await RNFS.downloadFile({fromUrl: url, toFile: filePath}).promise;
     console.log("File Saved At: ", filePath);
     console.log(result.statusCode);
     if(result.statusCode === 200){
       Toast.show(`File Saved at: ${filePath}`, 2000);
       setSaveMusic(filePath);
     } else {
      Toast.show("Error Downloading the track...!", 2000);
     }
    } catch (error) {
     console.log(error);
     Toast.show(error.message, 2000);
    }
  }

  // async function downloadMusic() {
  //   try {
  //     const isAvailable = await checkIfAvailable();
  //     if (!isAvailable) {
  //       const fileUri = `${FileSystem.documentDirectory}_${Date.now()}.${format}`;
  //       console.log("File URI:", fileUri);
  //       const { uri } = await FileSystem.downloadAsync(url, fileUri, {
  //         headers: {
  //           Authorization: "Bearer token",
  //         },
  //         md5: true,
  //         cache: true,
  //       });
  //       console.log(`Saved URI:`, uri);
  //       if (uri) {
  //         await AsyncStorage.setItem(`${title}`, JSON.stringify(uri));
  //         setSaveMusic(uri);
  //       } else {
  //         Toast.show("Download Failed", 2000);
  //       }
  //     } else {
  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     Toast.show(error.message, 2000);
  //     Sentry.captureException(error);
  //   }
  // }

  async function loadMusic() {
    try {
      Toast.show("Loading the Song...!", 2000);
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
      Toast.show(error.message, 3000);
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
      const status = permissionResponse?.status;
      if (status !== 'granted') {
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
          FileSystem.cacheDirectory
        }${Date.now()}_recording_.wav`;
        await FileSystem.moveAsync({ from: uri, to: fileUri });
        setVocals(fileUri);
        console.log("Vocals Saved at:", fileUri);
      }
      setLoading(true);

      if (uri) {
        const outPutFilePAth = `${
          FileSystem.cacheDirectory
        }_trimmed_${Date.now()}.${format}`;
        console.log(outPutFilePAth);
        const music = await AudioProcessor.trimAudio(
          saveMusic,
          outPutFilePAth,
          startPosition,
          endPosition
        );
        if (music) {
          setRecordedMusic(music);
          setLoading(false);
        }
      }
      setFinished(true);
    } catch (error) {
      console.log(error);
      Toast.show(error.message, 3000);
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
    <SafeAreaView style={{ width: "100%", height: "100%", paddingTop: "5%" }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
          backgroundColor: themedBg,
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
          showsVerticalScrollIndicator={false}
          style={{
            width: "90%",
            height: "30%",
            backgroundColor: "#4CC9F0",
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
              <Ionicons name="pause" size={40} color={buttonColorIn} />
              <Text style={{ color: theme }}>Pause</Text>
            </TouchableOpacity>
          ) : finished ? (
            <TouchableOpacity
              onPress={async () => {
                setFinished(false);
                await currentSound.stopAsync();
                setRecordedTrack(null);
                // setRecordedTrack();
              }}
              style={{
                width: "30%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="reload-circle-outline"
                size={30}
                color={buttonColorIn}
              />
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
              <Ionicons name="play" size={30} color={buttonColorIn} />
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
              borderColor: "black",
              borderRadius: 60,
              backgroundColor: !saveMusic
                ? "gray"
                : isRecording
                ? "lightyellow"
                : themedBg,
            }}
          >
            <FontAwesome5
              name="microphone-alt"
              size={60}
              color={buttonColorIn}
            />
            <Text style={{ color: theme }}>
              {isRecording ? "Finish" : !saveMusic ? "Loading" : "Start"}
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
                <MaterialIcons name="preview" size={30} color={buttonColorIn} />
              ) : (
                <Ionicons name="musical-note" size={30} color={buttonColorIn} />
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
