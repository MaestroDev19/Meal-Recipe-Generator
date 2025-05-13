export interface RecipePreferences {
    mode: "Fitness" | "Vegan" | "Normal"
    allergies: string
    ingredients: string
    diet: string
  }
  
  export interface Message {
    role: "user" | "assistant"
    content: string
  }
  