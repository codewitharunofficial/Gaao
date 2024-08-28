import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { BottomModal, ModalContent } from 'react-native-modals'
import ManualSync from '../ManualSync'
import { NativeModules } from 'react-native'
import { ThemedText } from '../ThemedText'
import { RecordedTrack } from '@/hooks/Context/Recording'

const SyncModal = ({applySync, setApplySync, height, modalColor, vocals, title, music}) => {

  const {processedVocals, setProcessedVocals} = useContext(RecordedTrack)

    const {AudioProcessor} = NativeModules;

    const handleSync = async (vocals, outputFilePath, delay) => {
        
            AudioProcessor.applyDelay(vocals, outputFilePath, delay)
            .then(result => {
              setProcessedVocals(result);
                console.log("Processed Audio Saved at:", result);
            })
           .catch(error => {
            console.error("Error While Syncing Audio:", error);
           })
    }

  return (
    <BottomModal overlayBackgroundColor="#000" modalStyle={{height: height *3/5, justifyContent: 'center', alignItems: 'center', backgroundColor: modalColor}} visible={applySync} onHardwareBackPress={() => setApplySync(false)} onSwiping={() => setApplySync(!applySync)} swipeDirection={["down", "up"]} swipThreshold={100} >
          <ModalContent style={{width: '100%', height: height /2, paddingVeritical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: modalColor, padding: 20, }} >
            <View style={{width: '100%', height: 'auto'}} >
             <ThemedText>Manual-Sync</ThemedText>
            <ManualSync onApplySync={handleSync} vocals={vocals} setSync={setApplySync} title={"Sync-Vocals"} name={title} music={music} />
            </View>

          </ModalContent>
        </BottomModal>
  )
}

export default SyncModal

const styles = StyleSheet.create({})