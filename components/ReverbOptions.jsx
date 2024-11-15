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
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import ManualReverb from "./ManualReverb";
import { Picker } from "@react-native-picker/picker";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";

const ReverbOptions = ({ vocals, title, name, setApplyReverb }) => {
  const { AudioProcessor } = NativeModules;
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);
  const [selectedPreset, setSelectedPreset] = useState("Default");
  const theme = useThemeColor({ light: "black", dark: "white" });
  const textColor = useThemeColor({ light: "white", dark: "black" });
  const buttonColor = useThemeColor({ light: "lightblue", dark: "yellow" });
  const [applyEfx, setApplyEfx] = useState(false);
  const { appliedEfx, setAppliedEfx } = useContext(EfxControls);
  const { currentEfx, setCurrentEfx } = useContext(EfxControls);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const { efxList, setEfxList } = useContext(EfxControls);
  const [presetValues, setPresetValues] = useState({
    room_size: 0.6,
    decay: 0.5,
    wet: 0.8,
    dry: 0.4,
  });

  const applyReverb = async (filePath, presetName) => {
    console.log(presetName);
    try {
      const result = await AudioProcessor.applyReverbPreset(
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
      applyReverb(vocals, selectedPreset);
      setApplyEfx(false);
    }
  }, [selectedPreset, applyEfx]);

  const preset = [
    {
      id: 0,
      value: "SmallRoom",
      title: "Small-Room",
      values: {
        room_size: 0.3,
        decay: 0.2,
        wet: 0.5,
        dry: 0.6,
      },
    },
    {
      id: 1,
      value: "Cathedral",
      title: "Cathedral",
      values: {
        room_size: 1.0,
        decay: 0.8,
        wet: 0.95,
        dry: 0.2,
      },
    },
    {
      id: 2,
      value: "BrightRoom",
      title: "Bright-Room",
      values: {
        room_size: 0.4,
        decay: 0.3,
        wet: 0.7,
        dry: 0.6,
      },
    },
    {
      id: 3,
      value: "DarkHall",
      title: "Dark-Hall",
      values: {
        room_size: 0.85,
        decay: 0.7,
        wet: 0.9,
        dry: 0.2,
      },
    },
    {
      id: 4,
      value: "LargeHall",
      title: "Large-Hall",
      values: {
        room_size: 1.0,
        decay: 0.6,
        wet: 0.85,
        dry: 0.4,
      },
    },
    {
      id: 5,
      value: "Plate",
      title: "Plate",
      values: {
        room_size: 0.3,
        decay: 0.3,
        wet: 0.6,
        dry: 0.5,
      },
    },
    {
      id: 6,
      value: "Vintage",
      title: "Vintage",
      values: {
        room_size: 0.5,
        decay: 0.5,
        wet: 0.7,
        dry: 0.6,
      },
    },
    {
      id: 7,
      value: "Ambient",
      title: "Ambient",
      values: {
        room_size: 0.75,
        decay: 0.5,
        wet: 0.7,
        dry: 0.5,
      },
    },
    {
      id: 8,
      value: "Default",
      title: "Default",
      values: {
        room_size: 0.6,
        decay: 0.5,
        wet: 0.8,
        dry: 0.4,
      },
    },
  ];

  const handleApplyReverb = (vocals, outputFilePath, reverbSettings) => {
    console.log(vocals, outputFilePath, reverbSettings);
    AudioProcessor.applyManualReverb(vocals, outputFilePath, reverbSettings)
      .then((result) => {
        console.log("Processed audio saved at:", result);
        setProcessedVocals(result);
      })
      .catch((error) => {
        console.error("Error applying manual reverb:", error);
      });
  };

  const efx = {
    type: "Reverb",
    preset: currentEfx,
    values: [],
  };

  const setValues = (itemValue) => {
    preset.find((efx) => {
      if (efx.title === itemValue) {
        setPresetValues(efx.values);
      }
    });
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
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Presets:-</Text>
        <Picker
          style={{ height: 30, width: 150 }}
          selectedValue={selectedPreset}
          onValueChange={(itemValue) => {
            setSelectedPreset(itemValue);
            setApplyEfx(true);
            setCurrentEfx(itemValue);
            setValues(itemValue);
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
            setApplyReverb(false);
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
        <ManualReverb
          onApplyReverb={handleApplyReverb}
          vocals={vocals}
          title={name}
          values={presetValues}
        />
      </View>
    </View>
  );
};

export default ReverbOptions;

const styles = StyleSheet.create({});
