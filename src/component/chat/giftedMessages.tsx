import { IMessage } from "react-native-gifted-chat";

export function newUserMessage(text: string) {
  return {
    _id: new Date().toString(),
    text: text,
    createdAt: new Date(),
    user: {
      _id: "user",
    },
  };
}

export function newGptMessage(text: string) {
  return {
    _id: new Date().getTime(),
    text: text,
    createdAt: new Date(),
    user: {
      _id: "assistant",
      name: "assistant",
      // avatar: require("../assets/icon-cpu.png"),
    },
  } as IMessage;
}

export function toChatgptFormat(iMessages: IMessage[]) {
  const messages = iMessages
    .map((message) => ({
      role: message.user._id,
      content: message.text,
    }))
    .toReversed();

  return messages;
}
