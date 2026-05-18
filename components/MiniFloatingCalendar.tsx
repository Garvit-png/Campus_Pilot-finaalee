import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Bot } from 'lucide-react';

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
  const startOffset = 3; // Mocking January 2026 starts on Thursday
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
        className={`pointer-events-auto bg-[#fdfaf2] border border-[#ebdbb5] rounded-[32px] shadow-[0_30px_80px_-20px_rgba(204,41,41,0.25)] overflow-hidden mb-6 transition-all origin-bottom-right relative will-change-transform ring-4 ring-white/50 ${
          isOpen 
            ? 'w-[340px] opacity-100 scale-100 translate-y-0 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
            : 'w-[340px] h-[100px] opacity-0 scale-50 translate-y-24 pointer-events-none duration-150 ease-in'
        }`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#ebdbb5]/30 to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#cc2929]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fdfaf2] to-transparent pointer-events-none" />

        <div className="p-6 h-full flex flex-col relative z-10">
          {/* Header with Robot */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                 <h4 className="text-[10px] font-black text-[#cc2929] uppercase tracking-widest bg-[#cc2929]/10 px-3 py-1.5 rounded-lg border border-[#cc2929]/20 shadow-sm">January 2026</h4>
              </div>
              <p className="text-xs font-bold text-[#8c3a21] mt-1 flex items-center gap-1">
                 Selection Mode <span className="text-base animate-pulse">⚡️</span>
              </p>
            </div>
            
            {/* Mocking Robot */}
            <div className="relative group cursor-help">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#ebdbb5]/30 transform hover:rotate-6 transition-all hover:scale-110 border-2 border-[#ebdbb5] relative overflow-hidden group-hover:border-[#cc2929]/50">
                  <Bot className="w-6 h-6 text-[#cc2929] relative z-10" />
               </div>
               
               {/* Tooltip speech bubble */}
               <div className="absolute right-full mr-4 top-0 w-40 bg-[#8c3a21] text-white text-[10px] p-4 rounded-2xl rounded-tr-none shadow-xl transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 pointer-events-none border border-[#cc2929]/20 z-50">
                  <p className="font-medium leading-relaxed">"{robotMessage}"</p>
                  <div className="absolute top-0 -right-2 w-0 h-0 border-t-[10px] border-t-[#8c3a21] border-r-[10px] border-r-transparent" />
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 px-1 bg-white p-1.5 rounded-2xl border border-[#ebdbb5]/50">
            <button className="w-8 h-8 flex items-center justify-center bg-[#fdfaf2] rounded-xl text-slate-400 hover:text-[#cc2929] transition-all shadow-sm hover:shadow-md border border-transparent hover:border-[#ebdbb5]"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Select Day</span>
            <button className="w-8 h-8 flex items-center justify-center bg-[#fdfaf2] rounded-xl text-slate-400 hover:text-[#cc2929] transition-all shadow-sm hover:shadow-md border border-transparent hover:border-[#ebdbb5]"><ChevronRight className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {daysOfWeek.map((day, index) => (
              <div key={`${day}-${index}`} className="h-6 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">{day}</div>
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
                      ? 'bg-[#cc2929] text-white shadow-lg shadow-[#cc2929]/40 scale-110 z-10 ring-2 ring-white' 
                      : 'text-slate-600 hover:bg-[#cc2929]/10 hover:text-[#cc2929] hover:scale-110 hover:shadow-sm hover:z-10'
                  }`}
                >
                  {day}
                  {day === 19 && !isActive && (
                     <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#cc2929] rounded-full ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-auto">
             <button 
                onClick={() => { setSelectedDate(null); setIsOpen(false); }}
                className="flex-1 py-3.5 bg-white border border-[#ebdbb5] text-slate-500 hover:bg-[#ebdbb5]/10 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95"
             >
                Close
             </button>
             <button 
                onClick={() => setSelectedDate(null)}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#cc2929] to-[#8c3a21] text-white hover:shadow-[#cc2929]/20 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
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
        className={`pointer-events-auto w-16 h-16 rounded-[28px] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(204,41,41,0.4)] transition-all duration-500 group relative border-2 border-white/20 z-[101] backdrop-blur-sm ${
          isOpen ? 'bg-[#8c3a21] rotate-90 scale-90' : 'bg-gradient-to-br from-[#cc2929] to-[#8c3a21] hover:scale-110 active:scale-95 hover:shadow-[0_25px_50px_-12px_rgba(204,41,41,0.5)]'
        }`}
      >
        {isOpen ? (
             <X className="w-7 h-7 text-white transition-transform duration-500" />
        ) : (
             <CalendarIcon className="w-7 h-7 text-white transition-transform duration-500" />
        )}
        
        {!isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-white border-[3px] border-[#cc2929] rounded-full animate-bounce shadow-sm" />
        )}
      </button>
    </div>
  );
};
