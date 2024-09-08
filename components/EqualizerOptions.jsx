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
import ManualEqualizer from "./ManualEqualizer";
import { EfxControls } from "@/hooks/Context/ProcessedAudio";

const EqualizerOptions = ({ vocals, title, name, setApplyEQ }) => {
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

  const applyEqualizer = async (filePath, presetName) => {
    try {
      const result = await AudioProcessor.applyEqualizerPreset(
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
      applyEqualizer(vocals, selectedPreset);
      setApplyEfx(false);
    }
  }, [selectedPreset, applyEfx]);

  const preset = [
    {
      id: 0,
      value: "BassBoost",
      title: "Bass-Boost",
    },
    {
      id: 1,
      value: "MidBoost",
      title: "Mid-Boost",
    },
    {
      id: 2,
      value: "TrebleBoost",
      title: "Treble-Boost",
    },
    {
      id: 3,
      value: "VocalEnhance",
      title: "Vocal-Enhance",
    },
    {
      id: 4,
      value: "Default",
      title: "Default",
    },
  ];

  const handleManualEqualizer = (vocals, outputFilePath, eqSettings) => {
    console.log(vocals, outputFilePath, eqSettings);
    AudioProcessor.applyManualEqualizer(vocals, outputFilePath, eqSettings)
      .then((result) => {
        console.log("Processed audio saved at:", result);
      })
      .catch((error) => {
        console.error("Error applying manual Compression:", error);
      });
  };

  const efx = {
    type: "Equalizer",
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
            // playBothTracks();
            if (currentEfx !== appliedEfx) {
              setAppliedEfx(itemValue);
            }
            setIsProcessing(true);
          }}
        >
          {preset &&
            preset.map((p, idx) => (
              <Picker.Item
                style={{ fontSize: 16, fontWeight: "bold" }}
                key={idx}
                label={p.title}
                value={p.value}
              />
            ))}
        </Picker>
        <ManualEqualizer
          onApplyEqualizer={handleManualEqualizer}
          vocals={vocals}
          title={name}
        />
        <TouchableOpacity
          onPress={() => {
            efxList.push(efx);
            setApplyEfx(false);
            setIsProcessing(true);
            setApplyEQ(false);
          }}
          style={{
            width: "20%",
            height: "10%",
            backgroundColor: "green",
            position: "absolute",
            bottom: 10,
            right: 5,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "black" }}>
            Apply-Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EqualizerOptions;

const styles = StyleSheet.create({});
