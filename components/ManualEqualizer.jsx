import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';

const ManualEqualizer = ({ onApplyEqualizer, vocals, title }) => {
    const [bassGain, setBassGain] = useState(1);
    const [treble, setTreble] = useState(8);
    const [midGain, setMidGain] = useState(3);
    const [applyEfx, setApplyEfx] = useState(false);

    const eqSettings = {
        bassGain,
        treble,
        midGain,
    };

    useEffect(() => {

        const applyEQ = async () => {
            const outputFilePath =  `${FileSystem.cacheDirectory}${title}${Date.now()}.wav`;

            onApplyEqualizer(vocals, outputFilePath, eqSettings);
        };
        if(applyEfx){
            applyEQ();
        }
        setApplyEfx(false);
    }, [applyEfx]);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Bass-Gain</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={bassGain}
                onSlidingComplete={value => {setBassGain(value); setApplyEfx(true)}}
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
                onSlidingComplete={value => {setMidGain(value); setApplyEfx(true)}}
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
                onSlidingComplete={value => {setTreble(value); setApplyEfx(true)}}
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
