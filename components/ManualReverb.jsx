import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

const ManualReverb = ({ onApplyReverb, vocals, title }) => {
    const [roomSize, setRoomSize] = useState(50);
    const [damping, setDamping] = useState(50);
    const [wetLevel, setWetLevel] = useState(50);
    const [dryLevel, setDryLevel] = useState(50);

    const reverbSettings = {
        roomSize,
        damping,
        wetLevel,
        dryLevel
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
            <Text style={styles.label}>Room Size</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={roomSize}
                onValueChange={value => {setRoomSize(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Damping</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={damping}
                onValueChange={value => {setDamping(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Wet Level</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={wetLevel}
                onValueChange={value => {setWetLevel(value)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Dry Level</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={dryLevel}
                onValueChange={value => {setDryLevel(value)}}
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

export default ManualReverb;
