import { StyleSheet, Text, View, NativeModules, Button, TouchableOpacity } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { RecordedTrack } from '../hooks/Context/Recording';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import ManualReverb from './ManualReverb';
import {Picker} from '@react-native-picker/picker';

const ReverbOptions = ({vocals, title, name}) => {

    const {AudioProcessor} = NativeModules;
    const {processedVocals, setProcessedVocals} = useContext(RecordedTrack);
    const [manual, setManual] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState("None");
    const theme = useThemeColor({light: 'black', dark: 'white'});
    const textColor = useThemeColor({light: 'white', dark: 'black'});

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
        applyReverb(vocals, selectedPreset);
    }, [selectedPreset])

      const preset = [
        {
          id: 0,
          value: "SmallRoom",
          title: "Small-Room"
        },
        {
          id: 1,
          value: "MediumRoom",
          title: "Medium-Room"
        },
        {
          id: 2,
          value: "LargeRoom",
          title: "Large-Room"
        },
        {
          id: 3,
          value: "MediumHall",
          title: "Medium-Hall"
        },
        {
          id: 4,
          value: "LargeHall",
          title: "Large-Hall"
        },
        {
          id: 5,
          value: "Plate",
          title: "Plate"
        },
      ]

      
      const handleApplyReverb = (vocals, outputFilePath, reverbSettings) => {
           console.log(vocals, outputFilePath, reverbSettings);
        AudioProcessor.applyManualReverb(vocals,outputFilePath, reverbSettings)
            .then(result => {
                console.log('Processed audio saved at:', result);
            })
            .catch(error => {
                console.error('Error applying manual reverb:', error);
            });
    };

  return (
    <View style={{width: '100%', height: '90%', display: 'flex', flexDirection: 'column', gap: 10}} >
      
    <View style={{width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly', gap: 10, paddingHorizontal: 10,}} >
            
              <Text>Presets</Text>
            <Picker style={{height: 30, width: 200}} selectedValue={selectedPreset} onValueChange={(itemValue) => setSelectedPreset(itemValue)} >
              {
              preset && preset.map((p, idx) => (
                <Picker.Item key={idx} label={p.title} value={p.value} />
              ))
              }
            </Picker>
             <Text>Manual Reverb</Text>
            <ManualReverb onApplyReverb={handleApplyReverb} vocals={vocals} title={name} />
            
        </View>
    </View>
  )
}

export default ReverbOptions

const styles = StyleSheet.create({})