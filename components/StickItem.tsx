
import React from 'react';

interface StickItemProps {
  color?: string;
  isBundled?: boolean;
}

export const StickItem: React.FC<StickItemProps> = ({ color = "bg-green-400", isBundled = false }) => {
  return (
    <div className={`w-2 h-12 ${color} border border-gray-600 rounded-full rotate-[15deg] ${isBundled ? 'mx-[-2px]' : 'mx-1'}`}></div>
  );
};
