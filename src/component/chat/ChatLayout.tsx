// write me a chat layout component
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Surface, useTheme } from "react-native-paper";
import {
  newGptMessage,
  newUserMessage,
  toChatgptFormat,
} from "./giftedMessages";
import ResetChatButton from "./ResetChatButton";
import { getEmbeddings, openAIChat } from "../../lib/callOpenAI";
import { useDispatch, useSelector } from "react-redux";
import { cosineSimilarity } from "../../lib/calFunctions";
import { ProdInputs } from "@tensorflow/tfjs";

export default function ChatLayout() {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 16,
      borderRadius: 12,
      backgroundColor: "#f0f0f0",
    },
    messageContainer: {
      backgroundColor: theme.colors.background,
    },
    quickReplyContainer: {
      maxWidth: "auto",
      minHeight: "auto",
    },
    textInput: {
      backgroundColor: "transparent",
    },
  });

  const data = useSelector((state: any) => state).videos.videos;
  console.log(data);

  const [messages, setMessages] = useState<IMessage[]>([
    newGptMessage(
      "Ohio, u can talk to me here. I can help u with video editting, for example, I can help u filter the content of the videos."
    ),
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [gptThinking, setGptThinking] = useState(false);

  interface provideData {
    [key: string]: string[];
  }

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    setGptThinking(true); // Display the "Typing..." animation while we're waiting for GPT to respond
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;
    if (messages[0].user._id === "assistant") return;
    // if (messages[0].user._id === "gpt") {
    //   if (messages[0].quickReplies?.values) return;
    //   setQuickReplies([]);
    //   const getQuickReplies = async () => {
    //     let replies: string[] = [];

    //     for (const message of ["", "", ""]) {
    //       const newReply = await getQuickReply(messages, replies);
    //       replies = [...replies, newReply];
    //     }

    //     setQuickReplies(replies);
    //   };
    // try {
    //   getQuickReplies();
    // } catch (error) {
    //   setGptThinking(false);
    //   console.log(error);
    // }
    // return;
    // }

    const systemPrompt =
      "You are an assistant for video processing. You can help the user with video editing. ";

    const relatedData: provideData = {};
    getEmbeddings(messages[0].text).then((embeddings) => {
      for (const video of data) {
        for (const content of video.content) {
          if (content) {
            if (cosineSimilarity(content[1], embeddings) >= 0.7) {
              if (!relatedData[video.name]) {
                relatedData[video.name] = [content[0]];
              } else {
                relatedData[video.name].push(content[0]);
              }
            }
          }
        }
      }
    });

    var convertedData = "";
    for (const key in relatedData) {
      convertedData += key + ": \n" + relatedData[key].join("\n") + "\n\n";
    }

    console.log("Related Data: ");
    console.log(convertedData);

    openAIChat([
      { role: "system", content: systemPrompt + "\n\n" + convertedData },
      ...toChatgptFormat(messages.slice(1)),
    ]).then((response) => {
      setGptThinking(false);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          newGptMessage(
            response.choices[0].message?.content ?? "What can i say?"
          ),
        ])
      );
    });
  }, [messages]);

  return (
    // <View style={{ flex: 1 }}>
    <Surface style={styles.container}>
      <ResetChatButton
        resetFunction={() => {
          setMessages([
            newGptMessage(
              "Ohio, u can talk to me here. I can help u with video editting, for example, I can help u filter the content of the videos."
            ),
          ]);
          setGptThinking(false);
        }}
      />
      <GiftedChat
        user={{ _id: "user" }}
        messages={messages}
        isTyping={gptThinking}
        keyboardShouldPersistTaps={"never"}
        onSend={onSend}
        onQuickReply={([reply]) => {
          onSend([newUserMessage(reply.value)]);
        }}
        messagesContainerStyle={styles.messageContainer}
        quickReplyStyle={styles.quickReplyContainer}
      />
    </Surface>
    // </View>
  );
}
