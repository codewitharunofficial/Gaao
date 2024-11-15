import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";

const ManualReverb = ({ onApplyReverb, vocals, title, values }) => {
  const [delay, setDelay] = useState(50);
  const [decay, setDecay] = useState(10);
  const [wetLevel, setWetLevel] = useState(50);
  const [dryLevel, setDryLevel] = useState(50);
  const [applyEfx, setApplyEfx] = useState(false);

  const reverbSettings = {
    delay,
    decay,
    wetLevel,
    dryLevel,
  };

  useEffect(() => {
    const applyReverb = async () => {
      const outputFilePath = `${FileSystem.cacheDirectory}${title}${Math.floor(
        Date.now()
      )}.wav`;

      onApplyReverb(vocals, outputFilePath, reverbSettings);
    };
    if (applyEfx) {
      applyReverb();
    }
    setApplyEfx(false);
  }, [applyEfx]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Delay</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={values.room_size}
        onSlidingComplete={(value) => {
          setDelay(value);
          setApplyEfx(true);
        }}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />
      <Text style={styles.label}>Decay</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={values.decay}
        onSlidingComplete={(value) => {
          setDecay(value);
          setApplyEfx(true);
        }}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />
      <Text style={styles.label}>Wet Level</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={values.wet}
        onSlidingComplete={(value) => {
          setWetLevel(value);
          setApplyEfx(true);
        }}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />
      <Text style={styles.label}>Dry Level</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={values.dry}
        onSlidingComplete={(value) => {
          setDryLevel(value);
          setApplyEfx(true);
        }}
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
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});

export default ManualReverb;
