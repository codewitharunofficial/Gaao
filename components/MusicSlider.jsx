import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from './ThemedText'
import Feather from '@expo/vector-icons/Feather'
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';

const MusicSlider = ({title, url}) => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [position, setPosition] = useState(0);
    const [sound, setSound] = useState();

    const playMusic = async () => {
        try {
            const {sound, status} = await Audio.Sound.createAsync({uri: url});
             await sound.playAsync();
             setIsMusicPlaying(true);
             setSound(sound);
    
             async function unload(status) {
               try {
                if(status.didJustFinish){
                  await sound.unloadAsync();
                  setIsMusicPlaying(false);
                }
               } catch (error) {
                console.log(error)
               }
             }
    
            sound.setOnPlaybackStatusUpdate((status) => {
              if(status.didJustFinish){
                unload(status);
              }
             })
        } catch (error) {
            console.log(error);
        }
    }
    
    const pauseMusic = async () => {
      try {
        await sound.pauseAsync();
        setIsMusicPlaying(false);
        setIsPaused(true);
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <View style={{flex: 0.5, width: '90%', borderRadius: 10, padding: 10, flexDirection: 'column', gap: 10 }} >
      <ThemedText style={{fontSize: 18, fontWeight: '400', color: 'white', textAlign: 'center'}} >{title}</ThemedText>
        <View style={{width: '100%', height: "60%", padding: 0, backgroundColor: 'purple', borderRadius: 10, flexDirection: 'row', alignItems: 'center'}} >
      <View style={{width: '20%', height: '100%', backgroundColor: 'orange', alignItems: 'center', justifyContent: 'center'}} >
      <Feather name="mic" size={30} color={'white'} />
      </View>
      {
          isMusicPlaying ? <Ionicons onPress={() => pauseMusic()} name='pause' size={30} color={'black'} /> : <Ionicons onPress={() => playMusic()} name='play' size={30} color={'black'} />
        }
      <Slider style={{width: '90%', height: '20%'}} />
        </View>
        
      </View>
  )
}

export default MusicSlider

const styles = StyleSheet.create({})