"use client";

import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import {
  Send,
  User,
  Dumbbell,
  Apple,
  Activity,
  PlusCircle,
  Loader2,
  Info,
  Menu,
  X,
  MessageSquare,
  Trash2,
  Edit,
  Clock,
  History,
  Settings,
  ChevronRight,
  Target
} from "lucide-react";

import ReactMarkdown from "react-markdown";

/* ---------------- TYPES & INTERFACES ---------------- */

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date | string;
}

interface UserProfile {
  age: string;
  height: string;
  weight: string;
  gender: string;
  goal: string;
  activity: string;
}

/* ---------------- SIDEBAR COMPONENT ---------------- */

const Sidebar = memo(
  ({
    sessions,
    activeSessionId,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    isOpen,
    onClose,
    onOpen,
    onOpenProfile
  }: {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    onOpenProfile: () => void;
  }) => {
    const recentSessions = [...sessions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15);

    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40" onClick={onClose} />
        )}

        <aside
          className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col h-screen border-r border-zinc-800 
          bg-[#0c0c0e] transition-all duration-300 ease-in-out
          ${isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:hidden"}`}
        >
          {/* Header & Brand */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 rotate-3">
                <Activity size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white">AI Fitness Coach</span>
              </div>
            </div>
            <button className="text-zinc-400 hover:text-white lg:hidden" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Primary Action */}
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 
                         bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl 
                         font-bold text-xs transition-all shadow-xl shadow-emerald-500/20 
                         active:scale-[0.98] group"
            >
              <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              New Consultation
            </button>
          </div>

          {/* Navigation / History */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
            <div className="flex items-center gap-2 px-3 mb-3 mt-4">
              <History size={12} className="text-zinc-500" />
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em]">
                Consultation History
              </h3>
            </div>

            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                  <Clock size={16} className="text-zinc-600" />
                </div>
                <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
                  Your fitness journey <br /> history starts here.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onSelectChat(session.id)}
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all border
                      ${activeSessionId === session.id
                        ? "bg-emerald-900/20 border-emerald-900/40 text-emerald-400 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-zinc-900 text-zinc-400"
                      }
                    `}
                  >
                    <MessageSquare size={16} className={`flex-shrink-0 ${activeSessionId === session.id ? "opacity-100" : "opacity-40"}`} />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="text-xs font-bold truncate leading-none mb-1">{session.title}</span>
                      <span className="text-[9px] opacity-60 font-medium tracking-tight">{session.messages.length} exchanges</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(session.id); }}
                      className={`p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-950/20 transition-all lg:opacity-0 lg:group-hover:opacity-100
                        ${activeSessionId === session.id ? "opacity-40" : ""}
                      `}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Profile Section */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
            <div 
              onClick={onOpenProfile}
              className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner">
                  <User size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-bold truncate text-zinc-200">My Profile</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Edit Details</p>
                </div>
              </div>
              <Settings size={14} className="text-zinc-500 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
        </aside>

        {/* Collapsed Sidebar (Desktop) */}
        {!isOpen && (
          <div className="hidden lg:flex flex-col items-center h-screen w-16 py-5 gap-8 border-r border-zinc-800 bg-[#0c0c0e]">
            <button onClick={onOpen} className="text-zinc-400 hover:text-white transition-colors" title="Open Sidebar">
              <Menu size={22} />
            </button>
            <button onClick={onNewChat} className="text-zinc-400 hover:text-emerald-500 transition-colors" title="New Session">
              <Edit size={20} />
            </button>
            <div className="mt-auto">
              <button onClick={onOpenProfile} className="text-zinc-400 hover:text-emerald-500 transition-colors" title="Edit Profile">
                <User size={20} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
);
Sidebar.displayName = "Sidebar";

/* ---------------- WORKOUT UI CARD COMPONENT ---------------- */

const WorkoutCard = ({ title, exercisesString }: { title: string, exercisesString: string }) => {
  // Parse markdown bullets into an array of exercise strings
  const exercises = exercisesString
    .split('\n')
    .filter(e => e.trim().startsWith('-') || e.trim().startsWith('*'))
    .map(e => e.replace(/^[-*]\s*/, '').trim())
    .filter(e => e.length > 0);

  return (
    <div className="my-5 bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg transform transition-all hover:scale-[1.01]">
      <div className="bg-emerald-950/30 px-5 py-3.5 border-b border-emerald-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-900/50 rounded-lg">
            <Dumbbell size={16} className="text-emerald-400" />
          </div>
          <h4 className="font-bold text-emerald-50 text-sm tracking-wide">{title}</h4>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-3">
          {exercises.map((ex, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <div className="mt-1 flex items-center justify-center w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 group-hover:border-emerald-500 transition-colors">
                <ChevronRight size={10} className="text-zinc-400 group-hover:text-emerald-400 transition-colors ml-0.5" />
              </div>
              <span className="text-[14px] text-zinc-300 font-medium leading-snug">{ex}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ---------------- PROFILE MODAL COMPONENT ---------------- */

const ProfileModal = ({ 
  profile, 
  onSave, 
  onClose 
}: { 
  profile: UserProfile | null, 
  onSave: (p: UserProfile) => void, 
  onClose: () => void 
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile || {
    age: '', height: '', weight: '', gender: 'male', goal: 'fat loss', activity: 'moderate'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-900/30 rounded-xl">
              <Target size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Fitness Profile</h2>
              <p className="text-[11px] text-zinc-400 uppercase tracking-widest font-semibold mt-0.5">Personalize Your AI Coach</p>
            </div>
          </div>
          {profile && (
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Age</label>
              <input required name="age" type="number" placeholder="e.g. 24" value={formData.age} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Gender</label>
              <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Height</label>
              <input required name="height" placeholder="e.g. 175 cm" value={formData.height} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Weight</label>
              <input required name="weight" placeholder="e.g. 78 kg" value={formData.weight} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Primary Goal</label>
            <select required name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
              <option value="fat loss">Fat Loss & Toning</option>
              <option value="muscle gain">Muscle Gain (Hypertrophy)</option>
              <option value="strength">Strength & Power</option>
              <option value="endurance">Endurance & Cardio</option>
              <option value="maintenance">General Health & Maintenance</option>
            </select>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Activity Level</label>
            <select required name="activity" value={formData.activity} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
              <option value="sedentary">Sedentary (Little to no exercise)</option>
              <option value="light">Lightly Active (1-3 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="very active">Very Active (6-7 days/week)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mt-6 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
            Save Profile & Start
          </button>
        </form>
      </div>
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */

const SUGGESTIONS = [
  { label: "High Protein Meal Plan", icon: <Apple size={14}/> },
  { label: "5-Day Workout Split", icon: <Dumbbell size={14}/> },
  { label: "Calculate My Macros", icon: <Activity size={14}/> }
];

export default function App() {

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string|null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);       // API is fetching
  const [streaming, setStreaming] = useState(false);   // UI is simulating typing
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = useMemo(
    ()=>sessions.find((s)=>s.id===currentSessionId),
    [sessions,currentSessionId]
  );

  const messages = currentSession?.messages || [];

  /* ---------- INITIALIZATION ---------- */

  useEffect(()=>{
    // Load Profile
    const savedProfile = localStorage.getItem("vitalis_profile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      setShowProfileModal(true); // Force onboarding if missing
    }

    // Load History
    const savedHistory = localStorage.getItem("vitalis_sessions");
    if(savedHistory){
      try{
        const parsed = JSON.parse(savedHistory).map((s:any)=>({
          ...s,
          createdAt:new Date(s.createdAt),
          messages:s.messages.map((m:any)=>({
            ...m,
            timestamp:new Date(m.timestamp)
          }))
        }));
        setSessions(parsed);
        setCurrentSessionId(parsed[0]?.id||null);
      }catch{
        localStorage.removeItem("vitalis_sessions");
      }
    }else{
      createSession();
    }
  },[]);

  /* ---------- EFFECTS ---------- */

  useEffect(()=>{
    if(sessions.length){
      localStorage.setItem("vitalis_sessions",JSON.stringify(sessions));
    }
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth", block:"end" });
  },[sessions]);

  /* ---------- SESSION MGMT ---------- */

  const createSession = ()=>{
    const id = Date.now().toString();
    const session:ChatSession={
      id, title:"New Consultation", createdAt:new Date(),
      messages:[{
        id:"1", role:"assistant",
        content:"Welcome to **AI Fitness Coach** 💪I'm your personal fitness and nutrition guide.\nHow can I help you today?",
        timestamp:new Date()
      }]
    };
    setSessions((prev)=>[session,...prev]);
    setCurrentSessionId(id);
    setTimeout(()=> inputRef.current?.focus(), 100);
  };

  const deleteSession = (id:string)=>{
    const filtered = sessions.filter((s)=>s.id!==id);
    setSessions(filtered);
    if(currentSessionId===id) setCurrentSessionId(filtered[0]?.id||null);
    if(!filtered.length) createSession();
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("vitalis_profile", JSON.stringify(profile));
    setShowProfileModal(false);
  };

  /* ---------- REALISTIC STREAMING ---------- */

  const streamText = async(text:string, targetSessionId: string)=>{
    setStreaming(true);
    let current="";
    
    // Simulate dynamic typing speeds (chunk size varies, delay varies)
    const minChunk = 2;
    const maxChunk = 8; 

    for(let i=0; i<text.length; ){
      const chunkSize = Math.floor(Math.random() * (maxChunk - minChunk + 1)) + minChunk;
      const chunk = text.slice(i, i + chunkSize);
      current += chunk;

      setSessions(prev=>
        prev.map(s=>{
          if(s.id!==targetSessionId) return s;
          if(!s.messages.length) return s;
          const msgs=[...s.messages];
          msgs[msgs.length-1]={ ...msgs[msgs.length-1], content:current };
          return {...s,messages:msgs};
        })
      );

      i += chunkSize;
      
      // Dynamic delay: pause slightly longer on punctuation for realism
      const delay = chunk.match(/[.,!?\n:-]/) ? 40 : 12;
      await new Promise(r=>setTimeout(r, delay));
    }
    setStreaming(false);
  };

  /* ---------- SEND MESSAGE ---------- */

  const sendMessage = async(text?:string)=>{
    const message=text||input;
    if(!message.trim()||loading||streaming||!currentSessionId) return;

    const userMsg:Message={
      id:Date.now().toString(), role:"user", content:message, timestamp:new Date()
    };

    setSessions(prev=>
      prev.map(s=>{
        if(s.id!==currentSessionId) return s;
        return{
          ...s,
          title: s.messages.length===1 ? message.slice(0,30).trim()+(message.length>30?"...":"") : s.title,
          messages:[...s.messages,userMsg]
        };
      })
    );

    setInput("");
    setLoading(true);
    const targetSessionId = currentSessionId;

    try{
      // Format Profile String
      const profileContext = userProfile 
        ? `\n\n[USER PROFILE: Age ${userProfile.age}, Height ${userProfile.height}, Weight ${userProfile.weight}, Gender ${userProfile.gender}, Goal: "${userProfile.goal}", Activity: "${userProfile.activity}". Always personalize your advice using this profile.]` 
        : "";

      // Enforce strict format for UI Workout Cards
      const secretPrompt = `\n\n[SYSTEM DIRECTIVE: Respond with a highly structured, professional format. Absolutely NO markdown tables. When generating workout plans, you MUST format each day exactly like this:\n### Day 1 - [Title]\n- Exercise 1\n- Exercise 2\nDo not use bolding or other characters around the 'Day' title. Be direct and authoritative.]` + profileContext;

      const res = await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          message: message + secretPrompt, 
          history:messages.slice(-10).map(m=>({ role:m.role, content:m.content }))
        })
      });

      const data = await res.json();
      setLoading(false); // API fetch complete, start streaming

      const aiMsg:Message={
        id:Date.now().toString(), role:"assistant", content:"", timestamp:new Date()
      };

      setSessions(prev=>
        prev.map(s=> s.id===targetSessionId ? {...s,messages:[...s.messages,aiMsg]} : s)
      );

      await streamText(
        data?.reply ?? "I couldn't generate a response right now. Please try again.",
        targetSessionId
      );

    }catch{
      console.error("AI error");
      setLoading(false);
    }
  };

  /* ---------- PARSER: Text vs UI Cards ---------- */

  const renderMessageContent = (content: string) => {
    const blocks: { type: 'markdown' | 'workout', content: string, title?: string }[] = [];
    let lastIndex = 0;
    
    // Looks for "### Day 1 - Chest" followed by a bulleted list "- Bench press"
    const regex = /(?:###\s+)?(Day\s+\d+[\s\-:]+[^\n]+)\n((?:[\s]*[-*]\s+[^\n]+\n?)+)/gi;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        blocks.push({ type: 'markdown', content: content.slice(lastIndex, match.index) });
      }
      blocks.push({ type: 'workout', title: match[1].replace(/\*\*/g, '').trim(), content: match[2] });
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < content.length) {
      blocks.push({ type: 'markdown', content: content.slice(lastIndex) });
    }

    return blocks.map((block, idx) => {
      if (block.type === 'workout' && block.title) {
        return <WorkoutCard key={idx} title={block.title} exercisesString={block.content} />;
      }
      
      // Fallback basic formatter for broken tables just in case
      const safeContent = block.content.replace(/\|/g, ' | ');

      return (
        <div key={idx} className="overflow-x-auto whitespace-pre-wrap break-words">
          <ReactMarkdown 
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-extrabold text-white mt-5 mb-3 border-b border-zinc-800 pb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-emerald-400 mt-5 mb-3 first:mt-0" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-emerald-300 mt-4 mb-2 first:mt-0" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-zinc-300 marker:text-emerald-500" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-zinc-300 marker:text-emerald-500 font-medium" {...props} />,
              li: ({ node, ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
              p: ({ node, ...props }) => <p className="mb-3 last:mb-0 text-zinc-300 leading-relaxed" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold text-emerald-400" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 my-3 italic text-zinc-400 bg-emerald-950/10 rounded-r-lg" {...props} />,
              code: ({ node, inline, children, ...props }: any) => 
                inline 
                  ? <code className="bg-zinc-800/50 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                  : <div className="overflow-x-auto my-3 border border-zinc-800 rounded-xl bg-[#141417] shadow-sm"><pre className="p-4 text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre" {...props}>{children}</pre></div>
            }}
          >
            {safeContent}
          </ReactMarkdown>
        </div>
      );
    });
  };

  /* ---------------- UI RENDER ---------------- */

  return(
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      
      {showProfileModal && (
        <ProfileModal profile={userProfile} onSave={handleSaveProfile} onClose={() => {
          if (userProfile) setShowProfileModal(false); // Only allow close if profile exists
        }} />
      )}

      <Sidebar
        sessions={sessions}
        activeSessionId={currentSessionId}
        onNewChat={createSession}
        onSelectChat={setCurrentSessionId}
        onDeleteChat={deleteSession}
        isOpen={sidebarOpen}
        onClose={()=>setSidebarOpen(false)}
        onOpen={()=>setSidebarOpen(true)}
        onOpenProfile={()=>setShowProfileModal(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Navbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-[#050505]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white transition-colors lg:hidden">
                <Menu size={20} />
              </button>
            )}
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
              {currentSession?.title || "AI Fitness Coach"}
            </p>
          </div>
          <Info size={18} className="text-zinc-600"/>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10">
            {messages.map(m=>(
              <div key={m.id} className={`flex gap-4 ${m.role==="user"?"flex-row-reverse":""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  m.role === "user" ? "bg-zinc-800 text-white" : "bg-emerald-600 text-white shadow-emerald-500/20"
                }`}>
                  {m.role==="user" ? <User size={18}/> : <Dumbbell size={18} />}
                </div>

                <div className={`px-6 py-5 rounded-3xl max-w-[95%] sm:max-w-[85%] text-[15px] min-w-0 shadow-md ${
                  m.role==="user"
                    ?"bg-emerald-600 text-white rounded-tr-none"
                    :"bg-[#0f0f11] border border-zinc-800/80 rounded-tl-none"
                }`}>
                  {renderMessageContent(m.content)}
                </div>
              </div>
            ))}

            {/* Realistic Typing Indicator (Only shows before streaming starts) */}
            {loading && !streaming && (
              <div className="flex items-center gap-4 text-zinc-400 text-sm animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-500 shadow-sm border border-zinc-800/80">
                  <Loader2 size={18} className="animate-spin"/>
                </div>
                <div className="flex gap-2 items-center bg-[#0f0f11] px-5 py-4 rounded-3xl rounded-tl-none border border-zinc-800/80 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"/>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"/>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"/>
                  <span className="ml-2 font-semibold tracking-wide text-zinc-300 text-xs uppercase">Coach thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}/>
          </div>
        </main>

        {/* Input Area */}
        <footer className="p-4 sm:p-6 border-t border-zinc-900 bg-[#050505] z-10">
          <div className="max-w-4xl mx-auto">
            {messages.length<3&&!loading&&!streaming&&(
              <div className="flex gap-2 mb-3 flex-wrap animate-in slide-in-from-bottom-2 duration-500">
                {SUGGESTIONS.map(s=>(
                  <button
                    key={s.label}
                    onClick={()=>sendMessage(s.label)}
                    className="text-[10px] sm:text-xs font-medium bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-full hover:border-emerald-500 hover:text-emerald-400 transition-all shadow-sm"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); sendMessage(); } }}
                placeholder="Ask your coach for a workout plan or diet advice..."
                className="flex-1 bg-[#0f0f11] border border-zinc-800 rounded-2xl pl-5 pr-14 py-4 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner text-sm"
              />
              <button
                onClick={()=>sendMessage()}
                disabled={!input.trim()||loading||streaming}
                className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-4 rounded-xl transition-all shadow-md flex items-center justify-center"
              >
                <Send size={18}/>
              </button>
            </div>

            <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.2em] font-bold">
               Personalized Fitness Intel • Safe AI Guide
            </p>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      ` }} />
    </div>
  );
}