import { useState } from "react";
import { useSelector } from "react-redux";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import RNFS from "react-native-fs";

const baseURL = "http://localhost:1234/v1";
const port = 1234;
const api_key = "lm-studio";
const model = "cjpais/llava-1.6-mistral-7b-gguf";

const getVideo = async (videoName: string) => {
  const video = useSelector((state: any) =>
    state.videos.videos.find((video: any) => video.name === videoName)
  );
  return video;
};

const splitVideoScreen = async (video: string) => {};

const getVideoContent = async (video: string) => {
  if (!video) {
    throw new Error("Video not found");
  }

  FFmpegKit.execute("-version").then((session) => {
    console.log(
      "FFmpeg process started with sessionId " + session.getSessionId()
    );
  });

  const videoFrames = await splitVideoScreen(video);

  console.log(videoFrames?.[0]);

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${api_key}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: "Always answer in rhymes." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the content of the video with URI. `,
            },
            // {
            //   type: "video",
            //   video: video,
            // },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get video content");
  }

  const result = await response.json();
  console.log(result);
  return result;
};

export default getVideoContent;
