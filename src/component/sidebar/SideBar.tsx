import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import UploadVideoButton from "./UploadVideoButton";
import AnalyseButton from "./AnalyseButton";
import ChatLayout from "../chat/ChatLayout";

const SideBar = () => {
  return (
    <View style={styles.sidebar}>
      <UploadVideoButton />
      <ChatLayout />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 500, // Adjust the width as needed
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
