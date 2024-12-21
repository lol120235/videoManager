import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
// import Config from "react-native-config";

export async function callOpenAI(messages: any[]) {
  const endpoint: string = process.env.EXPO_PUBLIC_OPENAI_AZURE_URL;
  const azureKey: string = process.env.EXPO_PUBLIC_OPENAI_AZURE_KEY;
  const deploymentId = "gpt4o-ictproject";

  console.log(endpoint, azureKey);

  if (!endpoint || !azureKey || !deploymentId) {
    throw new Error("Azure OpenAI credentials are not set");
  }

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureKey));
  const response = await client.getChatCompletions(deploymentId, messages);

  return response;
}
