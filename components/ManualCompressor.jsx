import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

const ManualCompressor = ({ onApplyCompressor, vocals, title, values }) => {
    const [ratio, setRatio] = useState(1);
    const [attack, setAttack] = useState(0);
    const [threshold, setThreshold] = useState(10);
    const [release, setRelease] = useState(0);
    const [makeupGain, setMakeUpGain] = useState(0);
    const [applyEfx, setApplyEfx] = useState(false);

    const compressorSettings = {
        ratio,
        attack,
        threshold,
        release,
        makeupGain
    };

    useEffect(() => {

        const applyCompressor = async () => {
            const outputFilePath =  `${FileSystem.cacheDirectory}${title}${Math.floor(Math.random())}.wav`;

            onApplyCompressor(vocals, outputFilePath, compressorSettings);
        };
        if(applyEfx){
            applyCompressor();
        }
        setApplyEfx(false);
    }, [applyEfx]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Ratio</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={values.ratio}
                onSlidingComplete={value => {setRatio(value); setApplyEfx(true)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Threshold</Text>
            <Slider
                style={styles.slider}
                minimumValue={-20}
                maximumValue={30}
                value={values.threshold}
                onSlidingComplete={value => {setThreshold(value); setApplyEfx(true)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Attack</Text>
            <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={50}
                value={values.attack}
                onSlidingComplete={value => {setAttack(value); setApplyEfx(true)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Release</Text>
            <Slider
                style={styles.slider}
                minimumValue={50}
                maximumValue={500}
                value={values.release}
                onSlidingComplete={value => {setRelease(value); setApplyEfx(true)}}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
            <Text style={styles.label}>Make-Up-Gain</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                value={values.makeupGain}
                onSlidingComplete={value => {setMakeUpGain(value); setApplyEfx(true)}}
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
