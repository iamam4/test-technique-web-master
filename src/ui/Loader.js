import React from 'react';

const Loader = () => {

    const delays = [0, 0.1, 0.2];

    return (
        <div className="flex justify-center items-center h-screen gap-4">
            {delays.map((delay, index) => (
                <div 
                    key={index} 
                    className="animate-ping" 
                    style={{ animationDelay: `${delay}s` }}
                >
                    <div className="rounded-full h-2 w-2 bg-gray-900"></div>
                </div>
            ))}
        </div>
    );
}

export default Loader;
