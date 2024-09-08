import { StyleSheet } from 'react-native'
import React from 'react'
import { BottomModal, ModalContent } from 'react-native-modals'
import EqualizerOptions from '../EqualizerOptions'

const EqualizerModel = ({applyEQ, setApplyEQ, height, modalColor, vocals, title,}) => {

  return (
    <BottomModal overlayBackgroundColor="#000" modalStyle={{height: height * 3/5, justifyContent: 'center', alignItems: 'center', backgroundColor: modalColor}} visible={applyEQ} onHardwareBackPress={() => setApplyEQ(false)} onSwiping={() => setApplyEQ(!applyEQ)} swipeDirection={["down", "up"]} swipThreshold={100} >
          <ModalContent style={{height: "auto", paddingVeritical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: modalColor, padding: 20,}} >

            <EqualizerOptions vocals={vocals} title={"Equalizer-Presets"} name={title} setApplyEQ={setApplyEQ}  />

          </ModalContent>
        </BottomModal>
  )
}

export default EqualizerModel

const styles = StyleSheet.create({})