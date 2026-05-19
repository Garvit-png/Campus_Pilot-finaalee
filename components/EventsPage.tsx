
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Zap, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ArrowRight, 
  Ticket, 
  CalendarDays,
  AlertCircle,
  CalendarCheck,
  X,
  Rocket,
  ChevronRight, 
  Map as MapIcon,
  Timer,
  ThumbsDown,
  UserCheck,
  Layout,
  Heart,
  Terminal,
  Palette,
  Mic2,
  Trophy,
  ExternalLink,
  Code2,
  Cpu,
  ShieldAlert,
  Sparkles,
  MousePointer2,
  CheckCircle2,
  Image as ImageIcon,
  GraduationCap,
  ShieldCheck,
  Users2,
  Info,
  Target,
  Gift,
  Award,
  Briefcase,
  HelpCircle,
  Shield,
  Laptop,
  ChevronLeft,
  UserPlus,
  Send,
  Check,
  Flame,
  Phone,
  Mail,
  LifeBuoy,
  History,
  Camera,
  QrCode,
  Download
} from 'lucide-react';
import { TutorialOverlay, TutorialStep } from './TutorialOverlay';
import { CertificateModal } from './CertificateModal';

export interface TimelineItem {
  time: string;
  title: string;
  desc: string;
}

export interface Prize {
  title: string;
  desc: string;
  amount: string;
  color: string; // Tailwind gradient classes
}

export interface Sponsor {
  name: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  logoUrl?: string; // Optional for now, using placeholder logic if missing
}

export interface Judge {
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Competition' | 'Fest' | 'Workshop' | 'Seminar';
  type: 'Live' | 'Upcoming' | 'Closed';
  date: string;
  dayOfMonth: number;
  time: string;
  location: string;
  xp: number;
  attendees: number;
  sectionParticipants: number; 
  featured?: boolean;
  description?: string;
  jokes: string[];
  timeline: TimelineItem[];
  venueDetails: string;
  prizePool?: string;
  tracks?: string[];
  posterUrl: string;
  eligibility: string;
  teamSize: string;
  certification: boolean;
  // Extended Details
  prizesList?: Prize[];
  sponsors?: Sponsor[];
  judges?: Judge[];
  rules?: string[];
  faqs?: FAQ[];
  organizerContact?: {
    phone: string;
    email: string;
  };
  gallery?: string[]; // New Gallery Field
}

const TODAY_DAY = new Date().getDate(); 

// Mock Peers Data
const PEERS_MOCK = [
  { id: '1', name: 'Aarav Patel', role: 'CS • Year 3', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', name: 'Sanya Sharma', role: 'AI • Year 2', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', name: 'Rohan Gupta', role: 'IT • Year 4', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Priya Singh', role: 'Design • Year 2', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '5', name: 'Vikram Malhotra', role: 'MBA • Year 1', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: '6', name: 'Ishaan Kumar', role: 'CS • Year 1', avatar: 'https://i.pravatar.cc/150?img=8' },
];

// Dynamic Helper to create an urgent event for demonstration
const getUrgentDateInfo = () => {
  const d = new Date();
  d.setHours(d.getHours() + 28); // Starts in 28 hours (Urgent < 48h)
  return {
    dateStr: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    timeStr: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    day: d.getDate()
  };
};

const urgentInfo = getUrgentDateInfo();

let tutorialShownThisLoad = false;

export const EVENTS_MOCK: CampusEvent[] = ([
  {
    id: 'e_urgent_flash',
    title: 'Flash Code Sprint',
    category: 'Competition',
    type: 'Upcoming',
    date: urgentInfo.dateStr,
    dayOfMonth: urgentInfo.day,
    time: urgentInfo.timeStr,
    location: 'Server Room 404',
    xp: 5000,
    attendees: 50,
    sectionParticipants: 5,
    featured: true,
    prizePool: "₹50,000 Instant",
    tracks: ["Speed Coding", "Bug Fixing"],
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
    description: "A surprise lightning round of competitive programming. The clock is ticking, and the deadline is approaching fast.",
    jokes: ["Code faster, the server bills are due.", "Urgent? I thought you said URGENT."],
    timeline: [ { time: urgentInfo.timeStr, title: "Sprint Start", desc: "Go go go!" } ],
    venueDetails: "Server Room 404",
    eligibility: "Speedsters",
    teamSize: "Individual",
    certification: true,
    organizerContact: { phone: "+91 99887 76655", email: "flashcode@nst.edu" }
  },
  {
    id: 'e_mumbai',
    title: 'Mumbai Developer Summit 2026',
    category: 'Competition',
    type: 'Upcoming',
    date: '15 Feb 2026',
    dayOfMonth: 15,
    time: '09:00 AM',
    location: 'IIT Bombay Campus',
    xp: 2500,
    attendees: 1200,
    sectionParticipants: 42,
    posterUrl: "/assets/images/global_ai_hackathon_hero_1776800152149.png",
    description: "The biggest tech convergence in the financial capital. From high-frequency trading algorithms to decentralized architectures. Experience the spirit of Mumbai's tech ecosystem without the traffic.",
    jokes: [
      "Mumbai jaana hai ya nahi- Take part in mumbai hacks"
    ],
    timeline: [
      { time: "09:00 AM", title: "Opening Keynote", desc: "Welcome address by industry leaders in AI and Finance." },
      { time: "11:30 AM", title: "Track A: Scalable Systems", desc: "Deep dive into distributed architectures." }
    ],
    venueDetails: "IIT Bombay Campus, Convocation Hall. Landmark: Main Building Gate No. 1.",
    eligibility: "Undergraduates & Professionals",
    teamSize: "1-4 Members",
    certification: true,
    organizerContact: { phone: "+91 22 2572 2545", email: "summit2026@iitb.ac.in" },
    gallery: [
      "https://images.unsplash.com/photo-1475721027767-4d096ca0c479?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: 'e1',
    title: 'Global AI Hackathon 2026',
    category: 'Competition',
    type: 'Live',
    date: '24 Jan 2026',
    dayOfMonth: 24,
    time: '48H Non-stop',
    location: 'Innovation Wing',
    xp: 1200,
    attendees: 420,
    sectionParticipants: 15,
    featured: true,
    prizePool: "$50,000",
    tracks: ["LLM Agents", "Computer Vision", "AI Safety", "Generative Art"],
    posterUrl: "/assets/images/global_ai_hackathon_hero_1776800152149.png",
    description: "The ultimate showdown of neural networks. Build the future of AGI in 48 hours. Dive into high-concurrency challenges and state-of-the-art inference optimization. No sleep, just code. This event brings together the brightest minds to solve real-world problems using the latest in AI technology.",
    jokes: ["AI Hackathon? Bhai, ChatGPT se copy-paste karna 'hacking' nahi hota."],
    timeline: [
      { time: "Day 1 - 08:00 AM", title: "Registration & Check-in", desc: "Get your badges, swag kits, and Wi-Fi credentials. Networking breakfast." },
      { time: "Day 1 - 10:00 AM", title: "Opening Ceremony", desc: "Keynote by Industry Leaders and Problem Statement Reveal." },
      { time: "Day 1 - 11:00 AM", title: "Hacking Starts", desc: "Official start of the 48-hour coding marathon." },
      { time: "Day 1 - 08:00 PM", title: "Mentorship Round 1", desc: "Industry experts visit tables for guidance." },
      { time: "Day 2 - 09:00 PM", title: "Code Freeze & Submission", desc: "Stop coding. Push to GitHub. Prepare for demos." }
    ],
    venueDetails: "Innovation Wing, 4th Floor Tech Park. Access via Lift B.",
    eligibility: "Open for All Students",
    teamSize: "Individual or Pairs",
    certification: true,
    prizesList: [
      { title: "Grand Winner", desc: "Best Overall AI Solution", amount: "$25,000", color: "from-amber-400 to-orange-500" },
      { title: "Runner Up", desc: "Second Place Excellence", amount: "$15,000", color: "from-slate-300 to-slate-400" },
      { title: "Innovation Award", desc: "Most creative use of LLMs", amount: "$5,000", color: "from-blue-400 to-indigo-500" },
      { title: "Student Track", desc: "Best project by undergraduates", amount: "MacBook Pros", color: "from-emerald-400 to-teal-500" }
    ],
    sponsors: [
      { name: "OpenAI", tier: "Platinum" },
      { name: "NVIDIA", tier: "Platinum" },
      { name: "Google Cloud", tier: "Gold" },
      { name: "AWS", tier: "Gold" },
      { name: "Anthropic", tier: "Silver" }
    ],
    judges: [
      { name: "Dr. Sarah Chen", role: "Head of AI", company: "DeepMind", avatarUrl: "https://i.pravatar.cc/150?img=5" },
      { name: "Alex Rivera", role: "Principal Engineer", company: "Anthropic", avatarUrl: "https://i.pravatar.cc/150?img=11" },
      { name: "Marcus Johnson", role: "VC Partner", company: "Sequoia", avatarUrl: "https://i.pravatar.cc/150?img=3" },
      { name: "Priya Patel", role: "CTO", company: "TechFlow", avatarUrl: "https://i.pravatar.cc/150?img=9" }
    ],
    rules: [
      "All code must be written during the event. Pre-existing codebases are not allowed.",
      "Teams can have a maximum of 4 members.",
      "Use of open-source libraries is encouraged, but plagiarism will lead to disqualification.",
      "Final submission must include a GitHub repo link and a 2-minute demo video.",
      "Be respectful to other participants and staff. Harassment of any kind will not be tolerated."
    ],
    faqs: [
      { q: "Do I need an idea beforehand?", a: "No! We will have an ideation session at the start of the event to help you form teams and brainstorm." },
      { q: "Is food provided?", a: "Yes, we provide breakfast, lunch, dinner, and midnight snacks for all 48 hours." },
      { q: "Can I participate remotely?", a: "This is a hybrid event. You can participate online, but in-person teams get access to hardware labs." },
      { q: "What hardware is provided?", a: "We have a limited number of GPUs available on the cloud. Bring your own laptop." }
    ],
    organizerContact: { phone: "+1 (555) 123-4567", email: "ai.hackathon@global.org" },
    gallery: [
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1550305080-4e029753abcf?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: 'e_cyber',
    title: 'Cyber Security Gauntlet',
    category: 'Competition',
    type: 'Live',
    date: '21 Jan 2026',
    dayOfMonth: 21,
    time: '12:00 PM',
    location: 'Secure Lab 7',
    xp: 800,
    attendees: 85,
    sectionParticipants: 4,
    prizePool: "Ethical Hacker Vouchers",
    tracks: ["Network Infiltration", "Cloud Security"],
    posterUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    description: "Defend your infrastructure against simulated zero-day attacks. The ultimate capture the flag event. One breach and you're out.",
    jokes: ["Your password is 'password123', isn't it? Please don't enter."],
    timeline: [{ time: "12:00 PM", title: "Breach Phase", desc: "Initial infiltration attempts start." }],
    venueDetails: "Basement Lab 7, Engineering Block.",
    eligibility: "Advanced Cybersecurity Students",
    teamSize: "Individual Only",
    certification: false,
    organizerContact: { phone: "+91 90000 11111", email: "security@nst.edu" }
  },
  {
    id: 'e2',
    title: 'UI Mastery Workshop',
    category: 'Workshop',
    type: 'Upcoming',
    date: '26 Jan 2026',
    dayOfMonth: 26,
    time: '10:00 AM',
    location: 'Design Lab B',
    xp: 400,
    attendees: 120,
    sectionParticipants: 8,
    tracks: ["Figma 101", "Design Systems"],
    posterUrl: "/assets/images/ui_mastery_workshop_poster_1776800187166.png",
    description: "Sacred art of whitespace and color theory. Learn why 'making the logo bigger' is a sin and how to build components that don't break.",
    jokes: ["UI Master banega? Tera choice of colors dekh ke meri aankhein ro rahi hain."],
    timeline: [{ time: "10:00 AM", title: "Intro to Figma", desc: "Basics of layout." }],
    venueDetails: "Design Lab B, Arts Block.",
    eligibility: "Beginners to Design",
    teamSize: "No Limit",
    certification: true,
    organizerContact: { phone: "+91 88888 22222", email: "design.club@nst.edu" }
  },
  {
    id: 'e_fintech',
    title: 'Algo-Trading Sprint',
    category: 'Competition',
    type: 'Upcoming',
    date: '29 Jan 2026',
    dayOfMonth: 29,
    time: '08:00 AM',
    location: 'Finance Hub',
    xp: 2000,
    attendees: 150,
    sectionParticipants: 12,
    prizePool: "$15,000",
    tracks: ["HFT", "Crypto Arbitrage", "Sentiment Analysis"],
    posterUrl: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000",
    description: "Build the fastest trading bot. We provide the historical data; you provide the alpha. Warning: High variance event.",
    jokes: ["Buy high, sell low, right?", "My strategy is purely hope-based."],
    timeline: [
      { time: "08:00 AM", title: "Market Open", desc: "API keys distributed." },
      { time: "04:00 PM", title: "Market Close", desc: "Final P&L calculation." }
    ],
    venueDetails: "Finance Hub, Building C.",
    eligibility: "Quant Enthusiasts",
    teamSize: "1-3 Members",
    certification: true,
    organizerContact: { phone: "+91 77777 33333", email: "fintech@nst.edu" }
  },
  {
    id: 'e_robowars',
    title: 'RoboWars 2026',
    category: 'Competition',
    type: 'Upcoming',
    date: '02 Feb 2026',
    dayOfMonth: 2,
    time: '10:00 AM',
    location: 'The Arena',
    xp: 3000,
    attendees: 800,
    sectionParticipants: 45,
    prizePool: "₹2,00,000",
    tracks: ["Deathmatch", "Obstacle Course"],
    posterUrl: "/assets/images/robowars_2026_poster_1776801509250.png",
    description: "Sparks, metal, and destruction. Bring your battle bots to the arena and fight for glory. Safety goggles mandatory.",
    jokes: ["It's not a bug, it's a surprise weapon.", "My robot is peaceful, said no one ever."],
    timeline: [
      { time: "10:00 AM", title: "Weigh In", desc: "Bot inspection." },
      { time: "12:00 PM", title: "Round 1", desc: "Fight!" }
    ],
    venueDetails: "Central Arena.",
    eligibility: "Engineering Teams",
    teamSize: "4-6 Members",
    certification: true,
    organizerContact: { phone: "+91 66666 44444", email: "robotics@nst.edu" },
    gallery: [
      "https://images.unsplash.com/photo-1563206767-5b1d972f9fb7?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  {
    id: 'e_rust_workshop',
    title: 'Rust for Systems',
    category: 'Workshop',
    type: 'Upcoming',
    date: '30 Jan 2026',
    dayOfMonth: 30,
    time: '02:00 PM',
    location: 'Lab 2',
    xp: 600,
    attendees: 50,
    sectionParticipants: 10,
    tracks: ["Memory Safety", "Concurrency"],
    posterUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000",
    description: "Ditch C++. Embrace the crab. Learn memory safety without garbage collection.",
    jokes: ["I'm currently fighting the borrow checker.", "Rewrite it in Rust."],
    timeline: [{ time: "02:00 PM", title: "Hello World", desc: "Setup cargo." }],
    venueDetails: "Computer Lab 2.",
    eligibility: "CS Students",
    teamSize: "Individual",
    certification: true,
    organizerContact: { phone: "+91 55555 55555", email: "rustacean@nst.edu" }
  },
  {
    id: 'e_music',
    title: 'Acoustic Night',
    category: 'Fest',
    type: 'Upcoming',
    date: '14 Feb 2026',
    dayOfMonth: 14,
    time: '06:00 PM',
    location: 'Amphitheatre',
    xp: 200,
    attendees: 500,
    sectionParticipants: 100,
    tracks: ["Live Music", "Open Mic"],
    posterUrl: "/assets/images/acoustic_night_poster_1776801630580.png",
    description: "Under the stars, music that heals. Bring your instruments or just your ears.",
    jokes: ["I play the triangle professionally.", "Free food? Count me in."],
    timeline: [{ time: "06:00 PM", title: "Opening Act", desc: "Local band performance." }],
    venueDetails: "Open Air Amphitheatre.",
    eligibility: "Open for All",
    teamSize: "N/A",
    certification: false,
    organizerContact: { phone: "+91 44444 66666", email: "cultural@nst.edu" }
  },
  {
    id: 'e_gamejam',
    title: 'Indie Game Jam',
    category: 'Competition',
    type: 'Upcoming',
    date: '08 Feb 2026',
    dayOfMonth: 8,
    time: '48H Sprint',
    location: 'Media Lab',
    xp: 1500,
    attendees: 120,
    sectionParticipants: 20,
    prizePool: "Steam Credits",
    tracks: ["Pixel Art", "Unity", "Godot"],
    posterUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=1000",
    description: "Make a game from scratch in 48 hours. Theme revealed at the start. Sleep is optional.",
    jokes: ["It's not a glitch, it's a feature.", "My physics engine is broken."],
    timeline: [{ time: "09:00 AM", title: "Theme Reveal", desc: "Start coding." }],
    venueDetails: "Media Lab, 3rd Floor.",
    eligibility: "Game Devs",
    teamSize: "1-4 Members",
    certification: true,
    organizerContact: { phone: "+91 33333 77777", email: "gamedev@nst.edu" }
  },
  {
    id: 'e_blockchain',
    title: 'Web3 & DeFi Summit',
    category: 'Seminar',
    type: 'Upcoming',
    date: '25 Jan 2026',
    dayOfMonth: 25,
    time: '11:00 AM',
    location: 'Auditorium B',
    xp: 800,
    attendees: 200,
    sectionParticipants: 15,
    tracks: ["Smart Contracts", "DAOs"],
    posterUrl: "https://images.unsplash.com/photo-1621504450168-b8c4375c2b36?auto=format&fit=crop&q=80&w=1000",
    description: "Understanding the future of finance. Beyond the hype of NFTs.",
    jokes: ["WAGMI", "HODL your questions till the end."],
    timeline: [{ time: "11:00 AM", title: "Keynote", desc: "Ethereum 2.0 roadmap." }],
    venueDetails: "Auditorium B.",
    eligibility: "Open for All",
    teamSize: "Individual",
    certification: true,
    organizerContact: { phone: "+91 22222 88888", email: "web3@nst.edu" }
  },
  {
    id: 'e_startup',
    title: 'Student Founder Pitch',
    category: 'Competition',
    type: 'Upcoming',
    date: '10 Feb 2026',
    dayOfMonth: 10,
    time: '04:00 PM',
    location: 'Incubation Center',
    xp: 1000,
    attendees: 100,
    sectionParticipants: 8,
    prizePool: "Seed Funding",
    tracks: ["SaaS", "D2C"],
    posterUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
    description: "Got an idea? Pitch it to real VCs. 5 minutes to impress.",
    jokes: ["We are the Uber for Tacos.", "Pre-revenue, pre-product, post-hype."],
    timeline: [{ time: "04:00 PM", title: "Pitches Start", desc: "3 min pitch, 2 min Q&A." }],
    venueDetails: "Incubation Center.",
    eligibility: "Student Founders",
    teamSize: "1-5 Members",
    certification: false,
    organizerContact: { phone: "+91 11111 99999", email: "ecell@nst.edu" }
  },
  {
    id: 'e_design',
    title: 'Product Design Sprint',
    category: 'Competition',
    type: 'Upcoming',
    date: '03 Feb 2026',
    dayOfMonth: 3,
    time: '09:00 AM',
    location: 'Design Studio',
    xp: 900,
    attendees: 60,
    sectionParticipants: 12,
    prizePool: "Wacom Tablets",
    tracks: ["UX Research", "Prototyping"],
    posterUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000",
    description: "Solve a user problem in 8 hours. Sketch, wireframe, and prototype.",
    jokes: ["Make the logo bigger.", "Comic Sans is forbidden."],
    timeline: [{ time: "09:00 AM", title: "Problem Brief", desc: "User personas." }],
    venueDetails: "Design Studio.",
    eligibility: "Designers",
    teamSize: "2-3 Members",
    certification: true,
    organizerContact: { phone: "+91 12121 21212", email: "design@nst.edu" }
  },
  {
    id: 'e_datascience',
    title: 'Kaggle Masterclass',
    category: 'Workshop',
    type: 'Upcoming',
    date: '27 Jan 2026',
    dayOfMonth: 27,
    time: '03:00 PM',
    location: 'Data Lab',
    xp: 700,
    attendees: 90,
    sectionParticipants: 20,
    tracks: ["Pandas", "Scikit-Learn"],
    posterUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    description: "From CSV to predictions. Learn how to win data science competitions.",
    jokes: ["It's just linear regression in a trench coat.", "Data cleaning is 90% of the job."],
    timeline: [{ time: "03:00 PM", title: "EDA", desc: "Exploratory Data Analysis." }],
    venueDetails: "Data Lab.",
    eligibility: "Data Enthusiasts",
    teamSize: "Individual",
    certification: true,
    organizerContact: { phone: "+91 34343 43434", email: "datascience@nst.edu" }
  },
  {
    id: 'e_drone',
    title: 'Drone Racing League',
    category: 'Competition',
    type: 'Upcoming',
    date: '18 Feb 2026',
    dayOfMonth: 18,
    time: '11:00 AM',
    location: 'Sports Field',
    xp: 1200,
    attendees: 400,
    sectionParticipants: 8,
    prizePool: "DJI Gear",
    tracks: ["FPV Racing"],
    posterUrl: "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&q=80&w=1000",
    description: "High speed FPV drone racing through obstacle courses.",
    jokes: ["I believe I can fly... into a tree.", "Propellers are sharp."],
    timeline: [{ time: "11:00 AM", title: "Qualifiers", desc: "Time trials." }],
    venueDetails: "College Sports Field.",
    eligibility: "Licensed Pilots",
    teamSize: "Individual",
    certification: true,
    organizerContact: { phone: "+91 56565 65656", email: "drones@nst.edu" }
  },
  {
    id: 'e_cloud',
    title: 'AWS DeepRacer',
    category: 'Competition',
    type: 'Upcoming',
    date: '12 Feb 2026',
    dayOfMonth: 12,
    time: '10:00 AM',
    location: 'Main Hall',
    xp: 1800,
    attendees: 150,
    sectionParticipants: 10,
    prizePool: "AWS Credits",
    tracks: ["Reinforcement Learning"],
    posterUrl: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&q=80&w=1000",
    description: "Train a reinforcement learning model to drive a car around a track autonomously.",
    jokes: ["My model drives better than me.", "Reward function hacking."],
    timeline: [{ time: "10:00 AM", title: "Model Upload", desc: "Testing on track." }],
    venueDetails: "Main Hall.",
    eligibility: "CS Students",
    teamSize: "Individual",
    certification: true,
    organizerContact: { phone: "+91 78787 87878", email: "cloud@nst.edu" }
  }
] as CampusEvent[]).filter(e => ['e_urgent_flash', 'e_mumbai', 'e1', 'e_cyber', 'e2', 'e_robowars', 'e_music', 'e_blockchain', 'e_datascience'].includes(e.id));

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Competition': return { icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    case 'Workshop': return { icon: Palette, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    case 'Fest': return { icon: Mic2, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    default: return { icon: Trophy, color: 'text-slate-500', bg: 'bg-slate-500/10' };
  }
};

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse">
          <ImageIcon className="w-8 h-8 text-slate-300" />
        </div>
      )}
      {!error ? (
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
          <ImageIcon className="w-10 h-10 opacity-10 mb-2" />
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">No Image</span>
        </div>
      )}
    </div>
  );
};

interface EventsPageProps {
  selectedDate: number | null;
  isCalendarOpen: boolean;
  interestedIds: Set<string>;
  notInterestedIds: Set<string>;
  registeredIds: Set<string>;
  toggleInterested: (id: string) => void;
  markNotInterested: (id: string) => void;
  handleRegister: (id: string) => void;
  externalExploringId?: string | null;
  onCloseExternalExplorer?: () => void;
  onDetailsToggle?: (isOpen: boolean) => void;
  onEventView?: (id: string) => void;
  viewedEventIds: Set<string>;
}

export const EventsPage: React.FC<EventsPageProps> = ({ 
  selectedDate, 
  isCalendarOpen, 
  interestedIds, 
  notInterestedIds,
  registeredIds,
  toggleInterested,
  markNotInterested,
  handleRegister,
  externalExploringId,
  onCloseExternalExplorer,
  onDetailsToggle,
  onEventView,
  viewedEventIds
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exploringEvent, setExploringEvent] = useState<CampusEvent | null>(null);
  
  const [now, setNow] = useState(new Date());

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPeersModal, setShowPeersModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateEvent, setCertificateEvent] = useState<CampusEvent | null>(null);
  const [recipientName, setRecipientName] = useState('Garvit Dev');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCertificate = async (event: CampusEvent) => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2d context');

      // 1. Draw elegant background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
      bgGrad.addColorStop(0, '#FCFBF7');
      bgGrad.addColorStop(0.5, '#F9F6ED');
      bgGrad.addColorStop(1, '#F3EFE3');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 800);

      // 2. Draw border patterns
      ctx.strokeStyle = '#D4AF37'; // Gold
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, 1120, 720);

      // Inner Slate Border
      ctx.strokeStyle = '#1e293b'; // Slate 800
      ctx.lineWidth = 3;
      ctx.strokeRect(55, 55, 1090, 690);

      // Corner Ornaments
      const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.lineTo(25, 5);
        ctx.lineTo(5, 5);
        ctx.lineTo(5, 25);
        ctx.lineTo(0, 25);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      drawCornerOrnament(55, 55, 0);
      drawCornerOrnament(1145, 55, Math.PI / 2);
      drawCornerOrnament(1145, 745, Math.PI);
      drawCornerOrnament(55, 745, -Math.PI / 2);

      // 3. Header Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#475569';
      ctx.font = "bold 13px 'Montserrat', 'Helvetica Neue', Arial, sans-serif";
      ctx.textBaseline = 'top';
      ctx.fillText("CAMPUS PILOT • NATIONAL INSTITUTE OF TECHNOLOGY", 600, 95);

      // 4. Main Certificate Title
      ctx.fillStyle = '#0f172a';
      ctx.font = "black 42px 'Georgia', serif";
      ctx.fillText("CERTIFICATE OF EXCELLENCE", 600, 135);

      ctx.fillStyle = '#64748b';
      ctx.font = "italic 16px 'Georgia', serif";
      ctx.fillText("This certificate is proudly presented to", 600, 210);

      // 5. Student Name
      ctx.fillStyle = '#8c3a21';
      ctx.font = "bold 44px 'Georgia', serif";
      ctx.fillText(recipientName || 'Garvit Dev', 600, 250);

      // Underline name beautifully
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 310);
      ctx.lineTo(800, 310);
      ctx.stroke();

      // 6. Citation Details
      ctx.fillStyle = '#64748b';
      ctx.font = "15px 'Georgia', serif";
      ctx.fillText("for successful completion and outstanding performance in the campus-wide hackathon", 600, 340);

      // Event Title
      ctx.fillStyle = '#cc2929';
      ctx.font = "bold 26px 'Montserrat', Arial, sans-serif";
      ctx.fillText(event.title.toUpperCase(), 600, 380);

      ctx.fillStyle = '#475569';
      ctx.font = "14px 'Georgia', serif";
      ctx.fillText(`held at ${event.location || 'Innovation Wing'} on ${event.date || 'Campus Hub'}.`, 600, 425);

      ctx.fillStyle = '#0f172a';
      ctx.font = "bold 14px 'Montserrat', sans-serif";
      ctx.fillText(`AWARDED: ${event.xp} XP & SHIELD OF HONOR`, 600, 460);

      // 7. Signature Areas
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(150, 620);
      ctx.lineTo(380, 620);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = "italic 22px 'Georgia', serif";
      ctx.fillText("Dr. Sarah Chen", 265, 580);
      ctx.fillStyle = '#64748b';
      ctx.font = "bold 11px 'Montserrat', sans-serif";
      ctx.fillText("HEAD OF JURY & AI LABS", 265, 635);

      ctx.beginPath();
      ctx.moveTo(820, 620);
      ctx.lineTo(1050, 620);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = "italic 22px 'Georgia', serif";
      ctx.fillText("Prof. R. K. Sharma", 935, 580);
      ctx.fillStyle = '#64748b';
      ctx.font = "bold 11px 'Montserrat', sans-serif";
      ctx.fillText("CAMPUS DIRECTOR, NST", 935, 635);

      // 8. Seal of Verification (Gold Seal)
      const sealX = 600;
      const sealY = 590;
      const sealRadius = 55;

      ctx.fillStyle = '#D4AF37';
      ctx.strokeStyle = '#c5a028';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const angle = (i * Math.PI * 2) / 40;
        const outerR = sealRadius + (i % 2 === 0 ? 6 : 0);
        const sx = sealX + Math.cos(angle) * outerR;
        const sy = sealY + Math.sin(angle) * outerR;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius, 0, Math.PI * 2);
      const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, sealRadius);
      sealGrad.addColorStop(0, '#f9e69c');
      sealGrad.addColorStop(0.7, '#D4AF37');
      sealGrad.addColorStop(1, '#a67c1e');
      ctx.fillStyle = sealGrad;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, sealRadius - 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = "bold 10px 'Montserrat', sans-serif";
      ctx.fillText("VERIFIED", sealX, sealY - 12);
      ctx.font = "18px Arial";
      ctx.fillText("★", sealX, sealY + 4);
      ctx.font = "bold 9px 'Montserrat', sans-serif";
      ctx.fillText("CP-SECURE", sealX, sealY + 18);

      ctx.fillStyle = '#b48a17';
      ctx.beginPath();
      ctx.moveTo(sealX - 25, sealY + sealRadius - 5);
      ctx.lineTo(sealX - 45, sealY + sealRadius + 35);
      ctx.lineTo(sealX - 25, sealY + sealRadius + 25);
      ctx.lineTo(sealX - 5, sealY + sealRadius + 35);
      ctx.lineTo(sealX - 15, sealY + sealRadius - 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sealX + 15, sealY + sealRadius - 5);
      ctx.lineTo(sealX + 5, sealY + sealRadius + 35);
      ctx.lineTo(sealX + 25, sealY + sealRadius + 25);
      ctx.lineTo(sealX + 45, sealY + sealRadius + 35);
      ctx.lineTo(sealX + 25, sealY + sealRadius - 5);
      ctx.closePath();
      ctx.fill();

      // 9. QR Code and Certificate Meta bottom corner
      const certId = `CP-CERT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      ctx.fillStyle = '#64748b';
      ctx.font = "10px monospace";
      ctx.textAlign = 'left';
      ctx.fillText(`VERIFY ID: ${certId}`, 70, 715);
      ctx.fillText(`SYSTEM SECURE TIMESTAMP: 2026-05-18`, 70, 730);

      // Draw custom scannable mock QR code block
      const qrX = 1030;
      const qrY = 650;
      const qrSize = 90;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + 5, qrY + 5, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 9, qrY + 9, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + 12, qrY + 12, 6, 6);

      ctx.fillRect(qrX + qrSize - 25, qrY + 5, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + qrSize - 21, qrY + 9, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + qrSize - 18, qrY + 12, 6, 6);

      ctx.fillRect(qrX + 5, qrY + qrSize - 25, 20, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX + 9, qrY + qrSize - 21, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(qrX + 12, qrY + qrSize - 18, 6, 6);

      ctx.fillRect(qrX + 35, qrY + 10, 10, 5);
      ctx.fillRect(qrX + 50, qrY + 8, 8, 8);
      ctx.fillRect(qrX + 30, qrY + 25, 15, 12);
      ctx.fillRect(qrX + 55, qrY + 30, 10, 10);
      ctx.fillRect(qrX + 35, qrY + 50, 8, 15);
      ctx.fillRect(qrX + 50, qrY + 45, 15, 8);
      ctx.fillRect(qrX + 70, qrY + 45, 8, 12);
      ctx.fillRect(qrX + 30, qrY + 70, 25, 6);
      ctx.fillRect(qrX + 60, qrY + 65, 10, 15);
      ctx.fillRect(qrX + 75, qrY + 70, 8, 8);

      const link = document.createElement('a');
      link.download = `CampusPilot_Certificate_${event.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const launchCertificate = (event: CampusEvent) => {
    setCertificateEvent(event);
    setShowCertificateModal(true);
  };

  const isPastEvent = (e: CampusEvent) => {
    if (e.type === 'Closed') return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const evDate = new Date(e.date);
    if (isNaN(evDate.getTime())) {
      return e.dayOfMonth < TODAY_DAY;
    }
    evDate.setHours(0, 0, 0, 0);
    return evDate.getTime() < today.getTime();
  };
  
  const [showTutorial, setShowTutorial] = useState(false);
  
  const [invitedPeersMap, setInvitedPeersMap] = useState<Record<string, Set<string>>>({});
  const [isRecalculating, setIsRecalculating] = useState(false);


  const isRegistered = exploringEvent ? registeredIds.has(exploringEvent.id) : false;
  const isInterested = exploringEvent ? interestedIds.has(exploringEvent.id) : false;
  const isNotInterested = exploringEvent ? notInterestedIds.has(exploringEvent.id) : false;
  const isExploringEventPast = exploringEvent ? isPastEvent(exploringEvent) : false;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!tutorialShownThisLoad) {
      const timer = setTimeout(() => setShowTutorial(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    tutorialShownThisLoad = true;
  };

  useEffect(() => {
    if (externalExploringId) {
      const event = EVENTS_MOCK.find(e => e.id === externalExploringId);
      if (event) {
        setExploringEvent(event);
        onEventView?.(event.id);
      }
    }
  }, [externalExploringId, onEventView]);

  useEffect(() => {
    onDetailsToggle?.(!!exploringEvent);
    return () => onDetailsToggle?.(false);
  }, [exploringEvent, onDetailsToggle]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeExplorer();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const closeExplorer = () => {
    setExploringEvent(null);
    onCloseExternalExplorer?.();
    setShowConfirmModal(false);
    setShowSuccessModal(false);
    setShowPeersModal(false);
    setShowCertificateModal(false);
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return EVENTS_MOCK.filter(e => {
      const matchesCategory = activeFilter === 'All' || e.category === activeFilter;
      const matchesStatus = (() => {
        if (activeStatusFilter === 'All') return true;
        if (activeStatusFilter === 'Live') return e.type === 'Live';
        if (activeStatusFilter === 'Upcoming') return e.type === 'Upcoming';
        if (activeStatusFilter === 'Closed') return e.type === 'Closed';
        if (activeStatusFilter === 'Interested') return interestedIds.has(e.id);
        if (activeStatusFilter === 'Registered') return registeredIds.has(e.id);
        if (activeStatusFilter === 'Not Interested') return notInterestedIds.has(e.id);
        return true;
      })();
      const matchesSearch = query.length === 0 || [e.title, e.category, e.location, e.description ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query);
      const matchesDate = selectedDate ? e.dayOfMonth === selectedDate : true;
      return matchesCategory && matchesStatus && matchesSearch && matchesDate;
    }).sort((a, b) => {
      const aInt = interestedIds.has(a.id) ? 1 : 0;
      const bInt = interestedIds.has(b.id) ? 1 : 0;
      const aNot = notInterestedIds.has(a.id) ? 1 : 0;
      const bNot = notInterestedIds.has(b.id) ? 1 : 0;
      
      // Interested first
      if (aInt !== bInt) return bInt - aInt;
      // Not interested last
      if (aNot !== bNot) return aNot - bNot;
      return 0;
    });

  }, [activeFilter, activeStatusFilter, searchQuery, selectedDate, interestedIds, registeredIds, notInterestedIds]);

  const clearFilters = () => {
    setActiveFilter('All');
    setActiveStatusFilter('All');
    setSearchQuery('');
  };

  const categories = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nearDeadline = filteredData.filter(e => {
      if (e.type === 'Closed') return false;
      const evDate = new Date(e.date);
      if (isNaN(evDate.getTime())) {
        return e.dayOfMonth >= TODAY_DAY && e.dayOfMonth <= TODAY_DAY + 3;
      }
      evDate.setHours(0, 0, 0, 0);
      
      const diffTime = evDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 3;
    });

    const upcoming = filteredData.filter(e => {
      if (e.type === 'Closed') return false;
      const evDate = new Date(e.date);
      if (isNaN(evDate.getTime())) {
        return e.dayOfMonth > TODAY_DAY + 3;
      }
      evDate.setHours(0, 0, 0, 0);
      
      const diffTime = evDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays > 3;
    });

    const past = filteredData.filter(e => {
      if (e.type === 'Closed') return true;
      const evDate = new Date(e.date);
      if (isNaN(evDate.getTime())) {
        return e.dayOfMonth < TODAY_DAY;
      }
      evDate.setHours(0, 0, 0, 0);
      return evDate.getTime() < today.getTime();
    });

    return { nearDeadline, upcoming, past };
  }, [filteredData]);

  const onRegisterClick = () => {
    setShowConfirmModal(true);
  };

  const confirmRegistration = () => {
    if (exploringEvent) {
      handleRegister(exploringEvent.id);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    }
  };

  const onInvitePeer = (peerId: string) => {
    if (!exploringEvent) return;
    setInvitedPeersMap(prev => {
      const currentSet = prev[exploringEvent.id] || new Set();
      const newSet = new Set(currentSet);
      newSet.add(peerId);
      return { ...prev, [exploringEvent.id]: newSet };
    });
  };

  const parseDateTime = (dateStr: string, timeStr: string) => {
    if (timeStr.includes('Non-stop') || timeStr.includes('Sprint')) return null;
    try {
       const d = new Date(`${dateStr} ${timeStr}`);
       if (isNaN(d.getTime())) return null;
       return d;
    } catch {
        return null;
    }
  };

  const formatTimeDiff = (ms: number) => {
    if (ms < 0) return "Started";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (msDiff: number) => {
    const seconds = Math.abs(msDiff) / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (days >= 1) return `Happened ${Math.floor(days)} days ago`;
    if (hours >= 1) return `Happened ${Math.floor(hours)} hours ago`;
    return "Just finished";
  };

  const triggerRecalculation = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 1200);
  };

  const handleToggleInterested = (id: string) => {
    toggleInterested(id);
    triggerRecalculation();
  };

  const handleMarkNotInterested = (id: string) => {
    markNotInterested(id);
    triggerRecalculation();
  };


  const tutorialSteps: TutorialStep[] = [
    {
      targetId: 'tour-calendar',
      title: 'Your Calendar',
      content: 'This is your mini calendar. Toggle it to quickly check dates and manage your schedule without leaving the page.',
      position: 'left'
    },
    {
      targetId: 'tour-notifications',
      title: 'Notifications',
      content: 'Stay updated with alerts for upcoming events, deadline reminders, and invitations from peers.',
      position: 'left'
    },
    {
      targetId: 'tour-filter',
      title: 'Smart Filters',
      content: 'Use these filters to quickly find specific types of events like Hackathons, Workshops, or Fests.',
      position: 'bottom'
    },
    {
      targetId: 'tour-closing',
      title: 'Closing Soon',
      content: 'These events are starting or closing registration soon. Act fast to secure your spot!',
      position: 'top'
    },
    {
      targetId: 'tour-upcoming',
      title: 'Upcoming Events',
      content: 'Browse all future events here. Plan your schedule ahead of time.',
      position: 'top'
    },
    {
      targetId: 'tour-past',
      title: 'Past Archives',
      content: 'View previous events to see what you missed or check out winners and galleries.',
      position: 'top'
    }
  ];

  const EventSkeleton = () => (
    <div className="bg-white rounded-[28px] overflow-hidden border border-slate-100 h-[340px] w-full flex flex-col shadow-sm animate-pulse">
      <div className="aspect-video bg-slate-100" />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-2 w-20 bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-2/3 bg-slate-100 rounded" />
        </div>
        <div className="flex flex-col gap-2 pt-4">
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-slate-100 rounded-xl" />
            <div className="h-10 w-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEventGrid = (events: CampusEvent[], title: string, Icon: any, colorClass: string, id?: string) => {
    if (!isRecalculating && events.length === 0) return null;
    return (
      <div className="space-y-6">
        <div id={id} className="flex items-center justify-between border-b border-slate-100 pb-3 px-1">
          <div className="flex items-center gap-2.5">
            <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h2>
          </div>
          {isRecalculating ? (
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">AI Algorithm Recalculating...</span>
               <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" />
            </div>
          ) : (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{events.length} listings</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-1">
          {isRecalculating ? (
            Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)
          ) : (
            events.map((event) => {

            const isInterested = interestedIds.has(event.id);
            const isNotInterested = notInterestedIds.has(event.id);
            const isRegistered = registeredIds.has(event.id);
            let isPast = event.dayOfMonth < TODAY_DAY;
            
            const eventDate = parseDateTime(event.date, event.time);
            let timeString = null;
            let isUrgent = false;

            if (eventDate) {
              const diff = eventDate.getTime() - now.getTime();
              
              if (diff > (48 * 60 * 60 * 1000)) {
                 const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
                 timeString = `${days} Days`;
                 isUrgent = false;
              } else if (diff < 0) {
                 timeString = formatTimeAgo(diff);
                 isUrgent = false;
                 isPast = true;
              } else {
                 timeString = formatTimeDiff(diff);
                 isUrgent = true;
              }
            } else if (isPast) {
               timeString = "Happened recently";
               isUrgent = false;
             }
 
             return (
              <div 
                key={event.id} 
                className={`group relative bg-white rounded-[28px] overflow-hidden transition-all duration-300 border h-[340px] w-full flex flex-col ${
                  isUrgent 
                    ? 'border-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.03)]'
                    : isNotInterested ? 'border-slate-50 opacity-60' 
                    : isInterested ? 'border-rose-100 shadow-[0_8px_25px_rgba(244,63,94,0.06)]' : 'border-slate-100'
                } shadow-[0_4px_15px_rgba(0,0,0,0.02)]`}
              >
                <div 
                  className="relative aspect-video overflow-hidden cursor-pointer shrink-0" 
                  onClick={() => { setExploringEvent(event); onEventView?.(event.id); }}
                >
                  <ImageWithFallback src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-all duration-300 flex items-center justify-center p-4">
                     <span className="text-white text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                        View Details
                     </span>
                  </div>
                  
                  <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                      {event.category}
                    </div>
                    {!viewedEventIds.has(event.id) && !isPast && (
                       <div className="bg-rose-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 flex items-center gap-1">
                          <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                          NEW
                       </div>
                    )}
                  </div>

                  {timeString && (
                     <div className={`absolute bottom-5 right-5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 border transition-all ${
                        isPast 
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : isUrgent 
                        ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                        : 'bg-slate-900/90 backdrop-blur text-white border-white/10'
                     }`}>
                        {isPast ? <History className="w-3 h-3" /> : (isUrgent ? <Flame className="w-3 h-3 fill-white animate-bounce" /> : <Timer className="w-3 h-3" />)}
                        {timeString}
                     </div>
                  )}

                  {isInterested && !isRegistered && (
                    <div className="absolute top-5 right-5 bg-rose-500 text-white p-2.5 rounded-full shadow-lg ring-4 ring-white animate-in zoom-in">
                      <Heart className="w-3.5 h-3.5 fill-white" />
                    </div>
                  )}
                  {isRegistered && (
                    <div className="absolute top-5 right-5 bg-emerald-500 text-white p-2.5 rounded-full shadow-lg ring-4 ring-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                 <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center gap-2 mb-2 shrink-0">
                       <CalendarDays className="w-3 h-3 text-slate-400" />
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-4">
                    <button 
                      onClick={() => { setExploringEvent(event); onEventView?.(event.id); }}
                      className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                         isUrgent 
                         ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-200'
                         : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-slate-200'
                      }`}
                    >
                      View Details
                    </button>
                    
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleToggleInterested(event.id)}
                         className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border bg-white ${
                           isInterested 
                             ? 'text-rose-500 border-rose-200 shadow-sm' 
                             : 'text-slate-400 border-slate-100 hover:border-rose-100'
                         }`}
                       >
                         <Heart className={`w-3 h-3 ${isInterested ? 'fill-rose-500' : ''}`} />
                         {isInterested ? 'Saved' : 'Interested'}
                       </button>
                       {event.certification && isPastEvent(event) && registeredIds.has(event.id) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); launchCertificate(event); }}
                            className="px-3 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-600 transition-all flex items-center justify-center gap-1 active:scale-95"
                            title="Certificate QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest hidden xl:inline">QR</span>
                          </button>
                       )}
                       <button 
                         onClick={() => handleMarkNotInterested(event.id)}
                         className={`px-3 py-2.5 rounded-xl transition-all border bg-white ${
                           isNotInterested 
                            ? 'text-slate-400 border-slate-200' 
                            : 'text-slate-300 border-slate-100 hover:bg-slate-50'
                         }`}
                       >
                         <ThumbsDown className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col space-y-12 animate-in fade-in duration-1000 pb-20 overflow-y-auto no-scrollbar transition-all duration-500`}>
      
      {showTutorial && (
        <TutorialOverlay 
          steps={tutorialSteps} 
          onClose={handleTutorialComplete} 
          onComplete={handleTutorialComplete} 
        />
      )}

      {/* SPOTLIGHT SECTION */}
      <section className="relative w-full min-h-[300px] md:min-h-[420px] rounded-[48px] overflow-hidden bg-slate-950 flex items-center group shadow-2xl shrink-0">
         <ImageWithFallback 
           src="/assets/images/global_ai_hackathon_hero_1776800152149.png" 
           alt="Header" 
           className="absolute inset-0 w-full h-full opacity-40 grayscale-[0.2] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
         />
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
         
         {/* Glassmorphic Content Card */}
         <div className="relative z-10 ml-8 md:ml-16 p-6 md:p-10 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 max-w-xl space-y-4 shadow-2xl animate-in fade-in slide-in-from-left duration-1000">
            <div className="flex items-center gap-3">
               <span className="bg-rose-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20">Featured Event</span>
               <div id="tour-timer" className="flex items-center gap-2 text-rose-400 font-bold text-[9px] uppercase tracking-[0.2em]">
                  <Timer className="w-3.5 h-3.5 animate-spin-slow" /> Starting Jan 24
               </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.85] drop-shadow-2xl">
               GLOBAL AI<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">HACKATHON</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed max-w-md opacity-70">
               Join 2,500+ developers in the world's most intense 48-hour sprint to define the future of AGI.
            </p>
            <div className="flex items-center gap-4 pt-2">
               <button 
                  onClick={() => { const e = EVENTS_MOCK.find(ev => ev.id === 'e1'); if(e) { setExploringEvent(e); onEventView?.(e.id); } }} 
                  className="px-8 py-3.5 bg-white text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:bg-rose-50 transition-all hover:-translate-y-0.5 active:translate-y-0"
               >
                  Register Now
               </button>
               <button className="px-8 py-3.5 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                  Event Menu
               </button>
            </div>
         </div>
      </section>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col gap-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 uppercase">Vault <span className="text-slate-400">Events</span></h2>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">Curated campus opportunities</p>
           </div>
           
           <div id="tour-filter" className="flex flex-col gap-3 p-3 bg-white/40 border border-slate-200/60 rounded-2xl backdrop-blur-md self-start md:self-auto shadow-sm w-full md:w-auto">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <label className="flex flex-col gap-1">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Category</span>
                 <select
                   value={activeFilter}
                   onChange={(e) => setActiveFilter(e.target.value)}
                   className="min-w-[180px] bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-500 shadow-sm"
                 >
                   {['All', 'Competition', 'Workshop', 'Fest', 'Seminar'].map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                 </select>
               </label>

               <label className="flex flex-col gap-1">
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Status</span>
                 <select
                   value={activeStatusFilter}
                   onChange={(e) => setActiveStatusFilter(e.target.value)}
                   className="min-w-[180px] bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-rose-600/10 focus:border-rose-500 shadow-sm"
                 >
                   {['All', 'Live', 'Upcoming', 'Closed', 'Interested', 'Registered', 'Not Interested'].map(status => (
                     <option key={status} value={status}>{status}</option>
                   ))}
                 </select>
               </label>
             </div>

             <div className="flex items-center justify-between gap-3">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                 Use the dropdowns to narrow the event list
               </p>
               <button
                 onClick={clearFilters}
                 className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-slate-700 border border-transparent hover:border-slate-200 bg-white/70"
               >
                 Reset
               </button>
             </div>
           </div>
        </div>

        <div className="relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Vault..." 
            className="w-full bg-white border border-slate-100 pl-14 pr-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-[10px] focus:ring-rose-600/5 focus:border-rose-500 outline-none transition-all shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {(activeFilter !== 'All' || activeStatusFilter !== 'All' || searchQuery.trim()) && (
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span>{filteredData.length} events matched</span>
            {activeFilter !== 'All' && <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600">Category: {activeFilter}</span>}
            {activeStatusFilter !== 'All' && <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600">Status: {activeStatusFilter}</span>}
            {searchQuery.trim() && <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600">Search: {searchQuery.trim()}</span>}
          </div>
        )}
      </div>

      {/* EVENT GRIDS */}
      <div className="space-y-16 px-4">
        {renderEventGrid(categories.nearDeadline, "Closing Soon", AlertCircle, "bg-rose-500", "tour-closing")}
        {renderEventGrid(categories.upcoming, "Upcoming Events", CalendarCheck, "bg-blue-600", "tour-upcoming")}
        {renderEventGrid(categories.past, "Event History", Ticket, "bg-slate-800", "tour-past")}
      </div>
      
      {/* ... Portal content ... */}
      {exploringEvent && createPortal(
          <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto animate-in fade-in duration-300 font-sans">
             
             {/* Sticky Nav / Close - MODIFIED CROSS BUTTON */}
             <button 
                onClick={closeExplorer} 
                className="fixed top-6 right-6 z-[10000] w-12 h-12 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-xl border border-white/10 text-white shadow-2xl transition-all duration-300 hover:bg-rose-500 hover:border-rose-500 hover:scale-110 active:scale-90 group"
                title="Close Details"
             >
                <X className="w-5 h-5 stroke-[3px] group-hover:rotate-90 transition-transform duration-300" />
             </button>

             {/* Hero Image - Extended Height */}
             <div className="w-full h-[50vh] relative bg-slate-900">
                <ImageWithFallback src={exploringEvent.posterUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/50" />
             </div>

             {/* Content Container */}
             <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-32">
                {/* Main Card */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
                   
                   {/* Header Info */}
                   <div className="flex flex-col gap-6 mb-8">
                      <div className="flex flex-wrap items-center gap-3">
                         <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-widest border border-slate-200">
                            {exploringEvent.category}
                         </span>
                         <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
                            <Users className="w-3 h-3" /> {exploringEvent.attendees} Attending
                         </span>
                         {exploringEvent.type === 'Live' && (
                           <span className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-500 text-[11px] font-black uppercase tracking-widest border border-rose-100 animate-pulse">
                              Live Event
                           </span>
                         )}
                      </div>
                      
                      <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.95] tracking-tight">
                         {exploringEvent.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium text-sm">
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            {exploringEvent.date}
                         </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                            <Clock className="w-4 h-4 text-blue-500" />
                            {isExploringEventPast ? "Event Concluded" : exploringEvent.time}
                         </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            {exploringEvent.location}
                         </div>
                      </div>
                   </div>

                   {/* Consolidated Action Bar */}
                   <div className="flex flex-col sm:flex-row gap-4 mb-8 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <button 
                         onClick={isExploringEventPast ? undefined : (isRegistered ? () => setShowPeersModal(true) : onRegisterClick)}
                         disabled={isExploringEventPast}
                         className={`flex-1 py-4 px-8 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 ${
                           isExploringEventPast
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
                            : isRegistered 
                            ? 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-slate-900 text-white hover:bg-black shadow-slate-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                         }`}
                       >
                         {isExploringEventPast 
                            ? <><History className="w-5 h-5"/> Event Concluded</>
                            : isRegistered 
                            ? <><UserPlus className="w-5 h-5"/> Invite Peers</> 
                            : <>Register Now <ArrowRight className="w-5 h-5"/></>
                         }
                       </button>
                       
                       <div className="flex gap-2">
                           <button 
                             onClick={() => handleToggleInterested(exploringEvent.id)}
                             className={`px-6 py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none ${
                                isInterested 
                                ? 'border-rose-200 bg-rose-50 text-rose-600'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-rose-200 hover:text-rose-500'
                             }`}
                             title="Interested"
                           >
                             <Heart className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`} />
                             <span className="hidden sm:inline text-xs uppercase tracking-widest">Interested</span>
                           </button>

                           <button 
                             onClick={() => handleMarkNotInterested(exploringEvent.id)}
                             className={`px-6 py-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                                isNotInterested 
                                ? 'border-slate-300 bg-slate-100 text-slate-600'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700'
                             }`}
                             title="Not Interested"
                           >
                             <ThumbsDown className="w-5 h-5" />
                           </button>
                       </div>
                   </div>
                   
                   {isRegistered && !isExploringEventPast && (
                      <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-sm gap-2">
                        <CheckCircle2 className="w-5 h-5" /> You are registered for this event.
                      </div>
                   )}

                   {exploringEvent.certification && isExploringEventPast && isRegistered && (
                       <div className="mb-8 space-y-6">
                         
                         {/* Header of Certificate section */}
                         <div className="flex flex-col gap-1 text-left">
                           <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                             <Award className="w-5.5 h-5.5 text-amber-500 fill-amber-100" /> Your Earned Certificate
                           </h3>
                           <p className="text-xs text-slate-400 font-medium">
                             You successfully participated and completed this event! Here is your verified digital credential.
                           </p>
                         </div>

                         {/* Customizer Name Input */}
                         <div className="flex flex-col gap-2 p-5 bg-slate-50 border border-slate-200/60 rounded-[24px] text-left">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                             <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Customize Recipient Name
                           </label>
                           <input 
                             type="text" 
                             value={recipientName}
                             onChange={(e) => setRecipientName(e.target.value)}
                             className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
                             placeholder="Enter custom recipient name..."
                           />
                         </div>

                         {/* High-Fidelity Classical Certificate Frame (Live update) */}
                         <div className="w-full overflow-hidden flex items-center justify-center p-1 bg-slate-900 border border-slate-800 rounded-[28px] shadow-2xl relative aspect-[1.5/1] select-none">
                           <div className="w-full h-full scale-[0.98] sm:scale-100 transition-all origin-center bg-gradient-to-br from-[#fdfcf7] to-[#f4f0e4] rounded-[22px] border-4 border-double border-amber-500/80 p-4 sm:p-8 flex flex-col justify-between text-slate-800 relative">
                             {/* Corner Ornaments */}
                             <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-500/60" />
                             <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-500/60" />
                             <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-amber-500/60" />
                             <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-500/60" />

                             {/* Content Top */}
                             <div className="text-center space-y-0.5">
                               <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 font-sans">
                                 Campus Pilot Academy
                               </span>
                               <h3 className="text-xs sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                                 Certificate of Excellence
                               </h3>
                               <p className="text-[6px] sm:text-[10px] italic text-slate-400 font-serif leading-none">
                                 This is proudly presented to
                               </p>
                             </div>

                             {/* Content Mid */}
                             <div className="text-center my-1 sm:my-2">
                               <h1 className="text-md sm:text-3xl font-extrabold text-[#8c3a21] font-serif tracking-wide truncate">
                                 {recipientName || 'Garvit Dev'}
                               </h1>
                               <div className="w-1/4 h-0.5 bg-amber-500/30 mx-auto my-1" />
                               <p className="text-[5px] sm:text-[9px] text-slate-500 font-serif leading-relaxed max-w-sm mx-auto">
                                 for successful completion and outstanding performance in the campus hackathon
                               </p>
                               <h4 className="text-[9px] sm:text-base font-black text-[#cc2929] uppercase tracking-wider mt-0.5 font-sans">
                                 {exploringEvent.title}
                               </h4>
                             </div>

                             {/* Content Bottom */}
                             <div className="flex justify-between items-end pt-1.5 sm:pt-3 border-t border-slate-200/50">
                               <div className="text-left w-[80px] sm:w-[120px]">
                                 <span className="font-serif italic text-[7px] sm:text-sm text-slate-700 font-bold tracking-wider leading-none block">
                                   Dr. Sarah Chen
                                 </span>
                                 <div className="h-px bg-slate-300 w-full my-0.5" />
                                 <span className="text-[4px] sm:text-[7px] font-black text-slate-400 uppercase tracking-wider block font-sans">
                                   Head of Jury
                                 </span>
                               </div>

                               <div className="relative">
                                 <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center border border-white/20 shadow-sm">
                                   <span className="text-[5px] sm:text-[8px] font-black text-white">★</span>
                                 </div>
                               </div>

                               <div className="text-right w-[80px] sm:w-[120px]">
                                 <span className="font-serif italic text-[7px] sm:text-sm text-slate-700 font-bold tracking-wider leading-none block">
                                   Prof. Sharma
                                 </span>
                                 <div className="h-px bg-slate-300 w-full my-0.5" />
                                 <span className="text-[4px] sm:text-[7px] font-black text-slate-400 uppercase tracking-wider block font-sans">
                                   Campus Director
                                 </span>
                               </div>
                             </div>
                           </div>
                         </div>

                         {/* Action Buttons: Launch QR Modal + Download Image */}
                         <div className="flex flex-col sm:flex-row gap-3">
                           <button 
                             onClick={() => launchCertificate(exploringEvent)}
                             className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                           >
                             <QrCode className="w-4 h-4 animate-pulse" /> Mobile Claim QR
                           </button>
                           <button 
                             onClick={() => handleDownloadCertificate(exploringEvent)}
                             disabled={isDownloading}
                             className={`flex-1 px-6 py-4 bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 border border-slate-800 \${
                               isDownloading ? 'opacity-80 cursor-wait' : ''
                             }`}
                           >
                             {isDownloading ? (
                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                             ) : (
                               <Download className="w-4 h-4" />
                             )}
                             {isDownloading ? 'Downloading...' : 'Download Certificate'}
                           </button>
                         </div>
                       </div>
                    )}

                   {/* Global Participants Insight */}
                   <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
                      <div className="flex -space-x-3 shrink-0">
                         {Array.from({ length: 4 }).map((_, i) => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 15})`, backgroundSize: 'cover' }} />
                         ))}
                         <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shadow-sm">
                           +{exploringEvent.attendees > 4 ? exploringEvent.attendees - 4 : 0}
                         </div>
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-800">
                           <span className="text-indigo-600">{exploringEvent.attendees} people</span> from worldwide are participating
                         </p>
                         <p className="text-xs text-slate-500 mt-0.5">Don't miss out! Join the global community in this event.</p>
                      </div>
                   </div>

                   <div className="h-px bg-slate-100 w-full mb-12" />

                   {/* Details Content Layout */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* Main Column */}
                      <div className="lg:col-span-2 space-y-12">
                         {/* Description */}
                         <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                               <Sparkles className="w-4 h-4 text-amber-500" /> About Event
                            </h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                               {exploringEvent.description}
                            </p>
                         </div>

                        {/* Event Gallery - NEW SECTION */}
                        {exploringEvent.gallery && (
                           <div>
                              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                 <Camera className="w-4 h-4 text-pink-500" /> Event Gallery
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64">
                                 {exploringEvent.gallery.map((img, idx) => (
                                    <div key={idx} className={`relative overflow-hidden rounded-2xl group h-full shadow-sm border border-slate-100 ${idx === 0 ? 'md:col-span-2' : ''}`}>
                                       <ImageWithFallback src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                       <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Prizes Section - NEW */}
                        {exploringEvent.prizesList && (
                          <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                               <Gift className="w-4 h-4 text-rose-500" /> Prize Pool
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {exploringEvent.prizesList.map((prize, index) => (
                                <div key={index} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group">
                                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${prize.color} opacity-10 rounded-bl-[40px] transition-transform group-hover:scale-110`} />
                                  <div className="relative z-10">
                                    <h4 className="text-2xl font-black text-slate-900 mb-1">{prize.amount}</h4>
                                    <h5 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">{prize.title}</h5>
                                    <p className="text-xs text-slate-500 leading-relaxed">{prize.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                         {/* Tracks & Themes */}
                         {exploringEvent.tracks && exploringEvent.tracks.length > 0 && (
                            <div>
                               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <Cpu className="w-4 h-4 text-[#cc2929]" /> Focus Tracks
                               </h3>
                               <div className="flex flex-wrap gap-2">
                                  {exploringEvent.tracks.map(track => (
                                     <span key={track} className="px-4 py-2.5 rounded-xl bg-[#fdfaf2] border border-[#ebdbb5] text-[#8c3a21] text-xs font-bold shadow-sm hover:border-[#cc2929]/50 transition-all cursor-default">
                                        {track}
                                     </span>
                                  ))}
                               </div>
                            </div>
                         )}

                         {/* Judges Section - NEW */}
                         {exploringEvent.judges && (
                           <div>
                             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Award className="w-4 h-4 text-purple-500" /> Jury & Speakers
                             </h3>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               {exploringEvent.judges.map((judge, idx) => (
                                 <div key={idx} className="flex flex-col items-center text-center group">
                                   <div className="w-20 h-20 rounded-full mb-3 overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-purple-200 transition-all">
                                     <ImageWithFallback src={judge.avatarUrl} alt={judge.name} className="w-full h-full" />
                                   </div>
                                   <h4 className="font-bold text-slate-900 text-sm">{judge.name}</h4>
                                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mt-1">{judge.role}</p>
                                   <p className="text-[10px] text-slate-400 mt-0.5">{judge.company}</p>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Timeline */}
                         <div className="bg-[#fdfaf2]/50 rounded-[32px] p-8 border border-[#ebdbb5]/60">
                             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                               <Timer className="w-4 h-4 text-[#cc2929]" /> Schedule Flow
                            </h3>
                            <div className="space-y-0 relative pl-2">
                               {/* Continuous Line */}
                               <div className="absolute left-[13px] top-2 bottom-4 w-0.5 bg-[#ebdbb5]/80" />
                               
                               {exploringEvent.timeline.map((t, i) => (
                                  <div key={i} className="flex gap-6 relative pb-10 last:pb-0">
                                     <div className="w-3 h-3 bg-[#cc2929] rounded-full mt-1.5 shrink-0 ring-4 ring-[#fdfaf2] relative z-10" />
                                     <div>
                                        <span className="text-[10px] font-black text-[#8c3a21] uppercase tracking-widest block mb-1">{t.time}</span>
                                        <h4 className="font-bold text-slate-900 text-base">{t.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                         
                         {/* FAQs - NEW */}
                         {exploringEvent.faqs && (
                           <div>
                             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-teal-500" /> Frequently Asked Questions
                             </h3>
                             <div className="grid grid-cols-1 gap-4">
                               {exploringEvent.faqs.map((faq, idx) => (
                                 <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                   <h4 className="font-bold text-slate-900 text-sm mb-2">{faq.q}</h4>
                                   <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Need Help Section - NEW */}
                         <div className="border-t border-[#ebdbb5]/60 pt-12">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                               <LifeBuoy className="w-4 h-4 text-[#cc2929]" /> Organizer Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <a href={`tel:${exploringEvent.organizerContact?.phone}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ebdbb5] hover:bg-[#fdfaf2]/40 hover:border-[#cc2929]/50 transition-all group">
                                  <div className="w-12 h-12 rounded-xl bg-[#cc2929]/10 flex items-center justify-center text-[#cc2929] group-hover:bg-[#cc2929] group-hover:text-white transition-colors">
                                     <Phone className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Emergency Contact</span>
                                     <span className="text-sm font-black text-[#cc2929]">{exploringEvent.organizerContact?.phone || "+91 99887 76655"}</span>
                                  </div>
                               </a>
                               
                               <a href={`mailto:${exploringEvent.organizerContact?.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#ebdbb5] hover:bg-[#fdfaf2]/40 hover:border-[#cc2929]/50 transition-all group">
                                  <div className="w-12 h-12 rounded-xl bg-[#cc2929]/10 flex items-center justify-center text-[#cc2929] group-hover:bg-[#cc2929] group-hover:text-white transition-colors">
                                     <Mail className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Official Email</span>
                                     <span className="text-sm font-black text-[#cc2929]">{exploringEvent.organizerContact?.email || "events@nst.edu"}</span>
                                  </div>
                               </a>
                            </div>
                         </div>
                      </div>

                      {/* Sidebar Column */}
                      <div className="space-y-6">
                         {/* Key Info Card */}
                         <div className="p-6 rounded-[32px] border border-[#ebdbb5] bg-[#fdfaf2] shadow-sm space-y-6">
                            <h3 className="text-xs font-black text-[#8c3a21] uppercase tracking-[0.2em] border-b border-[#ebdbb5] pb-4">
                               Essentials
                            </h3>
                            
                            <div className="space-y-5">
                               <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Eligibility</span>
                                  <span className="text-sm font-bold text-[#8c3a21] flex items-center gap-2">
                                     <GraduationCap className="w-4 h-4 text-[#cc2929]" />
                                     {exploringEvent.eligibility}
                                  </span>
                               </div>
                               <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Team Size</span>
                                  <span className="text-sm font-bold text-[#8c3a21] flex items-center gap-2">
                                     <Users2 className="w-4 h-4 text-[#cc2929]" />
                                     {exploringEvent.teamSize}
                                  </span>
                               </div>
                               <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Prize Pool</span>
                                  <span className="text-sm font-bold text-[#8c3a21] flex items-center gap-2">
                                     <Trophy className="w-4 h-4 text-[#cc2929]" />
                                     {exploringEvent.prizePool || 'N/A'}
                                  </span>
                               </div>
                            </div>
                         </div>
                         
                         {/* Rules Card - NEW */}
                         {exploringEvent.rules && (
                            <div className="p-6 rounded-[32px] border border-slate-200 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] space-y-6">
                               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-4 flex items-center gap-2">
                                 <Shield className="w-4 h-4 text-slate-400" /> Key Rules
                               </h3>
                               <ul className="space-y-3">
                                  {exploringEvent.rules.map((rule, idx) => (
                                    <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                      {rule}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                         )}

                         {/* Sponsors Card - NEW */}
                         {exploringEvent.sponsors && (
                           <div className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 space-y-6">
                              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] pb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-slate-400" /> Partners
                              </h3>
                              <div className="flex flex-wrap gap-3">
                                {exploringEvent.sponsors.map((sponsor, idx) => (
                                  <span key={idx} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${
                                    sponsor.tier === 'Platinum' ? 'bg-white border-slate-200 text-slate-800 shadow-sm' : 
                                    'bg-transparent border-slate-200 text-slate-500'
                                  }`}>
                                    {sponsor.name}
                                  </span>
                                ))}
                              </div>
                           </div>
                         )}

                         {/* XP Reward Card */}
                         <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#cc2929] to-[#8c3a21] text-white shadow-xl shadow-[#cc2929]/20 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            
                            <div className="relative z-10">
                               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                 <Zap className="w-5 h-5 fill-white text-white" />
                               </div>
                               <div className="text-4xl font-black mb-1 tracking-tight">{exploringEvent.xp} XP</div>
                               <p className="text-rose-100 text-xs font-bold uppercase tracking-widest opacity-80">Earned upon completion</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Modals ... */}
             {showConfirmModal && (
               <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 scale-100 animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Registration</h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                      Are you sure you want to register for <span className="font-bold text-slate-800">{exploringEvent.title}</span>? This will secure your spot.
                    </p>
                    <div className="flex gap-3">
                       <button 
                         onClick={() => setShowConfirmModal(false)}
                         className="flex-1 py-3 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                       >
                         Cancel
                       </button>
                       <button 
                         onClick={confirmRegistration}
                         className="flex-1 py-3 text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-200"
                       >
                         Confirm
                       </button>
                    </div>
                 </div>
               </div>
             )}
             
             {showSuccessModal && (
               <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 scale-100 animate-in zoom-in-95 duration-200 text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">You registered!</h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                      You are now officially part of the event. Get ready to compete and learn!
                    </p>
                    <div className="flex flex-col gap-3">
                       <button 
                         onClick={() => { setShowSuccessModal(false); setShowPeersModal(true); }}
                         className="w-full py-4 text-white font-bold text-sm bg-slate-900 hover:bg-black rounded-xl transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                       >
                         <UserPlus className="w-4 h-4" /> Ask Peers to Join
                       </button>
                       <button 
                         onClick={() => setShowSuccessModal(false)}
                         className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                       >
                         Close
                       </button>
                    </div>
                 </div>
               </div>
             )}

             {showPeersModal && (
               <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-black text-slate-900">Invite Peers</h3>
                       <button onClick={() => setShowPeersModal(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500">
                          <X className="w-5 h-5" />
                       </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
                       {PEERS_MOCK.map(peer => {
                         const currentEventInvites = invitedPeersMap[exploringEvent.id];
                         const isInvited = currentEventInvites ? currentEventInvites.has(peer.id) : false;
                         
                         return (
                           <div key={peer.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                              <div className="flex items-center gap-3">
                                 <img src={peer.avatar} alt={peer.name} className="w-10 h-10 rounded-full border border-white shadow-sm" />
                                 <div>
                                    <h4 className="text-sm font-bold text-slate-900">{peer.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{peer.role}</p>
                                 </div>
                              </div>
                              <button 
                                onClick={() => onInvitePeer(peer.id)}
                                disabled={isInvited}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                  isInvited 
                                  ? 'bg-slate-200 text-slate-500 cursor-default'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                                }`}
                              >
                                {isInvited ? 'Invited' : <><Send className="w-3 h-3" /> Invite</>}
                              </button>
                           </div>
                         );
                       })}
                    </div>

                    <div className="text-center">
                       <p className="text-xs text-slate-400 font-medium">Invites are sent immediately via notification center.</p>
                    </div>
                 </div>
               </div>
             )}
          </div>,
          document.body
      )}

      {/* Certificate Modal */}
      {certificateEvent && (
        <CertificateModal 
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          event={certificateEvent}
        />
      )}
    </div>
  );
};
