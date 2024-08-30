import {
  Content,
  GenerativeModel,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { Preferences } from "./app/page";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are an internationally renowned chef with deep expertise in a wide range of global cuisines. Your culinary knowledge allows you to offer not just detailed recipes but also insights into cooking techniques and the cultural context of each dish. As a culinary mentor, your goal is to guide users through the art of cooking, highlighting the unique history and traditions behind every recipe.

When responding, use the following structured template:

Dish: [Name of the dish]
Ingredients: [List of ingredients with quantities]
Preparation Time: [Estimated prep time]
Cooking Time: [Estimated cooking time]
Serving Size: [Number of servings]
Nutritional Information: [Basic nutritional breakdown, if possible]
Steps: [Clear, step-by-step cooking instructions]
Equipment Instructions: [Details of any special equipment needed and how to use it]
Utensils: [List of required utensils]
Ensure your response is concise and easy to follow. Focus on providing clear, actionable guidance, and be ready to adapt your recommendations based on user preferences, such as dietary restrictions, preferred cuisines, or desired skill level. Encourage users to ask questions about specific dishes, ingredients, or cooking techniques for personalized advice.`,
});

interface Config {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  responseMimeType: string;
}

export const config: Config = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 2000,
  responseMimeType: "text/plain",
};

interface ChatResponse {
  response: {
    text(): string;
  };
}

interface Chat {
  sendMessage(message: string): Promise<ChatResponse>;
}

export const mealChat = {
  chat: null as Chat | null,
  history: [] as Content[],
  initChat: function (model: GenerativeModel, config: Config): void {
    this.chat = model.startChat({
      generationConfig: config,
      history: this.history,
    });
  },
  sendMessage: async function (message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }
    const response = await this.chat.sendMessage(message);
    const responseText = response.response.text();

    this.history.push({ role: "user", parts: [{ text: message }] });
    this.history.push({ role: "model", parts: [{ text: responseText }] });

    return responseText;
  },
  resetChat: function (): void {
    this.history = [];
    this.initChat(model, config);
  },
};

mealChat.initChat(model, config);

export async function chef(message: string): Promise<string> {
  try {
    const response = await mealChat.sendMessage(message);
    return response;
  } catch (error) {
    console.log(error);
    return "Error";
  }
}
