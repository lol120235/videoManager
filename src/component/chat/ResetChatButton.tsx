import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function ResetChatButton({
  resetFunction,
}: {
  resetFunction: () => void;
}) {
  return (
    <View style={styles.container}>
      <Button
        style={styles.button}
        mode="contained-tonal"
        onPress={resetFunction}
        icon={"restart"}
      >
        Clear chat
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1, // Ensure the button is on top
    alignSelf: "flex-end",
    top: 20,
    right: 20,
  },
  button: {
    borderRadius: 8,
    elevation: 2,
  },
});
