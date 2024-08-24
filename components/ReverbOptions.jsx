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

const ReverbOptions = ({ vocals, title, name }) => {
  const { AudioProcessor } = NativeModules;
  const { processedVocals, setProcessedVocals } = useContext(RecordedTrack);
  const [selectedPreset, setSelectedPreset] = useState("Default");
  const theme = useThemeColor({ light: "black", dark: "white" });
  const textColor = useThemeColor({ light: "white", dark: "black" });
  const buttonColor = useThemeColor({light: 'lightblue', dark: 'yellow'});
  const [applyEfx, setApplyEfx] = useState(false);
  const { appliedEfx, setAppliedEfx } = useContext(EfxControls);
  const { currentEfx, setCurrentEfx } = useContext(EfxControls);
  const { isProcessing, setIsProcessing } = useContext(EfxControls);
  const { efxList, setEfxList } = useContext(EfxControls);

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
    },
    {
      id: 1,
      value: "Cathedral",
      title: "Cathedral",
    },
    {
      id: 2,
      value: "BrightRoom",
      title: "Bright-Room",
    },
    {
      id: 3,
      value: "DarkHall",
      title: "Dark-Hall",
    },
    {
      id: 4,
      value: "LargeHall",
      title: "Large-Hall",
    },
    {
      id: 5,
      value: "Plate",
      title: "Plate",
    },
    {
      id: 6,
      value: "Vintage",
      title: "Vintage",
    },
    {
      id: 7,
      value: "Ambient",
      title: "Ambient",
    },
    {
      id: 8,
      value: "Default",
      title: "Default",
    },
  ];

  const handleApplyReverb = (vocals, outputFilePath, reverbSettings) => {
    console.log(vocals, outputFilePath, reverbSettings);
    AudioProcessor.applyManualReverb(vocals, outputFilePath, reverbSettings)
      .then((result) => {
        console.log("Processed audio saved at:", result);
      })
      .catch((error) => {
        console.error("Error applying manual reverb:", error);
      });
  };

  const efx = {
    type: "Reverb",
    preset: currentEfx,
    values: []
  }

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
        <ManualReverb
          onApplyReverb={handleApplyReverb}
          vocals={vocals}
          title={name}
        />
      </View>
      <Button title="Apply Changes" onPress={() => {efxList.push(efx); setApplyEfx(false); setIsProcessing(true)}} color={buttonColor} />
    </View>
  );
};

export default ReverbOptions;

const styles = StyleSheet.create({});
