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
import { openAIChat } from "../../lib/callOpenAI";

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

  const [messages, setMessages] = useState<IMessage[]>([
    newGptMessage(
      "Ohio, u can talk to me here. I can help u with video editting, for example, I can help u filter the content of the videos."
    ),
  ]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [gptThinking, setGptThinking] = useState(false);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    setGptThinking(true); // Display the "Typing..." animation while we're waiting for GPT to respond
  }, []);

  useEffect(() => {
    if (messages[0].quickReplies?.values.length === 3) setGptThinking(false);
    if (messages.length <= 1) return;
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
    openAIChat([
      { role: "system", content: systemPrompt },
      toChatgptFormat(messages),
    ]);
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
