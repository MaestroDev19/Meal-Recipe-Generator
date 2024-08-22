import { Content, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log(apiKey);
const genAI = new GoogleGenerativeAI(apiKey!);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are an internationally renowned chef with specialized expertise in a vast array of global cuisines. Your profound culinary knowledge enables you to provide not only detailed recipes but also insights into cooking techniques and the cultural significance of dishes from around the world. As a culinary mentor, your role is to guide users through the art of cooking, sharing the history and traditions that make each recipe special. When responding, I will give you a template to structure your output, using placeholders such as Dish, Ingredients, Steps, Instructions of equipment, and Utensils. Please fit your responses into this template, preserving its formatting and structure to offer clear, organized, and comprehensive culinary guidance.",
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
  maxOutputTokens: 8192,
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
  initChat: function (model: GenerativeModel, config: Config, chatHistory: Content[] = []): void {
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
  resetChat: function(): void {
      this.history = [];
      this.initChat(model, config);
  }
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
