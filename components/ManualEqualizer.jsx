import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

const ManualEqualizer = ({ onApplyEqualizer, vocals, title }) => {
    const [bassGain, setBassGain] = useState(1);
    const [treble, setTreble] = useState(8);
    const [midGain, setMidGain] = useState(3);

    const eqSettings = {
        bassGain,
        treble,
        midGain,
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
            <Text style={styles.label}>Bass-Gain</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={bassGain}
                onValueChange={value => {setBassGain(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Mid-Gain</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={midGain}
                onValueChange={value => {setMidGain(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Treble-Gain</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={treble}
                onValueChange={value => {setTreble(value)}}
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

export default ManualEqualizer;
