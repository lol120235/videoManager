import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { useDispatch } from "react-redux";
import PopUpModal from "./PopUpModal";

const VideoDisplayCard = ({
  video,
}: {
  video: { name: string | null; uri: string | null; content: any[] | null };
}) => {
  const videoRef = useRef<Video>(null);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const isVideo = video.uri ? true : false;

  return isVideo ? (
    <TouchableOpacity
      onPress={async () => {
        setModalVisible(true);
      }}
    >
      <View
        style={{
          ...styles.container,
          borderColor: isVideo ? "#aaa" : "#ddd",
        }}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            dispatch({
              type: "REMOVE_VIDEO",
              payload: {
                name: video.name,
              },
            });
          }}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
        <PopUpModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <ScrollView style={{ padding: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Video Name: {video.name}
            </Text>
            {video.content?.map((c, i) => (
              <Text
                key={i}
                style={{
                  textAlign: "left",
                  borderBottomColor: "#ccc",
                  borderBottomWidth: 1,
                  width: "100%",
                  marginTop: 16,
                }}
              >
                {c.content}
                {"\n\n"}
              </Text>
            ))}
          </ScrollView>
        </PopUpModal>
        <View style={styles.thumbnail}>
          <Video
            ref={videoRef}
            source={{ uri: video.uri ?? "" }}
            style={{ flex: 1 }}
            shouldPlay={false}
            isLooping={false}
          />
          <Text style={styles.name}>{video.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ) : (
    <PlaceHolder />
  );
};

const PlaceHolder = () => {
  return (
    <View style={{ ...styles.container, borderColor: "#ddd" }}>
      <View style={styles.thumbnail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: "#ddd",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  thumbnail: {
    width: 250,
    height: 250,
  },
  name: {
    marginTop: 10,
    color: "#000",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default VideoDisplayCard;
