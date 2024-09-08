import { NativeModules } from "react-native";

const {AudioProcessor} = NativeModules;

export const handleTrackVolume = async (track, volume) => {
    try {
      await track.setVolumeAsync(volume); 
      console.log(`Track Volume set to ${volume}`);
    } catch(error){
       console.log(error);
    }
}


export const manualReverb = async (inputPath, outputPath, reverbSettings ) => {
    try {
        const result = await AudioProcessor.applyManualReverb(inputPath, outputPath, reverbSettings);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}