import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";

const ManualSync = ({ onApplySync, vocals, title, setSync }) => {
  const [delay, setDelay] = useState(0);
  const [applyManualFx, setApplyManualFx] = useState(false);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const [applyEfx, setApplyEfx] = useState(false);
  const { efxList, setEfxList } = useContext(EfxControls);
  const { appliedEfx, setAppliedEfx } = useContext(EfxControls);
  const { currentEfx, setCurrentEfx } = useContext(EfxControls);

  useEffect(() => {

      const applySync = async () => {
          const outputFilePath =  `${FileSystem.cacheDirectory}${title}${Math.floor(Math.random())}.wav`;

          onApplySync(vocals, outputFilePath, delay,);
      };
      if(applyManualFx){
          applySync();
      }
  }, [delay, applyManualFx]);

  const efx = {
    type: "Reverb",
    preset: currentEfx,
    values: []
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Delay-in-seconds</Text>
      <Slider
        style={styles.slider}
        minimumValue={-3}
        maximumValue={3}
        value={delay}
        onValueChange={(value) => {
          setDelay(value);
          setApplyManualFx(true);
        }}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
      />
      <TouchableOpacity onPress={() => {efxList.push(efx); setApplyEfx(false); setIsProcessing(true); setSync(false)}} style={{width: '20%', height: '10%', backgroundColor: 'green', position: 'absolute', bottom: 10, right: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}} >
         <Text style={{fontSize: 12, fontWeight: 'bold', color: 'black'}} >Apply-Changes</Text>
     </TouchableOpacity>
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

export default ManualSync;