
import { GoogleGenAI, Type } from "@google/genai";
import type { GameScene } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sceneSchema = {
    type: Type.OBJECT,
    properties: {
        description: {
            type: Type.STRING,
            description: "A vivid, third-person description of the current scene, atmosphere, and events. Keep it to 2-4 sentences.",
        },
        choices: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "An array of exactly 3 brief, action-oriented choices for the player.",
        },
    },
    required: ["description", "choices"],
};

const systemInstruction = `You are a master storyteller for a dark fantasy, souls-like text adventure game. Your style is gritty, atmospheric, and cinematic. You describe scenes in the third person. For every scene, provide a vivid description of a medieval village at night, focusing on danger and mystery. After the description, you MUST provide exactly 3 concise, action-oriented choices for the player. The game is set in the eerie, torch-lit village of Blackwood. The player is a knight in rugged, dark steel armor.`;

export async function getGameScene(prompt: string): Promise<GameScene> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: sceneSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const scene = JSON.parse(jsonText);
        
        // Basic validation
        if (!scene.description || !Array.isArray(scene.choices) || scene.choices.length !== 3) {
            throw new Error("Invalid scene format received from AI.");
        }

        return scene as GameScene;

    } catch (error) {
        console.error("Error generating game scene:", error);
        throw new Error("Failed to generate the next part of the adventure. The darkness consumes your path.");
    }
}

export async function generateSceneImage(description: string): Promise<string> {
    const imagePrompt = `Cinematic, dark fantasy, souls-like style, hyper-realistic, gritty, atmospheric photo. A third-person view of a knight in rugged dark medieval armor with a sword in the mysterious village of Blackwood at night. The scene is lit by flickering torches, with cobblestone streets and dark wooden houses with thatched roofs. ${description}`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating scene image:", error);
        throw new Error("Failed to visualize the scene.");
    }
}
