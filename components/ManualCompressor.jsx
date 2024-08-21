import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

const ManualCompressor = ({ onApplyCompressor, vocals, title }) => {
    const [ratio, setRatio] = useState(1);
    const [attack, setAttack] = useState(8);
    const [threshold, setThreshold] = useState(3);
    const [release, setRelease] = useState(0);
    const [makeupGain, setMakeUpGain] = useState(0);

    const compressorSettings = {
        ratio,
        attack,
        threshold,
        release,
        makeupGain
    };

    // useEffect(() => {

    //     const applyReverb = async () => {
    //         const outputFilePath =  `${FileSystem.cacheDirectory}${title}${Math.floor(Math.random())}.wav`;

    //         onApplyReverb(vocals, outputFilePath, reverbSettings);
    //     };
    //     applyReverb();
    // }, [dryLevel, damping, roomSize, wetLevel]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Ratio</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={ratio}
                onValueChange={value => {setRatio(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Threshold</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={threshold}
                onValueChange={value => {setThreshold(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Attack</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={attack}
                onValueChange={value => {setAttack(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Release</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={release}
                onValueChange={value => {setRelease(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Make-Up-Gain</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={makeupGain}
                onValueChange={value => {setMakeUpGain(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        width: '100%',
        height: '100%'
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    slider: {
        width: '100%',
        height: 40,
        
    },
});

export default ManualCompressor;
