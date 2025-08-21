
import React from 'react';

export const GameHeader: React.FC = () => {
    return (
        <header className="text-center my-8 w-full max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-gray-300" style={{ fontFamily: 'Georgia, serif' }}>
                Echoes of Blackwood
            </h1>
            <p className="text-gray-500 mt-2 text-lg">An AI-Powered Dark Fantasy Adventure</p>
        </header>
    );
};
