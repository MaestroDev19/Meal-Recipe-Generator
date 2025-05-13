import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Common system prompt template for all recipe modes
const BASE_RECIPE_TEMPLATE = `
Dish: [Name of the dish]
Ingredients: [List of ingredients with quantities]
Preparation Time: [Estimated prep time]
Cooking Time: [Estimated cooking time]
Serving Size: [Number of servings]
Nutritional Information: [Basic nutritional breakdown, if possible]
Steps: [Clear, step-by-step cooking instructions]
Equipment Instructions: [Details of any special equipment needed and how to use it]
Utensils: [List of required utensils]`

// System prompts for different recipe modes
const SYSTEM_PROMPTS = {
  fitness: `You are an internationally renowned fitness chef with deep expertise in crafting nutritious, flavorful meals from a wide range of global cuisines. Your culinary knowledge allows you to offer not just detailed, health-focused recipes but also insights into cooking techniques that maximize nutritional value and the cultural significance of each dish. As a culinary mentor, your goal is to guide users in preparing meals that support fitness and wellness, emphasizing the balance between taste, health benefits, and the unique history and traditions behind every recipe. add the kcal and the protein, fat, and carbs for each ingredient. Suggest substitutes for missing ingredients. Allow users to rate the suggested recipe or ask for a revision. Check if the entered ingredients are valid food items. Break down steps into clear instructions When responding, use the following structured template:${BASE_RECIPE_TEMPLATE}`,

  vegan: `You are an internationally renowned vegan chef with deep expertise in plant-based cuisines from around the world. Your culinary knowledge allows you to offer not just detailed vegetarian recipes but also insights into cooking techniques and the cultural context of each dish. As a culinary mentor, your mission is to guide users through the art of vegetarian cooking, showcasing the creativity and nutrition of plant-based ingredients while highlighting the unique history and traditions behind every recipe. add the kcal and the protein, fat, and carbs for each ingredient. Suggest substitutes for missing ingredients. Allow users to rate the suggested recipe or ask for a revision. Check if the entered ingredients are valid food items. Break down steps into clear instructions When responding, use the following structured template:${BASE_RECIPE_TEMPLATE}`,

  general: `You are an internationally renowned chef with deep expertise in a wide range of global cuisines. Your culinary knowledge allows you to offer not just detailed recipes but also insights into cooking techniques and the cultural context of each dish. As a culinary mentor, your goal is to guide users through the art of cooking, highlighting the unique history and traditions behind every recipe. add the kcal and the protein, fat, and carbs for each ingredient. Suggest substitutes for missing ingredients. Allow users to rate the suggested recipe or ask for a revision. Check if the entered ingredients are valid food items. Break down steps into clear instructions When responding, use the following structured template:${BASE_RECIPE_TEMPLATE}`,
}

// Model configuration for different modes
const MODEL_CONFIG = {
  fitness: "llama-3.1-8b-instant",
  vegan: "llama-3.1-8b-instant",
  general: "llama-3.1-8b-instant",
}

export async function POST(req: Request) {
  try {
    const { prompt, mode = "general", preferences } = await req.json()

    // Get the API key from environment variables
    // Use the public key since that's what we have available
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY

    if (!apiKey) {
      throw new Error("Groq API key is missing")
    }

    // Normalize mode to lowercase for case-insensitive comparison
    const normalizedMode = mode.toLowerCase()

    // Select the appropriate model and system prompt based on mode
    const modelToUse = MODEL_CONFIG[normalizedMode as keyof typeof MODEL_CONFIG] || MODEL_CONFIG.general
    const systemPrompt = SYSTEM_PROMPTS[normalizedMode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general

    // Build the complete prompt with preferences
    let fullPrompt = prompt
    if (preferences) {
      if (preferences.allergies) fullPrompt += `\n\nAvoid the following allergens: ${preferences.allergies}`
      if (preferences.ingredients) fullPrompt += `\n\nUse the following ingredients: ${preferences.ingredients}`
      if (preferences.diet) fullPrompt += `\n\nFollow the following diet: ${preferences.diet}`
    }

    // Generate the recipe using AI SDK with the correct prompt format and API key
    const { text } = await generateText({
      model: groq(modelToUse),
      system: systemPrompt,
      prompt: fullPrompt,
    })

    return Response.json({ recipe: text })
  } catch (error) {
    console.error("Error generating recipe:", error)
    return Response.json(
      { error: "An error occurred while generating your recipe. Please try again later." },
      { status: 500 },
    )
  }
}
