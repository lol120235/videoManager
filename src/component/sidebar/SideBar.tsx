import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UploadVideoButton from "./UploadVideoButton";
import AnalyseButton from "./AnalyseButton";

const SideBar = () => {
  return (
    <View style={styles.sidebar}>
      <UploadVideoButton />
      <AnalyseButton />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 250, // Adjust the width as needed
    backgroundColor: "#f0f0f0",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    left: 0,
    top: 0,
    bottom: 0,
    padding: 10,
  },
});

export default SideBar;
