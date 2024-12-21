import { useEffect, useState } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { useSelector } from "react-redux";
import { openAIChat } from "./callOpenAI";

const baseURL = "https://codingteam3.cpu.edu.hk/api"; //"http://localhost:1234/v1";
const port = 1234;
const apiKey = "lm-studio";
const model = "cjpais/llava-1.6-mistral-7b-gguf";

const getVideo = async (videoName: string) => {
  const video = useSelector((state: any) =>
    state.videos.videos.find((video: any) => video.name === videoName)
  );
  return video;
};

const splitVideoScreen = (videoData: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");
    videoElement.src = videoData;
    videoElement.crossOrigin = "anonymous";

    videoElement.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const frames: string[] = [];
      let interval = 1;

      const duration = videoElement.duration;
      if (duration > 3600) {
        interval = 40;
      } else if (duration > 1800) {
        interval = 18;
      } else if (duration > 600) {
        interval = 12;
      } else if (duration > 300) {
        interval = 6;
      } else if (duration > 60) {
        interval = 4;
      } else if (duration > 30) {
        interval = 3;
      }

      videoElement.addEventListener("seeked", () => {
        context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/png"));

        if (videoElement.currentTime < videoElement.duration) {
          videoElement.currentTime += interval;
        } else {
          resolve(frames);
        }
      });

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      videoElement.currentTime = 0;
    });

    videoElement.addEventListener("error", (error) => {
      reject(error);
    });
  });
};

const getVideoContent = async (video: string) => {
  // const [frames, setFrames] = useState<string[]>([]);
  if (!video) {
    throw new Error("Video not found");
  }

  var frames = await splitVideoScreen(video);
  console.log(frames);

  const contents = await Promise.all(
    frames.map(async (frame) => {
      const response = await openAIChat([
        {
          role: "system",
          content: "You will be provided a video with URI. ",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the content of the video with URI. You should mention the scene, objects, meaning of the video. `,
            },
            {
              type: "image_url",
              image_url: { url: frame },
            },
          ],
        },
      ]);

      const content = response.choices[0].message?.content;
      return content;
    })
  );

  console.log("Video Content (Unformatted)");
  console.log(contents);
  return contents;
};

const formatVideoContent = async (video: string) => {
  const convertSecondToTime = (seconds: number) => {
    return `${Math.floor(seconds / 3600)}:${Math.floor(
      (seconds % 3600) / 60
    )}:${Math.floor(seconds % 60)}`;
  };
  const result = await getVideoContent(video);
  const videoContents = result.map(
    (content, index) => `[${convertSecondToTime(index * 3)}]\n${content}`
  );

  console.log("Formatted Video Content");
  console.log(videoContents);
  return videoContents;
};

function splitIntoScenes(summary: string): string[] {
  const sceneRegex = /\[.*?\] - \[.*?\]/g;
  const scenes = summary.split(sceneRegex);
  console.log(scenes);
  return [summary];
}

const analyseVideoContent = async (video: string) => {
  const videoContents = await formatVideoContent(video);

  const systemPrompt =
    "You will be provided with contents of a video with timestamps. Please provide a summary of the video." +
    "\n" +
    "Example Input: " +
    "\n" +
    "[00:00:00] The scene is inside a garden. There is a cat nearby a tree." +
    "\n" +
    "[00:00:03] The cat is playing with a ball. The cat is black and white." +
    "\n" +
    "[00:00:06] The scene is inside a house. There is a boy eating. " +
    "\n\n" +
    "Example Output: " +
    "\n" +
    "[00:00:00] - [00:00:03] The scene is inside a garden. There is a cat black and white nearby a tree playing with a ball" +
    "\n" +
    "[00:00:06] - [00:00:06] The scene is inside a house. There is a boy eating. ";

  const response = await openAIChat([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content:
        "Here is the video contents: " + "\n" + videoContents.join("\n\n"),
    },
  ]);

  const content = response.choices[0].message?.content;
  console.log("Video Content (Analysed)");
  console.log(content);

  if (content) {
    console.log("Splitted Scenes");
    const scenes = content.split("\n\n");
    console.log(scenes);
    return scenes;
  }
};

export { getVideo, getVideoContent, formatVideoContent, analyseVideoContent };
