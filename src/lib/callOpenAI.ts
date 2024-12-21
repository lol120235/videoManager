import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
// import Config from "react-native-config";

async function openAIChat(messages: any[]) {
  const endpoint = process.env.EXPO_PUBLIC_OPENAI_AZURE_URL;
  const azureKey = process.env.EXPO_PUBLIC_OPENAI_AZURE_KEY;
  const deploymentId = "gpt4o-ictproject";

  if (!endpoint || !azureKey || !deploymentId) {
    throw new Error("Azure OpenAI credentials are not set");
  }

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureKey));
  const response = await client.getChatCompletions(deploymentId, messages);

  return response;
}

async function getEmbeddings(messages: any) {
  const endpoint = process.env.EXPO_PUBLIC_OPENAI_AZURE_EMBD_URL;
  const azureKey = process.env.EXPO_PUBLIC_OPENAI_AZURE_EMBD_KEY;
  const deploymentId = "text-embedding-3-large";

  if (!endpoint || !azureKey || !deploymentId) {
    throw new Error("Azure OpenAI credentials are not set");
  }

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureKey));
  const response = await client.getEmbeddings(deploymentId, messages);

  return response;
}

export { openAIChat, getEmbeddings };
