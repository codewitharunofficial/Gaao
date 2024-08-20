import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import VocalSlider from '@/components/VocalSlider';
import MusicSlider from '@/components/MusicSlider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';


const PreviewScreen = () => {

  const {vocals, music, coverPhoto, title, artists} = useLocalSearchParams();

  const playMix = async () => {
    try {
      
    } catch (error) {
      
    }
  }


  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      <ThemedView style={{width: '100%', height: '100%', flexDirection: 'column', alignItems: 'center'}} >
        <View style={{width: '100%', height: '45%', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'white', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 10}} >
      <MusicSlider url={music} title={title} />
      <VocalSlider url={vocals} />
        </View>
        <Ionicons onPress={() => {}} name='play' size={40} color={'white'} />
      </ThemedView>
    </SafeAreaView>
  )
}

export default PreviewScreen

const styles = StyleSheet.create({})