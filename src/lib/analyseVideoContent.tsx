import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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

const splitVideoScreen = (
  videoData: string,
  interval: number
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const resultImages: string[] = [];
    const video = document.createElement("video");
    video.src = videoData;

    video.addEventListener("loadeddata", () => {
      const { duration } = video;
      let processedFrames = 0;

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

  var frames = await splitVideoScreen(video, 1);
  console.log(frames);

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
            ...frames.map((frame) => ({
              type: "image_url",
              image_url: { url: frame },
            })),
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: true,
    }),
  });

  const data = await response.json();
  console.log(data);
};

export default getVideoContent;
