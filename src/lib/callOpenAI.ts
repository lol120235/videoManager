import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
// import Config from "react-native-config";

async function openAIChat(messages: any[]) {
  const endpoint = "https://cpullm.openai.azure.com/";
  const azureKey = "46d9e39fe67a4821ab4bcb48e18db1fc";
  const deploymentId = "gpt4o-ictproject";

  if (!endpoint || !azureKey || !deploymentId) {
    throw new Error("Azure OpenAI credentials are not set");
  }

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureKey));
  const response = await client.getChatCompletions(deploymentId, messages);

  return response;
}

async function getEmbeddings(messages: any) {
  const endpoint = "https://chatgptserver.openai.azure.com/";
  const azureKey = "8b5ed8dd51c644cc9ee2c561576d214c";
  const deploymentId = "text-embedding-3-large";

  if (!endpoint || !azureKey || !deploymentId) {
    throw new Error("Azure OpenAI credentials are not set");
  }

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureKey));
  const response = await client.getEmbeddings(deploymentId, messages);

  return response;
}

export { openAIChat, getEmbeddings };
