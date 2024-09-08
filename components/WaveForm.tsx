import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {Waveform, type IWaveformRef} from '@simform_solutions/react-native-audio-waveform';
import { Visualizer } from '@/hooks/Context/WaveForm';

const WaveForm = ({uri,}) => {

const path = uri;
const ref = useRef<IWaveformRef>(null);

const {vocalsWave, setVocalsWave} = useContext(Visualizer);
const {musicWave, setMusicWave} = useContext(Visualizer);

  return (
    <View style={{width: '90%',}} >
      <Waveform mode='static' ref={ref} path={uri} candleSpace={2} candleWidth={4} candleHeightScale={10} scrubColor='gray' waveColor='white' onPanStateChange={isMoving => console.log(isMoving)} onError={error => console.log(error)} onPlayerStateChange={state => console.log(state)} />
    </View>
  )
}

export default WaveForm

const styles = StyleSheet.create({})