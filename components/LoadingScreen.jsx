import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import React from "react";

const LoadingScreen = ({ visible }) => {

    const {height} = Dimensions.get("screen");

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={[styles.container, {height: height}]}>
        <View style={styles.loader}>
          <Image
            source={require("@/assets/images/Gaao-Icon.png")}
            style={{ width: 60, height: 60, alignSelf: 'center', borderRadius: 50}}
          />
          <ActivityIndicator size={"small"} color={"lightblue"} />
          <Text style={{ color: "white", fontSize: 14, alignSelf: 'center' }}>
            Processing...!
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
