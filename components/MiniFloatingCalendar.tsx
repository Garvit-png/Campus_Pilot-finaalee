
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Sparkles, Bot } from 'lucide-react';

interface MiniFloatingCalendarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedDate: number | null;
  setSelectedDate: (date: number | null) => void;
}

export const MiniFloatingCalendar: React.FC<MiniFloatingCalendarProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedDate, 
  setSelectedDate 
}) => {
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 3; // Mocking January 2026 starts on Thursday (index 4) - simplified offset
  const [robotMessage, setRobotMessage] = useState("Planning? You? That's hilarious!");

  const mockingMessages = [
    "Trying to organize your chaos? Cute.",
    "Look who's pretending to be productive!",
    "I give this schedule 2 days, max.",
    "A date? For what, procrastination?",
    "Wow, such ambition. Much wow.",
    "Clicking dates won't finish your tasks.",
    "Error 404: Motivation not found."
  ];

  useEffect(() => {
    if (isOpen) {
      const randomMsg = mockingMessages[Math.floor(Math.random() * mockingMessages.length)];
      setRobotMessage(randomMsg);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
      {/* Popup Container */}
      <div 
        className={`pointer-events-auto bg-white/95 backdrop-blur-2xl border border-blue-100/80 rounded-[32px] shadow-[0_30px_80px_-20px_rgba(37,99,235,0.35)] overflow-hidden mb-6 transition-all origin-bottom-right relative will-change-transform ring-4 ring-white/50 ${
          isOpen 
            ? 'w-[340px] opacity-100 scale-100 translate-y-0 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
            : 'w-[340px] h-[100px] opacity-0 scale-50 translate-y-24 pointer-events-none duration-150 ease-in'
        }`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="p-6 h-full flex flex-col relative z-10">
          {/* Header with Robot */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                 <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm">January 2026</h4>
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1">
                 Selection Mode <span className="text-base animate-pulse">⚡️</span>
              </p>
            </div>
            
            {/* Mocking Robot */}
            <div className="relative group cursor-help">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 transform hover:rotate-6 transition-all hover:scale-110 border-2 border-blue-50 relative overflow-hidden group-hover:border-blue-200">
                  <Bot className="w-6 h-6 text-blue-600 relative z-10" />
               </div>
               
               {/* Tooltip speech bubble */}
               <div className="absolute right-full mr-4 top-0 w-40 bg-slate-900 text-white text-[10px] p-4 rounded-2xl rounded-tr-none shadow-xl transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 pointer-events-none border border-slate-700 z-50">
                  <p className="font-medium leading-relaxed">"{robotMessage}"</p>
                  <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] border-t-slate-900 border-r-[10px] border-r-transparent" />
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-1 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100">
            <button className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-blue-100"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Select Day</span>
            <button className="w-8 h-8 flex items-center justify-center bg-white rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-blue-100"><ChevronRight className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {daysOfWeek.map((day, index) => (
              <div key={`${day}-${index}`} className="h-6 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-6">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`off-${i}`} className="h-9" />
            ))}
            {currentMonthDays.map(day => {
              const isActive = selectedDate === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isActive ? null : day)}
                  className={`h-9 w-full flex items-center justify-center rounded-xl text-[11px] font-bold transition-all relative group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110 z-10 ring-2 ring-white' 
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 hover:shadow-sm hover:z-10'
                  }`}
                >
                  {day}
                  {day === 19 && !isActive && (
                     <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-auto">
             <button 
                onClick={() => { setSelectedDate(null); setIsOpen(false); }}
                className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95"
             >
                Close
             </button>
             <button 
                onClick={() => setSelectedDate(null)}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
             >
                Clear Selection
             </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        id="tour-calendar"
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto w-16 h-16 rounded-[28px] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-500 group relative border-2 border-white/20 z-[101] backdrop-blur-sm ${
          isOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-110 active:scale-95 hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.6)]'
        }`}
      >
        {isOpen ? (
             <X className="w-7 h-7 text-white transition-transform duration-500" />
        ) : (
             <CalendarIcon className="w-7 h-7 text-white transition-transform duration-500" />
        )}
        
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-white border-[3px] border-blue-600 rounded-full animate-bounce shadow-sm" />
        )}
      </button>
    </div>
  );
};
