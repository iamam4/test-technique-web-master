import React from 'react';

const SkeletonLoader = () => (
  <div className="grid gap-10 lg:grid-cols-2">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="flex flex-col animate-pulse">
        <div className="bg-gray-300 rounded-lg w-full h-60 mb-4"></div>
        <div className="bg-gray-300 rounded-lg h-6 w-1/3 mb-2"></div>
        <div className="bg-gray-300 rounded-lg h-4 w-1/2 mb-1"></div>
        <div className="bg-gray-300 rounded-lg h-4 w-1/5"></div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
