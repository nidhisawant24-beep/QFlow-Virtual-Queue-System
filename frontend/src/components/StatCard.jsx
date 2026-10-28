import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, change, trend = 'up', subtitle }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-6 shadow-soft transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EFE4] dark:bg-[#341E32] text-[#C3532B] dark:text-[#E28555]">
            <Icon className="h-5 w-5" />
          </div>
        )}
        {change && (
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              trend === 'up'
                ? 'bg-[#E4EBE3] text-[#476045] dark:bg-[#1E2E20] dark:text-[#A3B899]'
                : 'bg-[#FBEBE8] text-[#A8421F] dark:bg-[#351A18] dark:text-[#F4CEBC]'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-3xl font-bold tracking-tight text-[#231522] dark:text-[#FBF8F2] mb-1">
          {value}
        </h4>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6777] dark:text-[#9E8C9B]">
          {title}
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#8A7887] dark:text-[#C5B5C3]">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
