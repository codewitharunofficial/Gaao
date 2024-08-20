import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {Waveform, type IWaveformRef} from '@simform_solutions/react-native-audio-waveform';

const WaveForm = ({uri}) => {

const path = uri;
const ref = useRef<IWaveformRef>(null);

  return (
    <View style={{width: '100%',}} >
      <Waveform mode='static' ref={ref} path={uri} candleSpace={2} candleWidth={4} candleHeightScale={10} scrubColor='white' waveColor='white' onPlayerStateChange={(playerState) => console.log(playerState)} onPanStateChange={isMoving => console.log(isMoving)} onError={error => console.log(error)} />
    </View>
  )
}

export default WaveForm

const styles = StyleSheet.create({})