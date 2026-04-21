import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export const MainDashboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Event Card 1 */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex flex-col hover:shadow-lg transition-all duration-300">
         {/* Header */}
         <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              RU
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-800">MaNaS</h3>
               <p className="text-[11px] text-slate-400">6/1/2026</p>
            </div>
         </div>

         {/* Poster Image Area */}
         <div className="w-full bg-[#cc2929] rounded-[24px] overflow-hidden mb-6 relative aspect-[16/9] flex items-center justify-center relative shadow-inner">
            {/* Background Text Pattern */}
            <div className="absolute inset-0 opacity-10 flex flex-col justify-between p-4 mix-blend-overlay break-words overflow-hidden leading-none text-[120px] font-black text-black">
               GUGUGUGUGUGUGUGUGU
            </div>
            {/* Content Foreground */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 bg-[#ebdbb5] w-[80%] h-[80%] rounded-xl shadow-2xl border-4 border-[#fff1d6]">
               <h2 className="text-[#a12323] font-black text-2xl mb-4 leading-tight">
                 SOLVING THE MYSTERIES OF<br/>SLEEP: NARCOLEPSY- SLEEP<br/>STRESS AND OREXIN
               </h2>
               <div className="flex gap-2">
                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#dfa47e]/30 text-[#8c3a21] border border-[#d68f63] rounded-full text-[10px] font-bold">
                    <CalendarIcon className="w-3 h-3" /> 7th Jan 2026
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#dfa47e]/30 text-[#8c3a21] border border-[#d68f63] rounded-full text-[10px] font-bold">
                    <Clock className="w-3 h-3" /> 10:00 AM - 11:00 AM
                 </span>
                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#dfa47e]/30 text-[#8c3a21] border border-[#d68f63] rounded-full text-[10px] font-bold">
                    <MapPin className="w-3 h-3 text-rose-700" /> Mini Auditorium
                 </span>
               </div>
               
               <div className="mt-8 flex items-center gap-6 text-left w-full pl-8">
                 <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl shrink-0">
                    <img src="https://i.pravatar.cc/250?img=11" alt="Speaker" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="text-[#c73d3d] font-black text-xl mb-1">Dr. Mahesh K. Kaushik</h3>
                    <p className="text-sm font-semibold text-[#8c3a21]">Assistant Professor and<br/>Neuroscientist<br/>IIIS, University of<br/>TSUKUBA, Japan</p>
                 </div>
               </div>
            </div>
         </div>

         {/* Content Description */}
         <p className="text-sm text-slate-700 leading-relaxed mb-1 inline">
           MaNaS is pleased to organise a Guest Lecture by Dr. Mahesh Kaushik, Assistant Professor & Neuroscientist, IIIS, University of Tsukuba, Japan. Dr. Kaushik will ... <span className="text-rose-600 hover:text-rose-700 cursor-pointer text-sm font-medium">Read more</span>
         </p>
         
         <hr className="my-5 border-slate-100" />

         <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
               <MapPin className="w-3.5 h-3.5" /> Mini auditorium
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
               <CalendarIcon className="w-3.5 h-3.5" /> Wednesday, 7 January 2026 at 10:00 am
            </span>
         </div>
      </div>

      {/* Event Card 2 */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex flex-col hover:shadow-lg transition-all duration-300">
         <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              RU
            </div>
            <div>
               <h3 className="text-sm font-bold text-slate-800">Rishihood University</h3>
               <p className="text-[11px] text-slate-400">10/9/2025</p>
            </div>
         </div>
         <div className="w-full bg-[#cc2929] rounded-[24px] h-32 overflow-hidden flex items-center justify-center">
            {/* Placeholder graphic */}
         </div>
      </div>

    </div>
  );
};
