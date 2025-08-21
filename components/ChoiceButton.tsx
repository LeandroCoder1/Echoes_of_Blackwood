
import React from 'react';

interface ChoiceButtonProps {
    text: string;
    onClick: () => void;
    disabled: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full px-6 py-4 text-lg text-gray-300 bg-gray-800 border border-gray-600 rounded-md shadow-lg transition-all duration-200 ease-in-out hover:bg-gray-700 hover:border-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500"
        >
            {text}
        </button>
    );
};
