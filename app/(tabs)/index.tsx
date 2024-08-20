import { Image, StyleSheet, Platform, Button, TouchableOpacity } from 'react-native';
import WelcomeScreen from '@/components/Welcome';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import ShortcutStrips from '@/components/ShortcutStrips';
import axios from 'axios'
import TrackCard from '@/components/TrackCard';

export default function HomeScreen() {

  const [userType, setUserType] = useState("Old");
  const [tracks, setTracks] = useState([]);

  const getKaraokes = async () => {
    try {
    //   const response = await fetch('http://192.168.43.224:6969/api/v1/karaoke/get-tracks');
    // console.log(response);
    const {data} = await axios.get('http://192.168.43.224:6969/api/v1/karaoke/get-tracks');
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
    userType === "New" ? (
      <WelcomeScreen />
    ) : (
      <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/newly-added.webp')}
          style={styles.reactLogo}
        />
      }>
        <ThemedView style={{width: '100%', height: 100, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'white'}} >
          <ShortcutStrips title={"Favourites"} icon={"heart"} color={'black'} />
          <ShortcutStrips title={"Recorded"} icon={'mic'} color={''} />
        </ThemedView>
        {
          tracks.length > 0 && (
            tracks.map((track, idx) => (
              <TrackCard key={idx} title={track.title} coverPhoto={track?.karaokeCoverPhoto ? track.karaokeCoverPhoto.secure_url : null} artists={track.artists} lyrics ={track.lyrics} url={track.track.secure_url} duration={track.track.duration} />
            ))
          )
        }
    </ParallaxScrollView>
    )
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
