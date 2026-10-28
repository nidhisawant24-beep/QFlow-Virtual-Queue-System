import React from 'react';

const Badge = ({ status, size = 'sm' }) => {
  const norm = (status || '').toLowerCase();

  const styles = {
    open: 'bg-[#E4EBE3] text-[#476045] border-[#CCD7C8] dark:bg-[#1E2E20] dark:text-[#A3B899] dark:border-[#2C402E]',
    waiting: 'bg-[#FBF0E8] text-[#B8532F] border-[#F0D5C5] dark:bg-[#2D1B1C] dark:text-[#E28555] dark:border-[#4A2C2B]',
    serving: 'bg-[#F4CEBC] text-[#8C3415] border-[#E8AF94] dark:bg-[#3D1D16] dark:text-[#F4CEBC] dark:border-[#632E22] font-semibold',
    completed: 'bg-[#E4EBE3] text-[#476045] border-[#CCD7C8] dark:bg-[#1E2E20] dark:text-[#A3B899] dark:border-[#2C402E]',
    skipped: 'bg-[#F5EFE4] text-[#7A6777] border-[#E0D3C0] dark:bg-[#241723] dark:text-[#C5B5C3] dark:border-[#3E273A]',
    cancelled: 'bg-[#F5EFE4] text-[#8C3415] border-[#E5D7C7] dark:bg-[#2C191A] dark:text-[#E28555] dark:border-[#4A2627]',
    paused: 'bg-[#F5EFE4] text-[#7A6777] border-[#E0D3C0] dark:bg-[#241723] dark:text-[#C5B5C3] dark:border-[#3E273A]',
    closed: 'bg-[#F0EAE1] text-[#7A6777] border-[#DCCEC0] dark:bg-[#1C121B] dark:text-[#9E8C9B] dark:border-[#331E30]',
  };

  const labels = {
    open: 'Open & Active',
    waiting: 'In Queue',
    serving: 'Now Serving',
    completed: 'Completed',
    skipped: 'Skipped',
    cancelled: 'Cancelled',
    paused: 'Paused',
    closed: 'Closed',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3.5 py-1.5 text-xs font-semibold',
  };

  const activeStyle = styles[norm] || styles.open;
  const label = labels[norm] || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${activeStyle} ${sizeClasses[size]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          norm === 'serving'
            ? 'bg-[#C3532B] animate-pulse'
            : norm === 'waiting'
            ? 'bg-[#D87D50]'
            : norm === 'completed' || norm === 'open'
            ? 'bg-[#587356]'
            : 'bg-[#7A6777]'
        }`}
      />
      {label}
    </span>
  );
};

export default Badge;
