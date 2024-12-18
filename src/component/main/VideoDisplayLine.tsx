// Show 4 cards in one line

import React from "react";
import { View, StyleSheet } from "react-native";
import VideoDisplayCard from "./VideoDisplayCard";

const VideoDisplayLine = ({
  videos,
}: {
  videos: { name: string; uri: string }[];
}) => {
  console.log(videos);
  return (
    <View style={styles.container}>
      {videos.map((video, index) => (
        <VideoDisplayCard key={index} video={video} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    backgroundColor: "#ddd",
  },
});

export default VideoDisplayLine;
