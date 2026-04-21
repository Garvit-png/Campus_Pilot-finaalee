import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Ticket, 
  Calendar, 
  Coffee, 
  CreditCard, 
  Users, 
  ClipboardList, 
  FileText, 
  HelpCircle, 
  PartyPopper,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unopenedEventsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, unopenedEventsCount = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Profile', icon: User },
    { name: 'Exit Pass', icon: Ticket },
    { name: 'Calendar', icon: Calendar },
    { name: 'Food Menu', icon: Coffee },
    { name: 'Fees and Payments', icon: CreditCard },
    { name: 'Clubs', icon: Users },
    { name: 'Complaint', icon: ClipboardList },
    { name: 'Guidelines & Policies', icon: FileText },
    { name: 'Help Centre', icon: HelpCircle },
    { name: 'Events', icon: PartyPopper },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-[32px] h-full flex flex-col pt-6 pb-6 shadow-sm transition-all duration-300 ease-in-out shrink-0 overflow-y-auto overflow-x-hidden ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      {/* Scrollable Menu Items */}
      <div className="flex-1 space-y-1.5 px-4">
        {menuItems.map((item) => {
          const isActive = activeTab === item.name;
          const isEvents = item.name === 'Events';

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex justify-start items-center p-3 rounded-2xl transition-colors duration-200 group relative ${
                isActive ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <item.icon className="w-5 h-5 mx-auto" />
              </div>
              
              <span 
                className={`ml-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'
                }`}
              >
                {item.name}
              </span>

              {isEvents && unopenedEventsCount > 0 && isHovered && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  {unopenedEventsCount}
                </span>
              )}
              {isEvents && unopenedEventsCount > 0 && !isHovered && (
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Icons */}
      <div className="mt-auto pt-6 px-4 space-y-1.5">
        <button className="w-full flex justify-start items-center p-3 rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors duration-200">
          <div className="flex items-center justify-center min-w-[24px]">
            <Settings className="w-5 h-5 mx-auto" />
          </div>
          <span className={`ml-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'}`}>
            Settings
          </span>
        </button>
        <button className="w-full flex justify-start items-center p-3 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors duration-200">
          <div className="flex items-center justify-center min-w-[24px]">
            <LogOut className="w-5 h-5 mx-auto" />
          </div>
          <span className={`ml-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none absolute'}`}>
            Log Out
          </span>
        </button>
      </div>
    </aside>
  );
};
