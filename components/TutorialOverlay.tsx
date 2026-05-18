import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, AlertCircle } from 'lucide-react';

export interface TutorialStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onClose: () => void;
  onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ steps, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const step = steps[currentStep];
  const reqRef = useRef<number | null>(null);

  const updateRect = () => {
    const element = document.getElementById(step.targetId);
    if (element) {
      const newRect = element.getBoundingClientRect();
      setRect(prev => {
        if (!prev || Math.abs(prev.top - newRect.top) > 0.5 || Math.abs(prev.left - newRect.left) > 0.5 || prev.width !== newRect.width) {
          return newRect;
        }
        return prev;
      });
    } else {
      setRect(null); // Explicitly set null if not found
    }
  };

  useLayoutEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const element = document.getElementById(step.targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }

    const loop = () => {
      updateRect();
      reqRef.current = requestAnimationFrame(loop);
    };
    loop();

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      updateRect();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStep, step.targetId]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  // --- Fallback for missing elements: Centered Modal ---
  if (!rect) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/10 backdrop-blur-[2.5px] animate-in fade-in">
         <div className="bg-[#fdfaf2] p-8 rounded-[32px] shadow-2xl max-w-sm w-full m-4 border border-[#ebdbb5] flex flex-col gap-4 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-[#cc2929]/10 rounded-full flex items-center justify-center text-[#cc2929] font-black text-xs shadow-sm">
                     {currentStep + 1}/{steps.length}
                   </div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{step.title}</h3>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-[#cc2929] p-1 hover:bg-[#ebdbb5]/10 rounded-full transition-colors">
                   <X className="w-4 h-4" />
                </button>
             </div>
             
             <p className="text-sm text-slate-600 leading-relaxed font-medium">
               {step.content}
             </p>
             
             {/* Note for missing element */}
             <div className="bg-amber-50 text-amber-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-amber-100">
                <AlertCircle className="w-4 h-4" />
                <span>Focus element not visible in current view.</span>
             </div>

             <div className="flex gap-3 mt-2">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#ebdbb5]/10 transition-colors">
                   Skip
                </button>
                <button onClick={handleNext} className="flex-1 py-3 rounded-xl text-xs font-bold bg-[#cc2929] text-white hover:bg-[#8c3a21] transition-all shadow-lg shadow-[#cc2929]/20">
                   {currentStep === steps.length - 1 ? 'Finish' : 'Next'} 
                </button>
             </div>
         </div>
      </div>,
      document.body
    );
  }

  // --- Normal Flow: Highlight & Tooltip ---
  const TOOLTIP_WIDTH = 320;
  const TOOLTIP_MIN_HEIGHT = 200; 
  const GAP = 16;
  const PADDING = 16;
  const { width: vw, height: vh } = windowSize;

  let placement = step.position || 'bottom';

  if (step.targetId === 'tour-notifications') {
    placement = 'left';
  } else {
    if (placement === 'right' && (rect.right + TOOLTIP_WIDTH + GAP + PADDING > vw)) placement = 'bottom';
    if (placement === 'left' && (rect.left - TOOLTIP_WIDTH - GAP - PADDING < 0)) placement = 'bottom';
    if (placement === 'top' && (rect.top - TOOLTIP_MIN_HEIGHT - GAP - PADDING < 0)) placement = 'bottom';
    if (placement === 'bottom' && (rect.bottom + TOOLTIP_MIN_HEIGHT + GAP + PADDING > vh)) placement = 'top';

    if ((placement === 'left' || placement === 'right') && vw < (TOOLTIP_WIDTH + PADDING * 2)) {
      placement = rect.top > vh / 2 ? 'top' : 'bottom';
    }
  }

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    width: `${TOOLTIP_WIDTH}px`,
    zIndex: 10002,
    transition: 'opacity 0.2s',
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: '#fdfaf2',
    transform: 'rotate(45deg)',
    zIndex: 10003,
  };

  const borderStyle = '1px solid #ebdbb5'; 

  if (placement === 'top') {
    tooltipStyle.bottom = (vh - rect.top) + GAP;
    let left = rect.left + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
    left = Math.max(PADDING, Math.min(left, vw - TOOLTIP_WIDTH - PADDING));
    tooltipStyle.left = left;
    arrowStyle.bottom = '-6px';
    arrowStyle.left = Math.max(10, Math.min(TOOLTIP_WIDTH - 22, (rect.left + rect.width / 2) - left - 6));
    arrowStyle.borderBottom = borderStyle;
    arrowStyle.borderRight = borderStyle;

  } else if (placement === 'bottom') {
    tooltipStyle.top = rect.bottom + GAP;
    let left = rect.left + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
    left = Math.max(PADDING, Math.min(left, vw - TOOLTIP_WIDTH - PADDING));
    tooltipStyle.left = left;
    arrowStyle.top = '-6px';
    arrowStyle.left = Math.max(10, Math.min(TOOLTIP_WIDTH - 22, (rect.left + rect.width / 2) - left - 6));
    arrowStyle.borderTop = borderStyle;
    arrowStyle.borderLeft = borderStyle;

  } else if (placement === 'left') {
    tooltipStyle.right = (vw - rect.left) + GAP;
    let top = rect.top;
    top = Math.max(PADDING, Math.min(top, vh - TOOLTIP_MIN_HEIGHT - PADDING));
    tooltipStyle.top = top;
    arrowStyle.right = '-6px';
    arrowStyle.top = Math.max(10, Math.min(TOOLTIP_MIN_HEIGHT - 22, (rect.top + rect.height / 2) - top - 6));
    arrowStyle.borderTop = borderStyle;
    arrowStyle.borderRight = borderStyle;

  } else if (placement === 'right') {
    tooltipStyle.left = rect.right + GAP;
    let top = rect.top;
    top = Math.max(PADDING, Math.min(top, vh - TOOLTIP_MIN_HEIGHT - PADDING));
    tooltipStyle.top = top;
    arrowStyle.left = '-6px';
    arrowStyle.top = Math.max(10, Math.min(TOOLTIP_MIN_HEIGHT - 22, (rect.top + rect.height / 2) - top - 6));
    arrowStyle.borderBottom = borderStyle;
  }

  if (step.targetId === 'tour-notifications') {
    const dropdownLeft = Math.min(vw - 340, Math.max(16, rect.left - 260));
    tooltipStyle.left = `${dropdownLeft - TOOLTIP_WIDTH - 20}px`;
    tooltipStyle.top = `${rect.bottom + 12}px`;
    tooltipStyle.right = undefined;
    tooltipStyle.bottom = undefined;
    arrowStyle.display = 'none';
  }

  // Calculate 4 separate overlay bounds to create a native browser-supported backdrop-blur gap cutout!
  const clipTop = Math.max(0, rect.top - 8);
  const clipBottom = rect.bottom + 8;
  const clipLeft = Math.max(0, rect.left - 8);
  const clipRight = rect.right + 8;

  // Extremely soft, ultra-subtle 10% blur properties
  const glassStyle: React.CSSProperties = {
    backgroundColor: 'rgba(15, 23, 42, 0.08)', // Barely-there soft dark tint
    backdropFilter: 'blur(2.5px)', // 10% soft blur strength
    WebkitBackdropFilter: 'blur(2.5px)',
    zIndex: 10000,
    pointerEvents: 'auto',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* 1. Four Native HTML Divs to frame the cutout perfectly with full, robust browser backdrop-blur support */}
      {/* Top Block */}
      <div 
        style={{
          ...glassStyle,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: `${clipTop}px`,
        }}
      />
      {/* Bottom Block */}
      <div 
        style={{
          ...glassStyle,
          position: 'fixed',
          top: `${clipBottom}px`,
          left: 0,
          width: '100%',
          height: `${Math.max(0, vh - clipBottom)}px`,
        }}
      />
      {/* Left Block */}
      <div 
        style={{
          ...glassStyle,
          position: 'fixed',
          top: `${clipTop}px`,
          left: 0,
          width: `${clipLeft}px`,
          height: `${clipBottom - clipTop}px`,
        }}
      />
      {/* Right Block */}
      <div 
        style={{
          ...glassStyle,
          position: 'fixed',
          top: `${clipTop}px`,
          left: `${clipRight}px`,
          width: `${Math.max(0, vw - clipRight)}px`,
          height: `${clipBottom - clipTop}px`,
        }}
      />

      {/* 2. Glass spotlight frame border with 3D shadow rounding (pointer-events-none) */}
      <div 
        className="fixed z-[10001] ring-[3px] ring-white/85 pointer-events-none rounded-[18px] transition-all duration-200 shadow-[0_0_0_12px_rgba(15, 23, 42, 0.08),0_8px_30px_rgba(0,0,0,0.06)]"
        style={{
          top: `${clipTop}px`,
          left: `${clipLeft}px`,
          width: `${clipRight - clipLeft}px`,
          height: `${clipBottom - clipTop}px`,
        }}
      />

      {/* Static Skeleton Notification Dropdown - Reveals ONLY during the Notification tutorial step */}
      {step.targetId === 'tour-notifications' && (
        <div 
          className="fixed z-[10002] bg-[#fdfaf2] border border-[#ebdbb5] w-[320px] rounded-[24px] shadow-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
          style={{
            top: `${rect.bottom + 12}px`,
            left: `${Math.min(vw - 340, Math.max(16, rect.left - 260))}px`,
          }}
        >
          {/* Dropdown Header */}
          <div className="flex justify-between items-center border-b border-[#ebdbb5]/60 pb-3">
             <span className="text-[10px] font-black text-[#cc2929] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#cc2929] rounded-full animate-ping" />
                Alerts Vault
             </span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                3 New
             </span>
          </div>

          {/* Skeleton Alert Entries */}
          <div className="flex flex-col gap-3">
             {/* Item 1 */}
             <div className="flex gap-3 bg-white p-3 rounded-2xl border border-[#ebdbb5]/40 hover:border-[#cc2929]/30 transition-all">
                <div className="w-8 h-8 bg-[#cc2929]/10 rounded-xl flex items-center justify-center shrink-0">
                   <span className="text-xs">🔥</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                   <span className="text-[9px] font-black text-[#cc2929] uppercase tracking-widest leading-none">CLOSING SOON</span>
                   <p className="text-xs font-bold text-slate-700 leading-snug">Global AI Hackathon registration closes in 4 hours!</p>
                   <span className="text-[8px] font-bold text-slate-400">10 mins ago</span>
                </div>
             </div>

             {/* Item 2 */}
             <div className="flex gap-3 bg-white p-3 rounded-2xl border border-[#ebdbb5]/40 hover:border-[#cc2929]/30 transition-all">
                <div className="w-8 h-8 bg-[#ebdbb5]/30 rounded-xl flex items-center justify-center shrink-0">
                   <span className="text-xs">🤝</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                   <span className="text-[9px] font-black text-[#8c3a21] uppercase tracking-widest leading-none">TEAM INVITE</span>
                   <p className="text-xs font-bold text-slate-700 leading-snug">Garvit invited you to join team 'Antigravity'</p>
                   <div className="flex gap-2 mt-1.5">
                      <button className="px-3 py-1 bg-[#cc2929] text-white text-[8px] font-black uppercase tracking-wider rounded-md hover:bg-[#8c3a21] transition-colors">
                         Accept
                      </button>
                      <button className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-500 text-[8px] font-black uppercase tracking-wider rounded-md hover:bg-slate-100 transition-colors">
                         Decline
                      </button>
                   </div>
                </div>
             </div>

             {/* Item 3 */}
             <div className="flex gap-3 bg-white p-3 rounded-2xl border border-[#ebdbb5]/40 hover:border-[#cc2929]/30 transition-all">
                <div className="w-8 h-8 bg-[#cc2929]/10 rounded-xl flex items-center justify-center shrink-0">
                   <span className="text-xs">🚀</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                   <span className="text-[9px] font-black text-[#cc2929] uppercase tracking-widest leading-none">NEW EVENT</span>
                   <p className="text-xs font-bold text-slate-700 leading-snug">Kaggle Masterclass: Advanced ML pipelines announced.</p>
                   <span className="text-[8px] font-bold text-slate-400">1 hour ago</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 3. The Instruction Tooltip */}
      <div 
        style={tooltipStyle} 
        className="pointer-events-auto bg-[#fdfaf2] p-6 rounded-[24px] shadow-2xl border border-[#ebdbb5] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300"
      >
        <div style={arrowStyle} className="shadow-sm border-t border-l border-[#ebdbb5]" />
        <div className="flex justify-between items-start relative z-10">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#cc2929]/10 rounded-full flex items-center justify-center text-[#cc2929] font-black text-xs shadow-sm">
                {currentStep + 1}/{steps.length}
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">{step.title}</h3>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-[#cc2929] p-1 hover:bg-[#ebdbb5]/15 rounded-full transition-colors">
             <X className="w-4 h-4" />
           </button>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
          {step.content}
        </p>
        <div className="flex gap-3 mt-2 relative z-10">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-[#ebdbb5]/15 transition-colors border border-transparent hover:border-[#ebdbb5]">
             Skip
          </button>
          <button onClick={handleNext} className="flex-1 py-3 rounded-xl text-xs font-bold bg-[#cc2929] text-white hover:bg-[#8c3a21] transition-all shadow-lg shadow-[#cc2929]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
             {currentStep === steps.length - 1 ? 'Finish' : 'Next'} 
             {currentStep !== steps.length - 1 && <ChevronRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
