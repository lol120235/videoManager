import React from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { analyseVideoContent } from "../../lib/analyseVideoContent";
import { getEmbeddings } from "../../lib/callOpenAI";

const UploadVideoButton = () => {
  // console.log("It's fixed yeaaaa", process.env.EXPO_PUBLIC_OPENAI_AZURE_URL);
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
        analyseVideoContent(asset.uri)
          .then((content) => {
            console.log("Updating Video");
            return dispatch({
              type: "UPDATE_VIDEO",
              payload: {
                name: asset.name,
                uri: asset.uri,
                content: content?.map((c) => ({
                  content: c,
                  embeddings: null,
                })),
              },
            });
          })
          .then((result) => {
            console.log("Result of setting content (before embeddings)");
            console.log(result);
            result.payload.content?.forEach((c) => {
              getEmbeddings(
                result.payload.content?.find((_) => _.content === c.content)
                  ?.content
              )
                .then((embeddings) => {
                  console.log("Updating Embeddings");
                  console.log(
                    dispatch({
                      type: "UPDATE_EMBEDDINGS",
                      payload: {
                        name: asset.name,
                        content: c.content,
                        embeddings: embeddings,
                      },
                    })
                  );
                })
                .catch((error) => {
                  console.error("Error getting embeddings", error);
                });
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
