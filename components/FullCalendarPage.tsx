import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { EVENTS_MOCK } from './EventsPage';

const LEGENDS = [
  { label: 'Competition / Hackathon', color: 'bg-[#cc2929]', category: 'Competition' },
  { label: 'Workshop / Seminar', color: 'bg-[#8c3a21]', category: 'Workshop' },
  { label: 'Fest / Culture', color: 'bg-[#ebdbb5]', category: 'Fest' },
  { label: 'Seminar', color: 'bg-[#a12323]', category: 'Seminar' }
];

const TODAY_DAY = new Date().getDate();
const TODAY_MONTH = 0; // January for mock purposes
const TODAY_YEAR = 2026;

// Helper to parse date string like "15 Feb 2026" into parts
const parseDate = (dateStr: string) => {
  const [day, monthStr, yearStr] = dateStr.split(' ');
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return {
    day: parseInt(day),
    month: monthMap[monthStr] || 0,
    year: parseInt(yearStr)
  };
};

export const FullCalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(0); 
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Filter and Process Events for Calendar
  const calendarEvents = useMemo(() => {
    return EVENTS_MOCK.map(e => {
       const parsed = parseDate(e.date);
       return {
         ...e,
         parsedDate: parsed
       };
    }).filter(e => {
       const matchesFilter = filter === 'All' || e.category === filter;
       const matchesMonth = e.parsedDate.month === currentMonth;
       const matchesYear = e.parsedDate.year === currentYear;
       return matchesFilter && matchesMonth && matchesYear;
     });
  }, [filter, currentMonth, currentYear]);
  
  const selectedDateEvents = selectedDate 
    ? calendarEvents.filter(e => e.parsedDate.day === selectedDate) 
    : [];

  const getEventColor = (category: string) => {
    switch (category) {
      case 'Competition': return 'bg-[#cc2929] shadow-[0_0_8px_rgba(204,41,41,0.6)]';
      case 'Workshop': return 'bg-[#8c3a21] shadow-[0_0_8px_rgba(140,58,33,0.6)]';
      case 'Seminar': return 'bg-[#a12323] shadow-[0_0_8px_rgba(161,35,35,0.6)]';
      case 'Fest': return 'bg-[#ebdbb5] shadow-[0_0_8px_rgba(235,219,181,0.6)]';
      default: return 'bg-slate-400';
    }
  };

  const getEventBadgeStyle = (category: string) => {
    switch (category) {
      case 'Competition': return 'text-[#cc2929] border-[#cc2929]/20 bg-[#cc2929]/5';
      case 'Workshop': return 'text-[#8c3a21] border-[#8c3a21]/20 bg-[#8c3a21]/5';
      case 'Seminar': return 'text-[#a12323] border-[#a12323]/20 bg-[#a12323]/5';
      case 'Fest': return 'text-[#8c3a21] border-[#ebdbb5]/40 bg-[#ebdbb5]/10';
      default: return 'text-slate-500 border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-500 overflow-hidden bg-transparent">
      {/* Tight Header - Retro Theme */}
      <div className="flex items-center justify-between bg-[#fdfaf2] px-5 py-3 rounded-2xl border border-[#ebdbb5] shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-[#ebdbb5]">
            <button onClick={() => setCurrentMonth(m => (m === 0 ? 11 : m - 1))} className="p-1.5 hover:bg-[#ebdbb5]/20 rounded-lg transition-all text-[#8c3a21]/60 hover:text-[#cc2929]"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-4 text-xs font-black uppercase tracking-widest text-[#8c3a21] min-w-[120px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={() => setCurrentMonth(m => (m === 11 ? 0 : m + 1))} className="p-1.5 hover:bg-[#ebdbb5]/20 rounded-lg transition-all text-[#8c3a21]/60 hover:text-[#cc2929]"><ChevronRight className="w-4 h-4" /></button>
          </div>
          
          <div className="flex gap-1">
            {['All', 'Competition', 'Workshop', 'Fest'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  filter === cat 
                    ? 'bg-[#cc2929] text-white shadow-[0_4px_12px_rgba(204,41,41,0.2)]' 
                    : 'text-slate-500 hover:bg-[#cc2929]/10 hover:text-[#cc2929]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Legend Strip */}
          <div className="hidden xl:flex items-center gap-4 border-r border-[#ebdbb5] pr-6 mr-2">
            {LEGENDS.map((leg) => (
              <div key={leg.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${leg.color}`} />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{leg.label}</span>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#cc2929] text-white text-[9px] font-black rounded-lg hover:bg-[#8c3a21] uppercase tracking-widest shadow-md shadow-[#cc2929]/20 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> Synchronize
          </button>
        </div>
      </div>

      {/* Adaptive Layout - Retro Theme */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className={`bg-white border border-[#ebdbb5] rounded-3xl shadow-sm flex flex-col transition-all duration-500 ease-in-out overflow-hidden ${
          selectedDate ? 'flex-[0.7]' : 'flex-1'
        }`}>
          <div className="grid grid-cols-7 border-b border-[#ebdbb5]/80 bg-[#fdfaf2]">
            {daysOfWeek.map(day => (
              <div key={day} className="py-3 text-center">
                <span className="text-[9px] font-black text-[#8c3a21]/60 uppercase tracking-widest">{day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`off-${i}`} className="border-r border-b border-[#ebdbb5]/30 bg-[#fdfaf2]/40 last:border-r-0" />
            ))}
            
            {monthDays.map(day => {
              const isActive = selectedDate === day;
              const isToday = day === TODAY_DAY && currentMonth === TODAY_MONTH;
              const eventsOnDay = calendarEvents.filter(e => e.parsedDate.day === day);
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isActive ? null : day)}
                  className={`relative group flex flex-col items-center justify-center border-r border-b border-[#ebdbb5]/30 last:border-r-0 hover:bg-[#ebdbb5]/15 transition-all ${
                    isActive ? 'bg-[#cc2929]/5' : ''
                  }`}
                >
                  {isToday && (
                    <div className="absolute inset-2 border border-[#cc2929]/55 rounded-2xl pointer-events-none z-0 shadow-[0_0_12px_rgba(204,41,41,0.15)]" />
                  )}
                  <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all relative z-10 ${
                    isActive ? 'bg-[#cc2929] text-white shadow-[0_4px_12px_rgba(204,41,41,0.3)] scale-110' : 
                    isToday ? 'bg-[#cc2929]/10 text-[#cc2929]' : 'text-slate-600 group-hover:text-[#cc2929]'
                  }`}>
                    {day}
                  </div>
                  <div className="flex gap-1 mt-2 h-1.5 relative z-10">
                    {eventsOnDay.slice(0, 3).map(e => (
                      <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${getEventColor(e.category)}`} title={e.category} />
                    ))}
                    {eventsOnDay.length > 3 && (
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-400" title="More..." />
                    )}
                  </div>
                </button>
              );
            })}
            {Array.from({ length: 42 - (daysInMonth + firstDayOfMonth) }).map((_, i) => (
              <div key={`fill-${i}`} className="border-r border-b border-[#ebdbb5]/30 bg-[#fdfaf2]/40 last:border-r-0" />
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="flex-[0.3] bg-[#fdfaf2] border border-[#ebdbb5] text-slate-800 rounded-3xl p-6 flex flex-col shadow-lg animate-in slide-in-from-right-8 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#cc2929]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 shrink-0 relative z-10">
              <div>
                <p className="text-[9px] font-black text-[#cc2929] uppercase tracking-widest">Day Observer</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight text-[#8c3a21]">{selectedDate} {monthNames[currentMonth]}</h3>
              </div>
              <button onClick={() => setSelectedDate(null)} className="p-2 bg-white hover:bg-[#ebdbb5]/20 border border-[#ebdbb5] rounded-xl transition-all shadow-sm">
                <ArrowRight className="w-4 h-4 text-[#8c3a21]/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar relative z-10">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="bg-white p-5 rounded-2xl border border-[#ebdbb5] group hover:border-[#cc2929]/40 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between mb-3">
                       <span className={`text-[8px] font-black uppercase border px-2 py-0.5 rounded-lg tracking-widest ${getEventBadgeStyle(event.category)}`}>
                         {event.category}
                       </span>
                       <span className="text-[9px] font-bold text-slate-400">{event.time}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 mb-4 group-hover:text-[#cc2929] transition-colors leading-snug">{event.title}</h4>
                    <div className="flex items-center text-[10px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 group-hover:text-[#cc2929] transition-colors" /> {event.location}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                   <Info className="w-10 h-10 mb-4 text-[#8c3a21]" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#8c3a21]">No Events Scheduled</p>
                </div>
              )}
            </div>
            <button className="mt-6 w-full py-4 bg-gradient-to-r from-[#cc2929] to-[#8c3a21] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[#cc2929]/20 transition-all shadow-md active:scale-[0.98] relative z-10">
              Add Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
