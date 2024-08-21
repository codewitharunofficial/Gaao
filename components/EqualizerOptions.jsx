import { StyleSheet, Text, View, NativeModules, Button, TouchableOpacity } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { RecordedTrack } from '../hooks/Context/Recording';
import { useThemeColor } from '@/hooks/useThemeColor';
import {Picker} from '@react-native-picker/picker';
import ManualCompressor from './ManualCompressor';
import ManualEqualizer from './ManualEqualizer';

const EqualizerOptions = ({vocals, title, name}) => {

    const {AudioProcessor} = NativeModules;
    const {processedVocals, setProcessedVocals} = useContext(RecordedTrack);
    const [selectedPreset, setSelectedPreset] = useState("Default");
    const theme = useThemeColor({light: 'black', dark: 'white'});
    const textColor = useThemeColor({light: 'white', dark: 'black'});

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
        applyEqualizer(vocals, selectedPreset);
    }, [selectedPreset])

      const preset = [
        {
          id: 0,
          value: "BassBoost",
          title: "Bass-Boost"
        },
        {
          id: 1,
          value: "MidBoost",
          title: "Mid-Boost"
        },
        {
          id: 2,
          value: "TrebleBoost",
          title: "Treble-Boost"
        },
        {
          id: 3,
          value: "VocalEnhance",
          title: "Vocal-Enhance"
        },
        {
          id: 4,
          value: "Default",
          title: "Default"
        },
      ]

      
      const handleManualEqualizer = (vocals, outputFilePath, eqSettings) => {
           console.log(vocals, outputFilePath, eqSettings);
        AudioProcessor.applyManualReverb(vocals,outputFilePath, eqSettings)
            .then(result => {
                console.log('Processed audio saved at:', result);
            })
            .catch(error => {
                console.error('Error applying manual Compression:', error);
            });
    };

  return (
    <View style={{width: '100%', height: '90%', display: 'flex', flexDirection: 'column', gap: 10}} >
      
    <View style={{width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: 10, paddingHorizontal: 10,}} >
            
              <Text style={{fontSize: 16, fontWeight: 'bold', }} >Presets:- </Text>
            <Picker style={{height: 30, width: 150}} selectedValue={selectedPreset} onValueChange={(itemValue) => setSelectedPreset(itemValue)} >
              {
              preset && preset.map((p, idx) => (
                <Picker.Item style={{fontSize: 16, fontWeight: 'bold'}} key={idx} label={p.title} value={p.value} />
              ))
              }
            </Picker>
            <ManualEqualizer onApplyEqualizer={handleManualEqualizer} vocals={vocals} title={name} />
            
        </View>
    </View>
  )
}

export default EqualizerOptions

const styles = StyleSheet.create({})