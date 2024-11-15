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
  const [values, setValues] = useState({
    bassGain: 0,
    midGain: 0,
    trebleGain: 0,
  });

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

  const setPresetValues = (itemValue) => {
    preset.find((efx) => {
      if (efx.title === itemValue) {
        setValues(efx.values);
      }
    });
  };

  const preset = [
    {
      id: 0,
      value: "Bass-Boost",
      title: "Bass-Boost",
      values: {
        bassGain: 6, // Boost for bass frequencies
        midGain: 0, // Neutral gain for mid frequencies
        trebleGain: -2, // Slight reduction in treble frequencies to enhance bass feel
      },
    },
    {
      id: 1,
      value: "Mid-Boost",
      title: "Mid-Boost",
      values: {
        bassGain: -1, // Slight reduction in bass frequencies to clear midrange
        midGain: 5, // Boost for mid frequencies
        trebleGain: 0, // Neutral for treble frequencies
      },
    },
    {
      id: 2,
      value: "Treble-Boost",
      title: "Treble-Boost",
      values: {
        bassGain: -2, // Slight reduction in bass frequencies to enhance treble clarity
        midGain: 0, // Neutral for mid frequencies
        trebleGain: 6, // Boost for treble frequencies for clarity and brightness
      },
    },
    {
      id: 3,
      value: "Vocal-Enhance",
      title: "Vocal-Enhance",
      values: {
        bassGain: -1, // Slight reduction in bass to clear up vocal frequencies
        midGain: 4, // Boost in mid frequencies to enhance vocals
        trebleGain: 3, // Slight boost in treble for clarity and presence
      },
    },
    {
      id: 4,
      value: "Default",
      title: "Default",
      values: {
        bassGain: 0, // No boost or cut in bass frequencies
        midGain: 0, // No boost or cut in mid frequencies
        trebleGain: 0, // No boost or cut in treble frequencies
      },
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
            setPresetValues(itemValue);
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
        <ManualEqualizer
          onApplyEqualizer={handleManualEqualizer}
          vocals={vocals}
          title={name}
          values={values}
        />
      </View>
    </View>
  );
};

export default EqualizerOptions;

const styles = StyleSheet.create({});
