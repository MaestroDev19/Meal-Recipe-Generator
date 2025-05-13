import type { RecipePreferences } from "@/types/recipe"

export async function generateRecipe(prompt: string, preferences: RecipePreferences): Promise<string> {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt must be a non-empty string")
    }

    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        mode: preferences.mode,
        preferences: {
          allergies: preferences.allergies,
          ingredients: preferences.ingredients,
          diet: preferences.diet,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate recipe")
    }

    return data.recipe || "Sorry, I couldn't generate a recipe at this time."
  } catch (error) {
    console.error("Error generating recipe:", error)
    throw error
  }
}
