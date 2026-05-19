import React from 'react';
import { Building2, Bell, X } from 'lucide-react';

export interface Notification {
  id: number;
  text: string;
  eventName: string;
  eventId: string;
  timestamp: Date;
  read: boolean;
}

interface TopBarProps {
  notifications?: Notification[];
  onNotificationClick?: (eventId: string) => void;
  onClearNotifications?: () => void;
  onMarkRead?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  return (
    <header className="bg-white rounded-[24px] sm:rounded-[32px] px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2">
         {/* Custom SVG logo based on Robinhood */}
         <div className="text-[#cc2929]">
            <svg width="20" height="24" className="sm:w-6 sm:h-7" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L24 4V12C24 20 12 28 12 28C12 28 0 20 0 12V4L12 0Z" fill="currentColor"/>
              <path d="M12 2L4 5V12C4 18 12 24 12 24C12 24 20 18 20 12V5L12 2Z" fill="#ffefef"/>
              <path d="M7 9C7 9 10 16 12 16C14 16 17 9 17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
         </div>
         <div className="flex flex-col -space-y-1">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-800">robinhood</span>
            <span className="text-[9px] sm:text-[10px] tracking-widest font-medium text-slate-500">university</span>
         </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button className="text-slate-500 hover:text-slate-800 transition-colors p-1.5 hover:bg-slate-50 rounded-full">
          <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* The Notification Bell targeted by Tutorial */}
        <button 
          id="tour-notifications"
          className="text-slate-500 hover:text-[#cc2929] transition-colors relative p-1.5 hover:bg-slate-50 rounded-full"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#cc2929] rounded-full ring-2 ring-white animate-pulse" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-[#f8f9fb] rounded-full p-1 border border-slate-100">
          <button className="flex items-center gap-2 bg-white shadow-sm border border-slate-100 rounded-full px-4 py-1.5 text-[11px] font-bold text-slate-700">
            <span className="w-1.5 h-1.5 bg-[#cc2929] rounded-full animate-pulse" />
            ERP
          </button>
          <button className="flex items-center gap-2 hover:bg-white rounded-full px-4 py-1.5 text-[11px] font-bold text-slate-500 transition-colors">
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            LMS
          </button>
        </div>

        <button className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-[#f4f5f7] flex items-center justify-center text-xs sm:text-sm font-semibold text-slate-500 relative shrink-0">
          <svg className="absolute inset-0 w-full h-full text-[#cc2929]" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="60 100" strokeLinecap="round" className="opacity-80 -rotate-90 origin-center" />
          </svg>
          <span className="relative z-10">GG</span>
        </button>
      </div>
    </header>
  );
};
