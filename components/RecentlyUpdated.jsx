import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";

const RecentlyUpdated = ({ tracks, width, height }) => {
  const renderItem = ({ item }) => {
    return (
      // <TouchableOpacity style={{width: width, height: height}} >
      <Image
        source={{ uri: item?.karaokeCoverPhoto?.secure_url }}
        style={{ height: "100%", width: "100%" }}
      />
      // </TouchableOpacity>
    );
  };

  return (
    <Carousel
      data={tracks}
      renderItem={renderItem}
      sliderWidth={width}
      itemWidth={"100%"}
      layout="default"
      loop={true}
      autoPlay={true}
      autoPlayDelay={3000}
      autoPlayInteval={5000}
      style={styles.image}
    />
  );
};

export default RecentlyUpdated;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  image: {
    height: "30%",
    width: "100%",
    marginBottom: "2%",
    marginTop: "5%",
  },
});
