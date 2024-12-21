import { useEffect, useState } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { useSelector } from "react-redux";
import { callOpenAI } from "./callOpenAI";

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

const splitVideoScreen = (
  videoData: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const resultImages: string[] = [];
    const video = document.createElement("video");
    video.src = videoData;

    video.addEventListener("loadeddata", () => {
      const { duration } = video;
      let processedFrames = 0;
      const interval = duration / Math.log2(duration) * 2;

      for (let j = 0; j < duration; j += interval) {
        video.currentTime = j;
        video.addEventListener("seeked", function onSeeked() {
          resultImages.push(generateThumbnail());
          processedFrames++;
          if (processedFrames >= duration / interval) {
            video.removeEventListener("seeked", onSeeked);
            resolve(resultImages);
          }
        });
      }
    });

    video.addEventListener("error", (e) => {
      reject(new Error("Failed to load video"));
    });

    function generateThumbnail(): string {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }
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
      const response = await callOpenAI([
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

  const response = await callOpenAI([
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
  return content;
};

export { getVideo, getVideoContent, formatVideoContent, analyseVideoContent };
