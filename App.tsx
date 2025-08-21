
import React, { useState, useEffect, useCallback } from 'react';
import type { GameState } from './types';
import { getGameScene, generateSceneImage } from './services/geminiService';
import { SceneDisplay } from './components/SceneDisplay';
import { ChoiceButton } from './components/ChoiceButton';
import { GameHeader } from './components/GameHeader';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastDescription, setLastDescription] = useState<string>('');

    const initialPrompt = "The adventure begins. The player, a knight in rugged armor, has just entered the eerie, torch-lit village of Blackwood. The streets are empty, and a cold fog clings to the cobblestones. Generate the starting scene and choices.";

    const fetchScene = useCallback(async (prompt: string, prevDescription: string = '') => {
        setIsLoading(true);
        if (gameState) {
             setIsImageLoading(true);
        }
        setError(null);
        
        try {
            const sceneData = await getGameScene(prompt);
            setGameState(prevState => ({
                ...(prevState || { imageUrl: '' }),
                ...sceneData
            }));
            setLastDescription(prevDescription); // Store the description that LED to this scene

            const newImageUrl = await generateSceneImage(sceneData.description);
            setGameState(prevState => {
                if (!prevState) return null;
                return { ...prevState, imageUrl: newImageUrl };
            });

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
            setIsImageLoading(false);
        }
    }, [gameState]);

    useEffect(() => {
        if (!process.env.API_KEY) {
            setError("API Key is missing. Please set the API_KEY environment variable.");
            setIsLoading(false);
            return;
        }
        fetchScene(initialPrompt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChoice = (choice: string) => {
        if (!gameState) return;
        const nextPrompt = `The current situation is: "${gameState.description}". The player chose to: "${choice}". Generate the next scene and 3 new choices.`;
        fetchScene(nextPrompt, gameState.description);
    };

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center text-red-400 bg-red-900/50 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">An Error Ocurred</h2>
                    <p>{error}</p>
                </div>
            );
        }

        if (!gameState) {
             return <SceneDisplay isLoading={true} isImageLoading={true} />;
        }

        return (
            <>
                <SceneDisplay
                    imageUrl={gameState.imageUrl}
                    description={gameState.description}
                    isLoading={isLoading}
                    isImageLoading={isImageLoading}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl px-4">
                    {gameState.choices.map((choice, index) => (
                        <ChoiceButton
                            key={index}
                            text={choice}
                            onClick={() => handleChoice(choice)}
                            disabled={isLoading}
                        />
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 font-serif">
           <GameHeader />
            <main className="w-full flex flex-col items-center justify-center flex-grow">
              {renderContent()}
            </main>
        </div>
    );
};

export default App;
