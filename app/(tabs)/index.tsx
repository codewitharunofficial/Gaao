import {
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  View,
  Dimensions} from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import ShortcutStrips from "@/components/ShortcutStrips";
import axios from "axios";
import TrackCard from "@/components/TrackCard";
import { Auth } from "@/hooks/Context/User";
import LoadingScreen from "@/components/LoadingScreen";
import { useUpdates } from "expo-updates";
import UpdatesModal from "@/components/Models/UpdatesModal";
import ManageExternalStorage from "react-native-manage-external-storage";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import Toast from 'react-native-simple-toast';
import { askForPermissions, getPermissions } from "@/constants/permissions";
import RecentlyUpdated from "@/components/RecentlyUpdated";

export default function HomeScreen() {
  const { user } = useContext(Auth);
  const [result, setResult] = useState(false);
  const { currentlyRunning, isUpdateAvailable } = useUpdates();
  const visible = isUpdateAvailable;

  const defaultHeadImage = require('@/assets/images/newly-added.webp');

  const themedBg = useThemeColor({ light: "#F3F4F6", dark: "#0B090A" });
  const {width, height} = Dimensions.get('window');

  async function AskPermission() {
    await ManageExternalStorage?.checkAndGrantPermission(
      (err) => {
        console.error(err);
      },
      (res) => {
        Toast.show("Permission Given and Processed", 3000);
        AsyncStorage.setItem("manageStorage", "true");
      }
    );
  }

  useEffect(() => {
    // promptForPermissions();
    AskPermission();
  }, []);

  const checkAndGetPermissions = async () => {
    try {
      const perm = await getPermissions();
      if(!perm) {
        askForPermissions();
      } else {
        console.log("Permissions Granted");
        Toast.show("Permissions Granted!!", 2000);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if( !__DEV__){
      Sentry.init({dsn: 'https://3c6b1f8ee046baa4a0c3cc868c622511@o4507971240329216.ingest.us.sentry.io/4507971249504256', tracesSampleRate: 1.0, _experiments: {
        profileSampleRate: 1.0
      }});
    }
  });

  const [tracks, setTracks] = useState([]);

  const getKaraokes = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_URL}/api/v1/karaoke/get-tracks`
      );
      if (data && data?.success) {
        setTracks(data.tracks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getKaraokes();
  }, []);

  return (
    <SafeAreaView style={{ width: "100%", height: "100%", marginTop: "5%" }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: themedBg,
          paddingBottom: "5%",
        }}
      >
        {
          tracks?.length > 0 ? (

            <Image
              source={{uri: tracks[0]?.karaokeCoverPhoto.secure_url}}
              style={styles.reactLogo}
              resizeMode="stretch"
            />
          ) : (
            <Image
              source={defaultHeadImage}
              style={styles.reactLogo}
              resizeMode="stretch"
            />
          )
        }
        {/* <RecentlyUpdated tracks={tracks} width={width * 0.3} /> */}
        <ThemedView
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            justifyContent: "space-around",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "white",
            alignItems: "center",
            backgroundColor: themedBg,
          }}
        >
          <ShortcutStrips title={"Favourites"} icon={"heart"} color={"black"} />
          <ShortcutStrips title={"Recorded"} icon={"mic"} color={""} />
        </ThemedView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: "100%",
            height: "auto",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          {tracks.length > 0 ? (
            tracks.map((track, idx) => (
              <TrackCard
                key={idx}
                title={track.title}
                coverPhoto={
                  track?.karaokeCoverPhoto
                    ? track.karaokeCoverPhoto.secure_url
                    : null
                }
                artists={track.artists}
                lyrics={track.lyrics}
                url={track.track.secure_url}
                duration={track.track.duration}
                format={track.track.format}
              />
            ))
          ) : (
            <LoadingScreen />
          )}
        </ScrollView>
        <UpdatesModal visible={visible} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: "30%",
    width: "100%",
    marginBottom: "2%",
    marginTop: "5%",
  },
});
