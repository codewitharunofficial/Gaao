import { StyleSheet, Text, View, NativeModules } from 'react-native'
import React from 'react'
import { BottomModal, ModalContent } from 'react-native-modals'
import ManualReverb from '@/components/ManualReverb';


const ReverbModel = ({applyReverb, setApplyReverb, height, modalColor, vocals}) => {

const {AudioProcessor} = NativeModules;

    const handleApplyReverb = (reverbSettings) => {
        // Call your native module to apply reverb with the settings
        AudioProcessor.applyManualReverb(vocals, reverbSettings)
            .then(result => {
                console.log('Processed audio saved at:', result);
            })
            .catch(error => {
                console.error('Error applying manual reverb:', error);
            });
    };


  return (
    <BottomModal overlayBackgroundColor="#000" modalStyle={{height: height/2, justifyContent: 'center', alignItems: 'center', backgroundColor: modalColor}} visible={applyReverb} onHardwareBackPress={() => setApplyReverb(false)} onSwiping={() => setApplyReverb(!applyReverb)} swipeDirection={["down", "up"]} swipThreshold={100} >
          <ModalContent style={{height: height/2, paddingVeritical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: modalColor, padding: 20, position: 'absolute', bottom: 0}} >

            <ManualReverb onApplyReverb={handleApplyReverb} />

          </ModalContent>
        </BottomModal>
  )
}

export default ReverbModel

const styles = StyleSheet.create({})