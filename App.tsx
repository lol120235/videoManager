import React from "react";
import { Provider } from "react-redux";
import { SafeAreaView, StyleSheet, View } from "react-native";
import store from "./src/redux/Store";
import SideBar from "./src/component/sidebar/SideBar";
import UploadVideoButton from "./src/component/sidebar/UploadVideoButton";
import VideoDisplay from "./src/component/main/VideoDisplay";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <SideBar />
          <VideoDisplay />
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
});
