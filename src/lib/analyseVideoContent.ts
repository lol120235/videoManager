import { useState } from "react";
import { useSelector } from "react-redux";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
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

const splitVideoScreen = async (video: string) => {
  try {
    const outputDir = "./temp";
    await RNFS.mkdir("./temp");

    const command = `-i ${video} -vf fps=1 ${outputDir}/frame_%04d.png`;

    FFmpegKit.execute(
      `-i ${video} -vf fps=1 ${outputDir}/frame_%04d.png.mp4`
    ).then(async (session) => {
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        console.log("Encode completed successfully. ");
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log("Encode was canceled. ");
      } else {
        throw new Error(`Encode failed. Command: ${command}`);
      }
    });

    const files = await RNFS.readDir(outputDir);
    const base64Images = await Promise.all(
      files.map(async (file) => {
        const base64 = await RNFS.readFile(file.path, "base64");
        return `data:image/png;base64,${base64}`;
      })
    );

    return base64Images;
  } catch (error) {
    console.error(error);
  }
};

const getVideoContent = async (video: string) => {
  if (!video) {
    throw new Error("Video not found");
  }

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
