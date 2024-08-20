import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BottomModal, ModalContent } from 'react-native-modals'
import ReverbOptions from '../ReverbOptions'

const ReverbModel = ({applyReverb, setApplyReverb, height, modalColor, vocals, title}) => {

  return (
    <BottomModal overlayBackgroundColor="#000" modalStyle={{height: height/2, justifyContent: 'center', alignItems: 'center', backgroundColor: modalColor}} visible={applyReverb} onHardwareBackPress={() => setApplyReverb(false)} onSwiping={() => setApplyReverb(!applyReverb)} swipeDirection={["down", "up"]} swipThreshold={100} >
          <ModalContent style={{height: height/2, paddingVeritical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: modalColor, padding: 20, position: 'absolute', bottom: 0}} >

            <ReverbOptions vocals={vocals} title={"Reverb-Presets"} name={title} />

          </ModalContent>
        </BottomModal>
  )
}

export default ReverbModel

const styles = StyleSheet.create({})