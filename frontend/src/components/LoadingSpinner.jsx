import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3">
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-[#EDE4D6] border-t-[#C3532B] dark:border-[#3D2539] dark:border-t-[#E28555]`}
      />
      {text && (
        <p className="text-xs text-[#7A6777] dark:text-[#9E8C9B] font-medium tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
