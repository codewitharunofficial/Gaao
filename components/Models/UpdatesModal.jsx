import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  Dimensions,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useUpdates } from "expo-updates";
import * as Updates from "expo-updates";
import { downloadUpdates } from "@/constants/updates";

const UpdatesModal = ({visible}) => {
  const { height } = Dimensions.get("screen");
  const [update, setUpdate] = useState();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const {
    isDownloading
  } = useUpdates();

  // const [ifNewUpdate, setIfNewUpdate] = useState(isUpdateAvailable);

  async function updateApp() {
    try {
      const update = await Updates.fetchUpdateAsync();
      if (update.isNew) {
        setUpdate(update);
        setIsDownloaded(true);
        Alert.alert("Update Successful", `App is successfully Updated to ${update.manifest.runtimeVersion}`, [
          {
            text: "Apply Later",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Restart Now",
            onPress: () => {Updates.reloadAsync(); setIsDownloaded(false)},
          }
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal transparent={false} animationType="fade" visible={visible}>
      <View style={[styles.container, { height: height }]}>
        <View style={styles.loader}>
          <Image
            source={require("@/assets/images/Gaao-Icon.png")}
            style={{ width: 60, height: 60, alignSelf: "center" }}
          />
          <Text style={{ color: "white", fontSize: 14, alignSelf: "center" }}>
            New Update Available
          </Text>
          <Text>{update?.manifest?.runtimeVersion}</Text>
          {isDownloading ? (
            <Text>Downloading Updates...</Text>
          ) : (
            <View
              style={{
                width: "100%",
                height: "auto",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Button
                title="Update"
                color={"green"}
                onPress={() => {
                  updateApp();
                }}
              />
              <Button
                title="Will Do it Later"
                color={"red"}
                onPress={() => {
                  setIfNewUpdate(false);
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UpdatesModal;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3",
  },
  loader: {
    paddingHorizontal: 100,
    paddingVertical: 20,
    backgroundColor: "#00000099",
    borderRadius: 10,
    gap: 10,
  },
});
