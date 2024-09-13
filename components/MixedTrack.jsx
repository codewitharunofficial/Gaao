import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import Feather from "@expo/vector-icons/Feather";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import WaveForm from "./WaveForm";
import { Visualizer } from "@/hooks/Context/WaveForm";
import Entypo from "@expo/vector-icons/Entypo";
import * as MediaLibrary from 'expo-media-library';
import Toast from "react-native-simple-toast";
import { BottomModal, ModalContent } from "react-native-modals";

const MixedTrack = ({ title, url, isMusicPlaying, setIsMusicPlaying, trackVolume, setTrackVolume, pauseTrack, resumeTrack, isMixing, setIsMixing, modalColor }) => {
  
  const { setMusicWave } = useContext(Visualizer);
  const [isDownloading, setIsDownloading] = useState(false);

const getStoragePermission = async () => {
  try {
    const {granted} = await MediaLibrary.getPermissionsAsync();
    if(!granted){
      const {granted} = await MediaLibrary.requestPermissionsAsync();
      if(granted){
        Toast.show("Permission Given");
      } else {
        Toast.show("Storage Permissions are Required!!");
        await MediaLibrary.requestPermissionsAsync();
      }
    } 
  } catch (error) {
    console.log(error)
  }
}

useEffect(() => {
  getStoragePermission();
});
  
const saveToDevice = async () => {
  try {
    if(url){
      const asset = await MediaLibrary.createAssetAsync(url);
      setIsDownloading(true);
      const gaao = await MediaLibrary.getAlbumAsync('Gaao');
      if(!gaao){
        const createGaao = await MediaLibrary.createAlbumAsync("Gaao", asset, false);
        if(createGaao){
          Toast.show(`Mixed File Exported at: 0/emulated/Music/${createGaao.title}`, 3000);
          setIsDownloading(false);
        } else{
          Toast.show("Unable to create Gaao", 2000);
          setIsDownloading(false);
        }
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], gaao, false);
        Toast.show(`Mixed File Exported at: 0/emulated/Music/${gaao.title}`, 3000);
        setIsDownloading(false);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

  return (
    <BottomModal onSwiping={() => setIsMixing(!isMixing)} visible={isMixing} swipeDirection={["down", "up"]} overlayOpacity={5} modalStyle={{height: height *3/5, justifyContent: 'center', alignItems: 'center', backgroundColor: modalColor}} >
     <ModalContent style={{height: height /2, paddingVeritical: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: modalColor, padding: 20, }} >
    <View
      style={{
        flex: 0.5,
        width: "90%",
        borderRadius: 10,
        padding: 10,
        flexDirection: "column",
        gap: 5,
      }}
    >
      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: "400",
          color: "white",
          textAlign: "center",
        }}
      >
        {title}-Mixed-Track
      </ThemedText>
      <View
        style={{
          width: "100%",
          height: "60%",
          padding: 0,
          backgroundColor: "purple",
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "20%",
            height: "100%",
            backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="mic" size={30} color={"white"} />
        </View>
        {isMusicPlaying ? (
          <Ionicons
            onPress={() => pauseTrack()}
            name="pause"
            size={30}
            color={"black"}
          />
        ) : (
          <Ionicons
            onPress={() => resumeTrack()}
            name="play"
            size={30}
            color={"black"}
          />
        )}
        <View style={{ width: "70%", height: "75%", alignItems: "center", justifyContent: 'center' }}>
          <WaveForm uri={url} setMusicWave={setMusicWave} />
          <Slider
            value={trackVolume}
            maximumValue={1}
            minimumValue={0}
            onSlidingComplete={(value) => {
              setTrackVolume(value);
            }}
            style={{
              width: "95%",
              height: "20%",
              position: "absolute",
              bottom: "40%",
              borderColor: "blue",
            }}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => saveToDevice()} style={{width: 'auto', height: 'auto', padding: 10, backgroundColor: 'lightgreen', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}} >
      <Entypo size={25} name="download" color={"black"} />
      <Text style={{color: 'black'}} >{isDownloading ? "Saving..." : "Save To Device"}</Text>
      </TouchableOpacity>
    </View>
     </ModalContent>
    </BottomModal>
  );
};

export default MixedTrack;

const styles = StyleSheet.create({});
