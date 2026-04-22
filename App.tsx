
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar, Notification } from './components/TopBar';
import { MainDashboard } from './components/MainDashboard';
import { RightPanel } from './components/RightPanel';
import { FullCalendarPage } from './components/FullCalendarPage';
import { EventsPage, EVENTS_MOCK, CampusEvent } from './components/EventsPage';
import { MiniFloatingCalendar } from './components/MiniFloatingCalendar';
import { LoginPage } from './components/LoginPage';
import { MessageSquareWarning, Ghost, ArrowRight, X, Radio, BellRing, Layout } from 'lucide-react';

// Helper to strictly parse event dates for comparison
const parseEventDate = (dateStr: string) => {
  // Expected format: "DD Mon YYYY" e.g. "15 Feb 2026"
  const parts = dateStr.split(' ');
  if (parts.length < 3) return new Date(); // Fallback to now if format is weird
  
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const day = parseInt(parts[0]);
  const month = monthMap[parts[1]] || 0;
  const year = parseInt(parts[2]);
  
  return new Date(year, month, day);
};

interface ToastItem {
  id: number;
  text: string;
  eventName: string;
  eventId: string;
  isExiting: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMiniCalendarOpen, setIsMiniCalendarOpen] = useState(false);
  const [selectedGlobalDate, setSelectedGlobalDate] = useState<number | null>(null);
  const [exploringEventId, setExploringEventId] = useState<string | null>(null);
  
  // Transition State for Events Tab
  const [showEventsSplash, setShowEventsSplash] = useState(false);

  // State to track if we are in a deep detail view (to hide navbars)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Global Mocking State
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [notInterestedIds, setNotInterestedIds] = useState<Set<string>>(new Set());
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  
  // Initialize with some IDs already "viewed" so the user doesn't see everything as NEW
  const [viewedEventIds, setViewedEventIds] = useState<Set<string>>(new Set(['e_mumbai', 'e2', 'e_design', 'e_cloud'])); 

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastsRef = useRef<ToastItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Keep toastsRef in sync
  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  // Calculate unopened events count
  const unopenedEventsCount = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    return EVENTS_MOCK.filter(e => {
      const eDate = parseEventDate(e.date);
      // Ignore past events
      if (eDate < today) return false;
      // If already viewed, ignore
      if (viewedEventIds.has(e.id)) return false;
      return true;
    }).length;
  }, [viewedEventIds]);

  const handleTabChange = (tab: string) => {
    if (tab === 'Events' && activeTab !== 'Events') {
      // Trigger the Splash Screen Transition for Events
      setShowEventsSplash(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSplashComplete = () => {
    setShowEventsSplash(false);
    setActiveTab('Events');
  };

  const handleEventView = (id: string) => {
    setViewedEventIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const addToast = (text: string, eventName: string, eventId: string, force = false) => {
    // If registered, never show.
    if (registeredIds.has(eventId)) return;

    // If not forced (automatic mode), suppress if user is currently exploring details to avoid distraction
    if (!force && exploringEventId !== null) return;

    const id = Date.now();
    const newToast: ToastItem = { id, text, eventName, eventId, isExiting: false };

    // Update Toasts (Visual)
    setToasts(prev => {
      // STRICT ONE-BY-ONE: Always replace the existing toast
      // We return an array with ONLY the new toast
      return [newToast];
    });

    // Update Notifications (History)
    setNotifications(prev => [{
      id,
      text,
      eventName,
      eventId,
      timestamp: new Date(),
      read: false
    }, ...prev]);
    
    // Auto dismiss sequence - SLOWER (6 seconds)
    // 1. Trigger Exit Animation
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
    }, 6000); 

    // 2. Remove from DOM
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6300); // +300ms for exit animation
  };

  const handleToastClick = (eventId: string) => {
    if (exploringEventId === eventId) return;
    
    // Trigger exit for all
    setToasts(prev => prev.map(t => ({ ...t, isExiting: true })));
    setTimeout(() => setToasts([]), 300);

    // Use handleTabChange for transition if we are not already on Events
    if (activeTab !== 'Events') {
      handleTabChange('Events');
    }
    
    // Set explorer ID immediately, page will render it when it mounts
    setExploringEventId(eventId);
    handleEventView(eventId);
  };

  const dismissToast = (e: React.MouseEvent, toastId: number) => {
    e.stopPropagation();
    // Trigger Exit
    setToasts(prev => prev.map(t => t.id === toastId ? { ...t, isExiting: true } : t));
    // Remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 300);
  };

  const toggleInterested = (id: string) => {
    setInterestedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setNotInterestedIds(old => {
           const updated = new Set(old);
           updated.delete(id);
           return updated;
        });
        
        // Immediate Feedback Toast
        const event = EVENTS_MOCK.find(e => e.id === id);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (event && !registeredIds.has(id)) {
           const eDate = parseEventDate(event.date);
           if (eDate >= today) {
              const jokes = [
                "Added to interested. We both know you'll probably sleep through it.",
                "Interested? Bold claim for someone with your attendance record.",
                "Saved. Now comes the hard part: actually showing up.",
                `"Interested" is the biggest lie in tech. Prove me wrong.`
              ];
              
              const randomJoke = event.jokes.length > 0
                ? event.jokes[Math.floor(Math.random() * event.jokes.length)] 
                : jokes[Math.floor(Math.random() * jokes.length)];
                
              addToast(randomJoke, event.title, event.id, true);
           }
        }
      }
      return next;
    });
  };

  const markNotInterested = (id: string) => {
    setNotInterestedIds(prev => {
       const next = new Set(prev);
       next.add(id);
       setInterestedIds(old => {
          const updated = new Set(old);
          updated.delete(id);
          return updated;
       });
       return next;
    });
    // Instant removal for this context is fine
    setToasts(prev => prev.filter(t => t.eventId !== id));
  };

  const handleRegister = (id: string) => {
    setRegisteredIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setToasts(prev => prev.filter(t => t.eventId !== id));
  };

  // Notification Handlers
  const clearNotifications = () => setNotifications([]);
  const markNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  // ---------------------------------------------------------------------------
  // CONTINUOUS POPUP LOGIC
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Clear any existing timer on mount
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      // STRICT ONE-BY-ONE CHECK USING REF
      if (toastsRef.current.length > 0) return;

      const now = new Date();
      now.setHours(0,0,0,0);

      const eligibleEvents = EVENTS_MOCK.filter(e => {
          if (registeredIds.has(e.id)) return false;
          if (notInterestedIds.has(e.id)) return false;
          const eDate = parseEventDate(e.date);
          if (eDate < now) return false;
          return true;
      });

      if (eligibleEvents.length === 0) return;

      const interestedPool = eligibleEvents.filter(e => interestedIds.has(e.id));
      const discoveryPool = eligibleEvents.filter(e => !interestedIds.has(e.id));

      let selectedEvent;
      if (interestedPool.length > 0 && Math.random() < 0.6) {
         selectedEvent = interestedPool[Math.floor(Math.random() * interestedPool.length)];
      } else if (discoveryPool.length > 0) {
         selectedEvent = discoveryPool[Math.floor(Math.random() * discoveryPool.length)];
      } else {
         selectedEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
      }

      if (!selectedEvent) return;
      // Double check ref to prevent race condition (though single threaded JS)
      if (toastsRef.current.some(t => t.eventId === selectedEvent.id)) return;

      let msg = "";
      const isInterested = interestedIds.has(selectedEvent.id);
      const hasCustomJokes = selectedEvent.jokes.length > 0;

      if (isInterested) {
          if (hasCustomJokes) {
             msg = selectedEvent.jokes[Math.floor(Math.random() * selectedEvent.jokes.length)];
          } else {
             msg = "You said you were interested. Prove it.";
          }
      } else {
          const promos = [
            "Registration is filling up fast!",
            "Your classmates are checking this out.",
            "Don't miss the deadline for this one.",
            "A perfect opportunity to boost your portfolio.",
            "Are you ready for the challenge?"
          ];
          if (hasCustomJokes && Math.random() < 0.4) {
             msg = selectedEvent.jokes[Math.floor(Math.random() * selectedEvent.jokes.length)];
          } else {
             msg = promos[Math.floor(Math.random() * promos.length)];
          }
      }
      
      const id = Date.now();
      
      const newToast = { 
         id, 
         text: msg, 
         eventName: selectedEvent.title, 
         eventId: selectedEvent.id,
         isExiting: false 
      };

      // Update Toasts
      setToasts([newToast]);

      // Update Notifications History
      setNotifications(prev => [{
        id,
        text: msg, 
        eventName: selectedEvent.title,
        eventId: selectedEvent.id,
        timestamp: new Date(),
        read: false
      }, ...prev]);
      
      // Schedule auto-removal for this specific toast
      // SLOWER: 6 Seconds Visible
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
      }, 6000);
      
      // Remove after animation
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 6300);

    }, 40000); // SLOWED DOWN: 40 Seconds Interval

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interestedIds, registeredIds, notInterestedIds]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Calendar':
        return <FullCalendarPage />;
      case 'Events':
        return (
          <EventsPage 
            selectedDate={selectedGlobalDate} 
            isCalendarOpen={isMiniCalendarOpen}
            interestedIds={interestedIds}
            notInterestedIds={notInterestedIds}
            registeredIds={registeredIds}
            toggleInterested={toggleInterested}
            markNotInterested={markNotInterested}
            handleRegister={handleRegister}
            externalExploringId={exploringEventId}
            onCloseExternalExplorer={() => setExploringEventId(null)}
            onDetailsToggle={setIsDetailsOpen}
            onEventView={handleEventView}
            viewedEventIds={viewedEventIds}
          />
        );
      default:
        return <MainDashboard />;
    }
  };

  // INTERSTITIAL SPLASH SCREEN FOR EVENTS
  if (showEventsSplash) {
    return <LoginPage onLogin={handleSplashComplete} loadingText="Accessing Events Arena..." />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#f5f6f8] text-slate-700 relative selection:bg-rose-100 selection:text-rose-900 overflow-hidden font-sans p-4 gap-4">
      
      {/* GLOBAL TOAST CONTAINER */}
      <div className="fixed top-20 right-6 z-[10001] flex flex-col gap-4 pointer-events-none w-96 perspective-[2000px]">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            onClick={() => handleToastClick(toast.eventId)}
            className={`
              group pointer-events-auto cursor-pointer 
              bg-white/95 backdrop-blur-xl border border-white/20 
              rounded-[24px] p-5 
              shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] 
              hover:shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] hover:border-blue-500/30
              flex flex-col gap-3 relative overflow-hidden
              ring-1 ring-black/5
              ${toast.isExiting ? 'animate-zip-out' : 'animate-genie-in'}
            `}
            style={{
               transformOrigin: 'top right'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => dismissToast(e, toast.id)}
              className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-rose-500 hover:text-white text-slate-400 rounded-full transition-all z-20 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header: Calling Card Style */}
            <div className="flex items-center gap-3 border-b border-slate-100/50 pb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                <BellRing className="w-5 h-5 text-white animate-wiggle relative z-10" />
              </div>
              <div className="flex flex-col min-w-0 pr-6">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                     Incoming Alert
                  </span>
                  <span className="text-xs font-black uppercase tracking-wide text-slate-800 truncate w-full block leading-none">
                    {toast.eventName}
                  </span>
              </div>
            </div>
            
            <div className="space-y-1 relative z-10 pl-1 mt-1">
              <p className="text-sm font-bold text-slate-600 leading-snug">"{toast.text}"</p>
              <div className="flex items-center gap-1.5 pt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                    Read Message <ArrowRight className="w-3 h-3" />
                 </span>
              </div>
            </div>

            {/* Progress Bar - Slower (6.3s) */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
               <div className="h-full bg-blue-500 w-full animate-[progress_6.3s_linear_forwards] origin-left" />
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes genieIn {
          0% {
            opacity: 0;
            transform: translateX(50%) translateY(-50%) scale(0) rotate(15deg);
            filter: blur(20px);
          }
          60% {
            opacity: 1;
            transform: translateX(-5%) translateY(5%) scale(1.05) rotate(-3deg);
            filter: blur(0px);
          }
          80% {
            transform: translateX(2%) translateY(-2%) scale(0.98) rotate(1deg);
          }
          100% {
            transform: translateX(0) translateY(0) scale(1) rotate(0deg);
          }
        }

        @keyframes zipOut {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          20% {
             transform: translateX(-10%) scale(0.95);
             opacity: 1;
          }
          100% {
            transform: translateX(150%) scale(1.1) skewX(-20deg);
            opacity: 0;
          }
        }

        @keyframes progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }

        .animate-genie-in {
           animation: genieIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .animate-zip-out {
           animation: zipOut 0.3s cubic-bezier(0.5, 0, 1, 0.5) forwards;
        }

        .animate-wiggle {
           animation: wiggle 1.5s ease-in-out infinite;
        }
      `}} />

      {!isDetailsOpen && (
        <TopBar 
          notifications={notifications}
          onNotificationClick={(eventId: string) => {
            if (activeTab !== 'Events') {
              handleTabChange('Events');
            }
            setExploringEventId(eventId);
            handleEventView(eventId);
          }}
          onClearNotifications={clearNotifications}
          onMarkRead={markNotificationsRead}
        />
      )}
      
      <div className="flex flex-1 gap-4 overflow-hidden relative min-h-0">
        {!isDetailsOpen && (
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            unopenedEventsCount={unopenedEventsCount}
          />
        )}
        
        <main className="flex-1 overflow-y-auto min-w-0 flex gap-4 no-scrollbar">
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
          
          {(!isDetailsOpen && (activeTab === 'Dashboard' || activeTab === 'Events')) && (
             <RightPanel setActiveTab={handleTabChange} />
          )}
        </main>
      </div>

      <MiniFloatingCalendar 
        isOpen={isMiniCalendarOpen} 
        setIsOpen={setIsMiniCalendarOpen}
        selectedDate={selectedGlobalDate}
        setSelectedDate={setSelectedGlobalDate}
      />
    </div>
  );
};

export default App;
