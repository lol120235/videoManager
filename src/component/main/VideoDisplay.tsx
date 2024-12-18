import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import VideoDisplayLine from "./VideoDisplayLine";

const VideoDisplay = () => {
  const videos = useSelector((state: any) => state.videos.videos);
  const [videosByLine, setVideosByLine] = useState<any[][]>([]);

  useEffect(() => {
    const groupedVideos: any[][] = [];
    const emptyVideo = { name: null, uri: null };
    for (let i = 0; i < videos.length; i += 4) {
      groupedVideos.push(videos.slice(i, i + 4));
    }
    if (groupedVideos.length) {
      for (let i = 0; i < 4 - (videos.length % 4); ++i) {
        groupedVideos[groupedVideos.length - 1].push(emptyVideo);
      }
    }
    setVideosByLine(groupedVideos);
  }, [videos]);

  return (
    <View style={styles.container}>
      {videosByLine.map((videoLine, index) => (
        <VideoDisplayLine key={index} videos={videoLine} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
  },
});

export default VideoDisplay;
