import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export async function askForPermissions() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissions Required!",
          "Gaao needs to access your media library to save files"
        );
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  export async function getPermissions() {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === "granted") {
        return true;
    } else {
      return askForPermissions();
    }
  }