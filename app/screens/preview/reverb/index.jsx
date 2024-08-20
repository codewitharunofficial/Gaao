import { StyleSheet, Text, View, NativeModules, Button } from 'react-native'
import React, {useState, useContext} from 'react'
import { RecordedTrack } from '@/hooks/Context/Recording';

const Reverb = ({vocals}) => {

    const {AudioProcessor} = NativeModules;
    const {processedVocals, setProcessedVocals} = useContext(RecordedTrack);

    const applyReverb = async (filePath, presetName) => {
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

  return (
    <View style={{width: '100%', height: '50%', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', position: 'absolute', bottom: 0}} >
        <Button onPress={() => {applyReverb(vocals, "SmallRoom")}} title="Small-Room" color={"lightgreen"} />
        <Button onPress={() => {applyReverb(vocals, "MediumRoom")}} title="Medium-Room" color={"lightgreen"} />
        <Button onPress={() => {applyReverb(vocals, "LargeRoom")}} title="Large-Room" color={"lightgreen"} />
        <Button onPress={() => {applyReverb(vocals, "MediumHall")}} title="Medium-Hall" color={"lightgreen"} />
        <Button onPress={() => {applyReverb(vocals, "LargeHall")}} title="Large-Hall" color={"lightgreen"} />
        <Button onPress={() => {applyReverb(vocals, "Plate")}} title="Plate" color={"lightgreen"} />
        </View>
  )
}

export default Reverb

const styles = StyleSheet.create({})