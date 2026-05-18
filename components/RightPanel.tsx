import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface RightPanelProps {
  setActiveTab?: (tab: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = () => {
  return (
    <aside className="w-[400px] shrink-0 h-full overflow-y-auto space-y-6 pb-20 no-scrollbar pr-2">
      
      {/* Breakfast Card */}
      <div className="bg-[#fcfdff] rounded-[24px] shadow-sm border border-slate-50 flex overflow-hidden w-full relative h-[100px]">
        {/* Left Vertical Strip */}
        <div className="bg-[#b33949] w-12 flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-bold uppercase tracking-widest -rotate-90 whitespace-nowrap pt-1">
            Breakfast
          </span>
        </div>
        {/* Content */}
        <div className="p-5 flex flex-col justify-center bg-white/50 w-full rounded-r-[24px]">
           <span className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center">
             07:00 AM - 09:30 AM
           </span>
           <span className="text-sm font-bold text-slate-700">
             Menu will be updated soon
           </span>
        </div>
      </div>
      
    </aside>
  );
};
