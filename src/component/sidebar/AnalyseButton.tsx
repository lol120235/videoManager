import React from "react";
import getVideoContent from "../../lib/analyseVideoContent";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch } from "react-redux";

const AnalyseButton = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.button}
        onPress={getVideoContent}
        underlayColor="#d6c133"
      >
        <Text style={styles.buttonText}>> Analyse Video</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  button: {
    backgroundColor: "#ccb72d",
    height: 50,
    justifyContent: "center",
    borderRadius: 12,
    padding: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AnalyseButton;
