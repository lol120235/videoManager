import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch } from "react-redux";
import { analyseVideoContent } from "../../lib/analyseVideoContent";

const UploadVideoButton = () => {
  console.log("It's fixed yeaaaa", process.env.EXPO_PUBLIC_OPENAI_AZURE_URL);
  const dispatch = useDispatch();

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
    });

    if (!result.canceled) {
      console.log(result.assets);

      result.assets.forEach((asset) => {
        // Dispatch initial video data
        dispatch({
          type: "ADD_VIDEO",
          payload: {
            name: asset.name,
            uri: asset.uri,
            content: null, // Initial content is null
          },
        });

        // Analyse video content and dispatch the update
        analyseVideoContent(asset.uri).then((content) => {
          dispatch({
            type: "UPDATE_VIDEO_CONTENT",
            payload: {
              name: asset.name,
              uri: asset.uri,
              content,
            },
          });
        });
      });
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
