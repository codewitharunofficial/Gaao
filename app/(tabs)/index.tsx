import { Image, StyleSheet, Platform, Button, TouchableOpacity, ScrollView, SafeAreaView, View } from 'react-native';
import WelcomeScreen from '@/components/Welcome';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useContext, useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import ShortcutStrips from '@/components/ShortcutStrips';
import axios from 'axios'
import TrackCard from '@/components/TrackCard';
import { Auth } from '@/hooks/Context/User';
import LoadingScreen from '@/components/Loading';


export default function HomeScreen() {

  const {user} = useContext(Auth);

  

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
    tracks.length === 0 ? (
      <LoadingScreen />
    ) : (
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
          tracks.length > 0 && (
            tracks.map((track, idx) => (
              <TrackCard key={idx} title={track.title} coverPhoto={track?.karaokeCoverPhoto ? track.karaokeCoverPhoto.secure_url : null} artists={track.artists} lyrics ={track.lyrics} url={track.track.secure_url} duration={track.track.duration} />
            ))
          )
        }
        </ScrollView>
        
    </View>
      </SafeAreaView>
    )
    
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
