import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface RightPanelProps {
  setActiveTab?: (tab: string) => void;
}

export const RightPanel: React.FC<RightPanelProps> = () => {
  const profileSteps = [
    { label: 'Update bio', completed: true },
    { label: 'Interests', completed: false },
    { label: 'Extra-Curricular Activities', completed: false },
    { label: 'Projects', completed: false },
    { label: 'Publications / Research', completed: false },
    { label: 'Work Experience', completed: false },
    { label: 'Skills', completed: false },
    { label: 'Courses / Certifications', completed: false },
    { label: 'Achievements / Awards', completed: false },
  ];

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

      {/* Profile Strength Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-50 p-6 flex flex-col">
        <h3 className="text-base font-bold text-slate-800 mb-1">Profile strength</h3>
        <p className="text-[11px] text-slate-400 font-medium mb-5">Complete your profile to get discovered by recruiters & peers</p>
        
        {/* Progress Bar Container */}
        <div className="mb-6 flex flex-col items-end gap-1.5">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-rose-500 rounded-full w-[11%]" />
          </div>
          <span className="text-[11px] font-bold text-slate-500">11%</span>
        </div>

        {/* Requirements List */}
        <div className="space-y-4">
          {profileSteps.map((step, idx) => (
            <div key={idx} className="flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${step.completed ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-slate-400'} transition-colors`} />
                <span className={`text-[13px] font-medium transition-colors ${step.completed ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {step.label}
                </span>
              </div>
              
              {step.completed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-100 flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-3 h-3 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </aside>
  );
};
