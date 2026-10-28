import React, { useState } from 'react';

const PeakHourChart = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-[#7A6777]">
        No hourly data recorded today yet
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.customers), 10);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-base font-bold text-[#231522] dark:text-[#FBF8F2]">
            Queue Trend
          </h4>
          <p className="text-xs text-[#7A6777] dark:text-[#9E8C9B]">
            Hourly flow and dispatch capacity
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C3532B]"></span>
            <span className="text-[#685465] dark:text-[#D8CAB9]">Waiting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8FA88D]"></span>
            <span className="text-[#685465] dark:text-[#D8CAB9]">Served</span>
          </div>
        </div>
      </div>

      {/* Chart Bars with Thin Geometry */}
      <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2 border-b border-[#EDE4D6] dark:border-[#3D2539]">
        {data.map((item, index) => {
          const heightPct = Math.round((item.customers / maxVal) * 100);
          const servedPct = item.customers > 0 ? Math.round((item.served / item.customers) * 100) : 0;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 z-20 whitespace-nowrap rounded-xl bg-[#231522] text-[#FBF8F2] text-xs px-3 py-1.5 shadow-soft border border-[#3E273A] pointer-events-none">
                  <div className="font-semibold text-[#F4CEBC]">{item.hour}</div>
                  <div>Joined: {item.customers} | Served: {item.served}</div>
                </div>
              )}

              {/* Thin Elegant Bar */}
              <div
                style={{ height: `${Math.max(heightPct, 8)}%` }}
                className={`w-full max-w-[14px] rounded-full transition-all duration-300 relative overflow-hidden ${
                  isHovered ? 'bg-[#D87D50]' : 'bg-[#C3532B]/85'
                }`}
              >
                {/* Completed portion overlay in sage green */}
                <div
                  style={{ height: `${servedPct}%` }}
                  className="w-full bg-[#8FA88D] absolute bottom-0 left-0 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between items-center text-[10px] font-semibold text-[#8A7887] dark:text-[#9E8C9B] pt-3 px-1 overflow-x-auto">
        {data.map((item, idx) => (
          <span key={idx} className="truncate max-w-[45px] text-center">
            {item.hour.split(' ')[0]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PeakHourChart;
