import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-14 text-center rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] shadow-soft">
      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-[#F5EFE4] dark:bg-[#2F1A2D] text-[#C3532B] dark:text-[#E28555] mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-[#231522] dark:text-[#FBF8F2] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#7A6777] dark:text-[#9E8C9B] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
