
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SceneDisplayProps {
    imageUrl?: string;
    description?: string;
    isLoading: boolean;
    isImageLoading: boolean;
}

export const SceneDisplay: React.FC<SceneDisplayProps> = ({ imageUrl, description, isLoading, isImageLoading }) => {
    return (
        <div className="w-full max-w-4xl bg-black/50 rounded-lg shadow-2xl shadow-black/40 overflow-hidden border border-gray-700">
            <div className="aspect-w-16 aspect-h-9 bg-gray-800 relative">
                {isImageLoading || !imageUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <img src={imageUrl} alt="Scene from Blackwood" className="w-full h-full object-cover transition-opacity duration-500 ease-in-out" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>
            <div className="p-6 md:p-8">
                <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                   {isLoading && !description ? (
                       <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        </div>
                   ) : (
                        <p className="text-lg md:text-xl leading-relaxed text-gray-300">
                            {description}
                        </p>
                   )}
                </div>
            </div>
        </div>
    );
};
