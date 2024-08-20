import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from './ThemedText'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Slider from '@react-native-community/slider'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Audio } from 'expo-av'
import WaveForm from './WaveForm'

const VocalSlider = ({url}) => {

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [sound, setSound] = useState();

  const playVocals = async () => {
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

const pauseVocals = async () => {
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
      <ThemedText style={{fontSize: 18, fontWeight: '400', color: 'white', textAlign: 'center'}} >Vocals</ThemedText>
        <View style={{width: '100%', height: "60%", padding: 0, backgroundColor: 'lightgreen', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10}} >
        <View style={{width: '20%', height: '100%', backgroundColor: 'orange', alignItems: 'center', justifyContent: 'center'}} >
        <MaterialIcons name='multitrack-audio' size={30} color={'black'} />
        </View>
        {
          isMusicPlaying ? <Ionicons onPress={() => pauseVocals()} name='pause' size={30} color={'black'} /> : <Ionicons onPress={() => playVocals()} name='play' size={30} color={'black'} />
        }
        <View style={{width: '70%', height: '75%', alignItems: 'center',}} >
       <WaveForm uri={url} />
      <Slider style={{width: '100%', height: '20%', position: 'absolute', bottom: '40%', borderColor: 'blue'}} />
        </View>
        </View>
        
      </View>
  )
}

export default VocalSlider

const styles = StyleSheet.create({})