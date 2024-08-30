"use client";
import ChatInterface from "@/components/chat";
import { chef } from "@/gemini";
import { useState } from "react";
import { PreferencesForm } from "@/components/preferences";
export interface Preferences {
  dietaryPreferences: string;
  allergies: string;
  skillLevel: string;
  servingSize: string;
}
export default function Page() {
  const [preferences, setPreferences] = useState<Preferences>({
    dietaryPreferences: "",
    allergies: "",
    skillLevel: "",
    servingSize: "",
  });

  const handlePreferencesChange = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
  };

  return (
    <div>
      <ChatInterface
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
        onRecipeSearch={async (input: string) => {
          let prompt = input;

          if (Object.values(preferences).some((pref) => pref.length > 0)) {
            prompt = `Recipe request: ${input}\n\nPreferences:`;
            if (preferences.dietaryPreferences.length > 0) {
              prompt += `\nDietary: ${preferences.dietaryPreferences}`;
            }
            if (preferences.allergies.length > 0) {
              prompt += `\nAllergies: ${preferences.allergies}`;
            }
            if (preferences.skillLevel.length > 0) {
              prompt += `\nSkill Level: ${preferences.skillLevel}`;
            }
            if (preferences.servingSize) {
              prompt += `\nServing Size: ${preferences.servingSize}`;
            }
          }

          const result = await chef(prompt);
          return result;
        }}
      />
    </div>
  );
}

// ... Add PreferencesForm component here or in a separate file
