import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch } from "react-redux";

const UploadVideoButton = () => {
  const dispatch = useDispatch();

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
    });

    if (!result.canceled) {
      console.log(result.assets);
      result.assets.map((asset) =>
        dispatch({
          type: "ADD_VIDEO",
          payload: {
            name: asset.name,
            uri: asset.uri,
          },
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.button}
        onPress={handleUpload}
        underlayColor="#00aaff"
      >
        <Text style={styles.buttonText}>+ Upload Video</Text>
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
    backgroundColor: "#009aee",
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

export default UploadVideoButton;
