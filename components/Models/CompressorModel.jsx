import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomModal, ModalContent } from 'react-native-modals'
import ReverbOptions from '../ReverbOptions'
import CompressorOptions from '../CompressorOptions'

const CompressorModal = ({applyCompressor, setApplyCompressor, height, modalColor, vocals, title}) => {

  return (
    <BottomModal overlayBackgroundColor="#000" modalStyle={{height: height * 3/5, justifyContent: 'center', alignItems: 'center', backgroundColor: modalColor}} visible={applyCompressor} onHardwareBackPress={() => setApplyReverb(false)} onSwiping={() => setApplyCompressor(!applyCompressor)} swipeDirection={["down", "up"]} swipThreshold={100} >
          <ModalContent style={{height: "auto", paddingVeritical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: modalColor, padding: 20,}} >

            <CompressorOptions vocals={vocals} title={"Compressor-Presets"} name={title} />

          </ModalContent>
        </BottomModal>
  )
}

export default CompressorModal

const styles = StyleSheet.create({})