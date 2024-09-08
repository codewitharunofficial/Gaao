import { Image, StyleSheet, Platform, Button, TouchableOpacity, ScrollView, SafeAreaView, View, PermissionsAndroid, Linking, Alert } from 'react-native';
import WelcomeScreen from '@/components/Welcome';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useContext, useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import ShortcutStrips from '@/components/ShortcutStrips';
import axios from 'axios'
import TrackCard from '@/components/TrackCard';
import { Auth } from '@/hooks/Context/User';
import * as MediaLibrary from 'expo-media-library';
import * as Updates from 'expo-updates';
import { checkForUpdates } from '@/constants/updates';
import LoadingScreen from '@/components/LoadingScreen';
import { useUpdates } from 'expo-updates';
import Toast from "react-native-simple-toast"
import UpdatesModal from '@/components/Models/UpdatesModal';



export default function HomeScreen() {

  const {user} = useContext(Auth);
  // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const {currentlyRunning, isUpdateAvailable, isUpdatePending} = useUpdates();

  const visible = isUpdateAvailable;

  useEffect(() => {
    if(isUpdatePending){
      Updates.reloadAsync();
    }
  },[isUpdatePending]);


  async function askPermissions(){
    try {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if(status !== 'granted'){
        Alert.alert('Permissions Required!', "Gaao needs to access your media library to save files");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getPermissions(){
    const {status} = await MediaLibrary.getPermissionsAsync();
    if(status === 'granted'){
      Toast.show("Permssions Granted", 2000);
      return true
    } else {
      Toast.show("Asking Permssions...!", 3000);
      return askPermissions();
    }
  }

  useEffect(() => {getPermissions()},[]);
  // const [userType, setUserType] = useState("Old");
  const [tracks, setTracks] = useState([]);

  const getKaraokes = async () => {
    try {
    const {data} = await axios.get(`${process.env.EXPO_PUBLIC_URL}/api/v1/karaoke/get-tracks`);
    if(data && data?.success){
      setTracks(data.tracks);
    }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getKaraokes();
  }, []);

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}} >
      <View style={{width: '100%', height: '100%', paddingHorizontal: 10}} >
        <Image
          source={require('@/assets/images/newly-added.webp')}
          style={styles.reactLogo}
        />
        <ThemedView style={{width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'white'}} >
          <ShortcutStrips title={"Favourites"} icon={"heart"} color={'black'} />
          <ShortcutStrips title={"Recorded"} icon={'mic'} color={''} />
        </ThemedView>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width: '100%', height: 'auto', flexDirection: 'column', gap: 15, alignItems: 'center'}} >
        {
          tracks.length > 0 ? (
            tracks.map((track, idx) => (
              <TrackCard key={idx} title={track.title} coverPhoto={track?.karaokeCoverPhoto ? track.karaokeCoverPhoto.secure_url : null} artists={track.artists} lyrics ={track.lyrics} url={track.track.secure_url} duration={track.track.duration} format={track.track.format} />
            ))
          ) : (
            <LoadingScreen />
          )
        }
        </ScrollView>
        <UpdatesModal visible={visible} />
        
    </View>
      </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    height: '30%',
    width: '100%',
    marginBottom: '2%',
    marginTop: '5%'
  },
});
