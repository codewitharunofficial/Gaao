import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";

const ManualSync = ({ onApplySync, vocals, title, setSync }) => {
  const [delay, setDelay] = useState(0);
  const [currentDelayValue, setCurrentDelayValue] = useState(0);
  const [applyManualFx, setApplyManualFx] = useState(false);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const [applyEfx, setApplyEfx] = useState(false);
  const { efxList, setEfxList } = useContext(EfxControls);
  const { appliedEfx, setAppliedEfx } = useContext(EfxControls);
  const { currentEfx, setCurrentEfx } = useContext(EfxControls);

  useEffect(() => {

      const applySync = async () => {
          const outputFilePath =  `${FileSystem.cacheDirectory}${title}${Date.now()}.wav`;

          onApplySync(vocals, outputFilePath, delay);
      };
      if(applyManualFx){
          applySync();
      }
  }, [delay, applyManualFx]);

  console.log(delay);

  const efx = {
    type: "Sync",
    preset: currentEfx ? currentEfx : null,
    values: []
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Delay-in-seconds</Text>
      <View style={[styles.container, {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}]} >
      <Slider
        style={styles.slider}
        minimumValue={-1}
        maximumValue={1}
        value={delay}
        onSlidingComplete={(value) => {
          setDelay(value);
          setApplyManualFx(true);
        }}
        onValueChange={(value) => {
          setCurrentDelayValue(value);
        }}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#000"
        thumbTintColor="#b9e4c9"
      />
      <Text>{currentDelayValue}s</Text>
      </View>
      <TouchableOpacity onPress={() => {efxList.push(efx); setApplyEfx(false); setIsProcessing(true); setSync(false)}} style={{width: '20%', height: '30%', backgroundColor: '#8E2DE2', borderRadius: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end'}} >
         <Text style={{fontSize: 12, fontWeight: 'bold', color: 'white'}} >Apply-Changes</Text>
     </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // backgroundColor: "#fff",
    width: "100%",
    height: "auto",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
  },
  slider: {
    width: "80%",
    height: 40,
  },
});

export default ManualSync;
