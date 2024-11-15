import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { RecordedTrack } from "../hooks/Context/Recording";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Picker } from "@react-native-picker/picker";
import ManualCompressor from "./ManualCompressor";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";

const CompressorOptions = ({ vocals, title, name, setApplyCompressor }) => {
  const { AudioProcessor } = NativeModules;
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);
  const [selectedPreset, setSelectedPreset] = useState("Default");
  const theme = useThemeColor({ light: "black", dark: "white" });
  const textColor = useThemeColor({ light: "white", dark: "black" });
  const [applyEfx, setApplyEfx] = useState(false);
  const { appliedEfx, setAppliedEfx } = useContext(EfxControls);
  const { currentEfx, setCurrentEfx } = useContext(EfxControls);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const { efxList, setEfxList } = useContext(EfxControls);
  const [values, setValues] = useState({
    threshold: 0,
    ratio: 1,
    attack: 10,
    release: 50,
    knee: 0,
    makeupGain: 0,
  });

  const applyCompressor = async (filePath, presetName) => {
    try {
      const result = await AudioProcessor.applyCompressorPreset(
        filePath,
        presetName
      );
      console.log(`Processed Audio is Saved at:`, result);
      setProcessedVocals(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (applyEfx) {
      applyCompressor(vocals, selectedPreset);
      setApplyEfx(false);
    }
  }, [selectedPreset, applyEfx]);

  const preset = [
    {
      id: 0,
      value: "MediumCompression",
      title: "Medium Compression",
      values: {
        threshold: -15, // Threshold (in dB) where compression starts
        ratio: 4, // Compression ratio (e.g., 4:1)
        attack: 20, // Attack time (in ms)
        release: 200, // Release time (in ms)
        knee: 5, // Knee setting (dB) for smoother compression onset
        makeupGain: 2, // Makeup gain to maintain output level (in dB)
      },
    },
    {
      id: 1,
      value: "HeavyCompression",
      title: "Heavy Compression",
      values: {
        threshold: -20, // Lower threshold for stronger compression
        ratio: 8, // High compression ratio (8:1)
        attack: 10, // Short attack time to compress transients quickly
        release: 300, // Longer release to maintain compression
        knee: 8, // Higher knee for a smoother onset
        makeupGain: 3, // More makeup gain to compensate for higher compression
      },
    },
    {
      id: 2,
      value: "VocalBoost",
      title: "Vocal Boost",
      values: {
        threshold: -12, // Threshold set for vocal peaks
        ratio: 3, // Gentle compression (3:1) to control peaks without losing dynamics
        attack: 25, // Moderate attack time to preserve vocal nuances
        release: 150, // Faster release for vocal clarity
        knee: 4, // Soft knee for smooth transitions
        makeupGain: 4, // Boosted makeup gain to make vocals more present
      },
    },
    {
      id: 3,
      value: "Default",
      title: "Default",
      values: {
        threshold: 0, // No compression by default
        ratio: 1, // Ratio set to 1:1 for no compression effect
        attack: 10, // Minimal attack (irrelevant in no-compression)
        release: 50, // Minimal release (irrelevant in no-compression)
        knee: 0, // No knee
        makeupGain: 0, // No makeup gain
      },
    },
  ];


  const setPresetValues = (itemValue) => {
    preset.find((efx) => {
      if(efx.value === itemValue){
        setValues(efx.values)
      }
    })
  }

  const handleManualCompressor = (
    vocals,
    outputFilePath,
    compressorSettings
  ) => {
    console.log(vocals, outputFilePath, compressorSettings);
    AudioProcessor.applyManualReverb(vocals, outputFilePath, compressorSettings)
      .then((result) => {
        console.log("Processed audio saved at:", result);
      })
      .catch((error) => {
        console.error("Error applying manual Compression:", error);
      });
  };

  const efx = {
    type: "Compressor",
    preset: currentEfx ? currentEfx : null,
    values: [],
  };

  return (
    <View
      style={{
        width: "100%",
        height: "90%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          gap: 10,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Presets:- </Text>
        <Picker
          style={{ height: 30, width: 150 }}
          selectedValue={selectedPreset}
          onValueChange={(itemValue) => {
            setSelectedPreset(itemValue);
            setApplyEfx(true);
            setCurrentEfx(itemValue);
            if (currentEfx !== appliedEfx) {
              setAppliedEfx(itemValue);
            }
          }}
        >
          {preset &&
            preset.map((p, idx) => (
              <Picker.Item key={idx} label={p.title} value={p.value} />
            ))}
        </Picker>
        <TouchableOpacity
          onPress={() => {
            efxList.push(efx);
            setApplyEfx(false);
            setIsProcessing(true);
            setApplyCompressor(false);
          }}
          style={{
            width: "20%",
            height: "10%",
            backgroundColor: "#8E2DE2",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "white" }}>
            Apply-Changes
          </Text>
        </TouchableOpacity>
        <ManualCompressor
          onApplyCompressor={handleManualCompressor}
          vocals={vocals}
          title={name}
          values={values}
        />
      </View>
    </View>
  );
};

export default CompressorOptions;

const styles = StyleSheet.create({});
