import { StyleSheet, Text, View, NativeModules, Button, TouchableOpacity } from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { RecordedTrack } from '../hooks/Context/Recording';
import { useThemeColor } from '@/hooks/useThemeColor';
import {Picker} from '@react-native-picker/picker';
import ManualCompressor from './ManualCompressor';

const CompressorOptions = ({vocals, title, name}) => {

    const {AudioProcessor} = NativeModules;
    const {processedVocals, setProcessedVocals} = useContext(RecordedTrack);
    const [selectedPreset, setSelectedPreset] = useState("Default");
    const theme = useThemeColor({light: 'black', dark: 'white'});
    const textColor = useThemeColor({light: 'white', dark: 'black'});
    const [applyEfx,setApplyEfx] = useState(false);

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
      if(applyEfx){
        applyCompressor(vocals, selectedPreset);
        setApplyEfx(false);
      }
    }, [selectedPreset]);

      const preset = [
        {
          id: 0,
          value: "LightCompression",
          title: "Light-Compression"
        },
        {
          id: 1,
          value: "MediumCompression",
          title: "Medium-Compression"
        },
        {
          id: 2,
          value: "HeavyCompression",
          title: "Heavy-Compression"
        },
        {
          id: 3,
          value: "VocalBoost",
          title: "Vocal Boost"
        },
        {
          id: 4,
          value: "Default",
          title: "Default"
        },
      ]

      
      const handleManualCompressor = (vocals, outputFilePath, compressorSettings) => {
           console.log(vocals, outputFilePath, compressorSettings);
        AudioProcessor.applyManualReverb(vocals,outputFilePath, compressorSettings)
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
            <Picker style={{height: 30, width: 150}} selectedValue={selectedPreset} onValueChange={(itemValue) => {setSelectedPreset(itemValue); setApplyEfx(true)}} >
              {
              preset && preset.map((p, idx) => (
                <Picker.Item key={idx} label={p.title} value={p.value} />
              ))
              }
            </Picker>
            <ManualCompressor onApplyCompressor={handleManualCompressor} vocals={vocals} title={name} />
            
        </View>
    </View>
  )
}

export default CompressorOptions

const styles = StyleSheet.create({})