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
  Target,
  Copy,
  RefreshCw
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import { clearAllData, exportData, importData, loadProfile, loadProgress, loadSavedPlans, loadSessions, saveProfile, saveProgress, saveSavedPlans, saveSessions } from "./lib/storage";
import type { ChatSession, Message, ProgressEntry, SavedPlan, UserProfile } from "./lib/types";
import { createSupabaseBrowserClient } from "./lib/supabase/client";

/* ---------------- TYPES & INTERFACES ---------------- */

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
    onOpenProfile,
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
  onClose,
  onOpenAuth,
  onOpenDashboard,
}: { 
  profile: UserProfile | null, 
  onSave: (p: UserProfile) => void, 
  onClose: () => void,
  onOpenAuth: () => void,
  onOpenDashboard: () => void,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile || {
    age: '', height: '', weight: '', gender: 'male', goal: 'fat loss', activity: 'moderate',
    units: 'metric', experience: 'beginner', equipment: 'bodyweight and basic gym equipment',
    schedule: '3 days per week', dietaryPreferences: 'none', injuries: 'none'
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
      <div className="mx-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 bg-zinc-900/30 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="p-2 bg-emerald-900/30 rounded-xl">
              <Target size={20} className="text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-white">Fitness Profile</h2>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Personalize Your AI Coach</p>
            </div>
          </div>
          {profile && <div className="flex shrink-0 items-center gap-2">
            <button onClick={onOpenDashboard} className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-600/15 px-4 py-2.5 text-xs font-bold text-emerald-300 transition-colors hover:border-emerald-400 hover:bg-emerald-600 hover:text-white" title="Progress and Saved Plans">
              <Activity size={17} />
              <span className="hidden sm:inline">Progress & Plans</span>
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white" aria-label="Close profile">
              <X size={20} />
            </button>
          </div>}
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

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Units</label>
              <select name="units" value={formData.units} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                <option value="metric">Metric (kg / cm)</option>
                <option value="imperial">Imperial (lb / ft)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Experience</label>
              <select name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Available Equipment</label>
            <input name="equipment" placeholder="e.g. dumbbells, resistance bands, gym" value={formData.equipment} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Weekly Schedule</label>
            <input name="schedule" placeholder="e.g. 4 days, 45 minutes each" value={formData.schedule} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Diet Preferences</label>
              <input name="dietaryPreferences" placeholder="e.g. vegetarian, halal" value={formData.dietaryPreferences} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Injuries or Limits</label>
              <input name="injuries" placeholder="e.g. none, knee pain" value={formData.injuries} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-colors" />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl mt-6 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
            Save Profile & Start
          </button>
          <button type="button" onClick={onOpenAuth} className="w-full rounded-xl border border-zinc-800 py-3 text-sm font-bold text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400">
            Sign in or create an account
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardModal = ({
  plans,
  progress,
  onAddProgress,
  onDeletePlan,
  onExport,
  onImport,
  onDeleteData,
  onClose,
}: {
  plans: SavedPlan[];
  progress: ProgressEntry[];
  onAddProgress: (entry: ProgressEntry) => void;
  onDeletePlan: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onDeleteData: () => void;
  onClose: () => void;
}) => {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [entry, setEntry] = useState<ProgressEntry>({
    id: "",
    date: new Date().toISOString().slice(0, 10),
    weight: "",
    workouts: "0",
    water: "",
    sleep: "",
    note: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEntry({ ...entry, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAddProgress({ ...entry, id: Date.now().toString() });
    setEntry({ ...entry, id: "", note: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-[#0c0c0e] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-[#0c0c0e] p-6">
          <div>
            <h2 className="text-lg font-bold text-white">Progress & Saved Plans</h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Private browser-only tracking</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 transition-colors hover:text-white" aria-label="Close dashboard">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <section>
            <h3 className="mb-3 text-sm font-bold text-emerald-400">Log today’s progress</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required name="date" type="date" value={entry.date} onChange={handleChange} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
              <div className="grid grid-cols-2 gap-3">
                <input name="weight" placeholder="Weight" value={entry.weight} onChange={handleChange} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
                <input name="workouts" type="number" min="0" max="20" placeholder="Workouts" value={entry.workouts} onChange={handleChange} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
                <input name="water" placeholder="Water (glasses)" value={entry.water} onChange={handleChange} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
                <input name="sleep" placeholder="Sleep (hours)" value={entry.sleep} onChange={handleChange} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              <textarea name="note" placeholder="How did it feel?" value={entry.note} onChange={handleChange} rows={3} className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" />
              <button type="submit" className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700">Save Progress</button>
            </form>

            <div className="mt-5 space-y-2">
              {progress.slice(-5).reverse().map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-xs text-zinc-300">
                  <div className="flex justify-between font-bold text-zinc-200"><span>{item.date}</span><span>{item.workouts} workouts</span></div>
                  <p className="mt-1 text-zinc-500">{item.weight || "Weight not recorded"} · {item.water || "Water not recorded"} · {item.sleep || "Sleep not recorded"}</p>
                  {item.note && <p className="mt-2 text-zinc-400">{item.note}</p>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-emerald-400">Saved plans</h3>
            {plans.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-800 p-5 text-sm leading-6 text-zinc-500">Save a useful coach response to keep it here for later.</p>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <details key={plan.id} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                    <summary className="cursor-pointer list-none text-sm font-bold text-zinc-200">{plan.title}</summary>
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-600">{plan.createdAt.toLocaleDateString()}</p>
                    <div className="mt-3 whitespace-pre-wrap text-xs leading-5 text-zinc-400">{plan.content}</div>
                    <button onClick={() => onDeletePlan(plan.id)} className="mt-3 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300">Remove</button>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>
        <section className="border-t border-zinc-800 p-6">
          <h3 className="text-sm font-bold text-emerald-400">Privacy & data</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">Your profile, conversations, plans, and progress are stored only in this browser. Export a backup before clearing local data.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={onExport} className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400">Export data</button>
            <button onClick={() => importInputRef.current?.click()} className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400">Import data</button>
            <button onClick={onDeleteData} className="rounded-xl border border-red-900/60 px-3 py-2 text-xs font-bold text-red-400 transition-colors hover:border-red-500 hover:text-red-300">Delete local data</button>
            <input ref={importInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImport(file);
              event.target.value = "";
            }} />
          </div>
        </section>
      </div>
    </div>
  );
};

const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const result = mode === "sign-in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(mode === "sign-up"
        ? result.data.session ? "Account created and signed in." : "Account created, but email confirmation is still enabled in Supabase."
        : "Signed in successfully.");
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage("Signed out.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your account</h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Supabase Auth</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 transition-colors hover:text-white" aria-label="Close account">
            <X size={20} />
          </button>
        </div>

        {!supabase ? (
          <p className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 text-sm leading-6 text-amber-200">
            Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the local or Vercel environment to enable accounts.
          </p>
        ) : userEmail ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-300">Signed in as <strong className="text-emerald-400">{userEmail}</strong>.</p>
            <button onClick={signOut} className="w-full rounded-xl border border-zinc-700 py-3 text-sm font-bold text-zinc-200 transition-colors hover:border-red-500 hover:text-red-300">Sign out</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input required type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
            <input required minLength={6} type="password" placeholder="Password (6+ characters)" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
            {message && <p role="status" className="text-sm text-zinc-400">{message}</p>}
            <button disabled={busy} type="submit" className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50">{busy ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}</button>
            <button type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} className="w-full text-xs font-bold text-zinc-500 hover:text-emerald-400">
              {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </form>
        )}
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
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = useMemo(
    ()=>sessions.find((s)=>s.id===currentSessionId),
    [sessions,currentSessionId]
  );

  const messages = currentSession?.messages || [];
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

  /* ---------- INITIALIZATION ---------- */

  useEffect(()=>{
    const savedProfile = loadProfile();
    if (savedProfile) {
      setUserProfile(savedProfile);
    } else {
      setShowProfileModal(true); // Force onboarding if missing
    }

    const savedHistory = loadSessions();
    if(savedHistory.length){
      setSessions(savedHistory);
      setCurrentSessionId(savedHistory[0]?.id||null);
    }else{
      createSession();
    }
    setSavedPlans(loadSavedPlans());
    setProgress(loadProgress());
  },[]);

  /* ---------- EFFECTS ---------- */

  useEffect(()=>{
    if(sessions.length){
      saveSessions(sessions);
    }
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth", block:"end" });
  },[sessions]);

  useEffect(() => {
    saveSavedPlans(savedPlans);
    saveProgress(progress);
  }, [savedPlans, progress]);

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
    saveProfile(profile);
    setShowProfileModal(false);
  };

  const openProfile = () => {
    setShowAuthModal(false);
    setShowDashboard(false);
    setShowProfileModal(true);
  };

  const openDashboard = () => {
    setShowAuthModal(false);
    setShowProfileModal(false);
    setShowDashboard(true);
  };

  const openAuth = () => {
    setShowProfileModal(false);
    setShowDashboard(false);
    setShowAuthModal(true);
  };

  const openNewConsultation = () => {
    setShowProfileModal(false);
    setShowDashboard(false);
    setShowAuthModal(false);
    createSession();
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

  const sendMessage = async(text?:string, options?: { replaceFrom?: number })=>{
    const message=text||input;
    if(!message.trim()||loading||streaming||!currentSessionId) return;
    setError(null);

    const baseMessages = options?.replaceFrom === undefined
      ? messages
      : messages.slice(0, options.replaceFrom);

    const userMsg:Message={
      id:Date.now().toString(), role:"user", content:message, timestamp:new Date()
    };

    setSessions(prev=>
      prev.map(s=>{
        if(s.id!==currentSessionId) return s;
        return{
          ...s,
          title: baseMessages.length===1 ? message.slice(0,30).trim()+(message.length>30?"...":"") : s.title,
          messages:[...baseMessages,userMsg]
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
      const extendedProfileContext = userProfile
        ? "\n\n[ADDITIONAL PROFILE: Units=" + userProfile.units +
          ", Experience=" + userProfile.experience +
          ', Equipment="' + userProfile.equipment +
          '", Schedule="' + userProfile.schedule +
          '", Dietary preferences="' + userProfile.dietaryPreferences +
          '", Injuries or limitations="' + userProfile.injuries + '".]'
        : "";

      // Enforce strict format for UI Workout Cards
      const secretPrompt = `\n\n[SYSTEM DIRECTIVE: Respond with a highly structured, professional format. Absolutely NO markdown tables. When generating workout plans, you MUST format each day exactly like this:\n### Day 1 - [Title]\n- Exercise 1\n- Exercise 2\nDo not use bolding or other characters around the 'Day' title. Be direct and authoritative.]` + profileContext;

      const res = await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          message: message + secretPrompt + extendedProfileContext,
          history:baseMessages.slice(-10).map(m=>({ role:m.role, content:m.content }))
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "The AI coach could not process that request.");
      }
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

    }catch (requestError) {
      console.error("AI error", requestError);
      setLoading(false);
      setError(requestError instanceof Error ? requestError.message : "The AI coach is temporarily unavailable. Please try again.");
    }
  };

  const savePlan = (message: Message) => {
    setSavedPlans((previous) => [
      {
        id: Date.now().toString(),
        title: currentSession?.title || "Saved fitness plan",
        content: message.content,
        createdAt: new Date(),
      },
      ...previous,
    ]);
  };

  const deletePlan = (id: string) => {
    setSavedPlans((previous) => previous.filter((plan) => plan.id !== id));
  };

  const handleExportData = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ai-fitness-coach-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (file: File) => {
    const imported = importData(await file.text());
    if (!imported) {
      setError("That backup could not be imported. Use a JSON backup exported by AI Fitness Coach.");
      return;
    }
    window.location.reload();
  };

  const handleDeleteAllData = () => {
    if (window.confirm("Delete your profile, conversations, saved plans, and progress from this browser? This cannot be undone.")) {
      clearAllData();
      window.location.reload();
    }
  };

  const retryLastMessage = () => {
    if (!lastUserMessage || loading || streaming) return;
    const messageIndex = messages.findIndex((message) => message.id === lastUserMessage.id);
    if (messageIndex >= 0) {
      void sendMessage(lastUserMessage.content, { replaceFrom: messageIndex });
    }
  };

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessageId(message.id);
      window.setTimeout(() => setCopiedMessageId(null), 1600);
    } catch {
      setError("Copying is unavailable in this browser. Select the response text manually instead.");
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
              h1: (props) => <h1 className="text-xl font-extrabold text-white mt-5 mb-3 border-b border-zinc-800 pb-2" {...props} />,
              h2: (props) => <h2 className="text-lg font-bold text-emerald-400 mt-5 mb-3 first:mt-0" {...props} />,
              h3: (props) => <h3 className="text-base font-semibold text-emerald-300 mt-4 mb-2 first:mt-0" {...props} />,
              ul: (props) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-zinc-300 marker:text-emerald-500" {...props} />,
              ol: (props) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-zinc-300 marker:text-emerald-500 font-medium" {...props} />,
              li: (props) => <li className="pl-1 leading-relaxed" {...props} />,
              p: (props) => <p className="mb-3 last:mb-0 text-zinc-300 leading-relaxed" {...props} />,
              strong: (props) => <strong className="font-semibold text-emerald-400" {...props} />,
              blockquote: (props) => <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 my-3 italic text-zinc-400 bg-emerald-950/10 rounded-r-lg" {...props} />,
              code: ({ className, children, ...props }) =>
                className
                  ? <div className="overflow-x-auto my-3 border border-zinc-800 rounded-xl bg-[#141417] shadow-sm"><pre className="p-4 text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre">{children}</pre></div>
                  : <code className="bg-zinc-800/50 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
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
        <ProfileModal profile={userProfile} onSave={handleSaveProfile} onOpenAuth={openAuth} onOpenDashboard={openDashboard} onClose={() => {
          if (userProfile) setShowProfileModal(false); // Only allow close if profile exists
        }} />
      )}
      {showDashboard && (
        <DashboardModal
          plans={savedPlans}
          progress={progress}
          onAddProgress={(entry) => setProgress((previous) => [...previous, entry])}
          onDeletePlan={deletePlan}
          onExport={handleExportData}
          onImport={handleImportData}
          onDeleteData={handleDeleteAllData}
          onClose={() => setShowDashboard(false)}
        />
      )}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <Sidebar
        sessions={sessions}
        activeSessionId={currentSessionId}
        onNewChat={openNewConsultation}
        onSelectChat={setCurrentSessionId}
        onDeleteChat={deleteSession}
        isOpen={sidebarOpen}
        onClose={()=>setSidebarOpen(false)}
        onOpen={()=>setSidebarOpen(true)}
        onOpenProfile={openProfile}
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
          <div className="flex items-center gap-4">
            <button onClick={openAuth} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-colors hover:bg-emerald-700">Sign in</button>
            <Info size={18} className="text-zinc-600"/>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10">
            {error && (
              <div role="alert" aria-live="assertive" className="flex items-start justify-between gap-4 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                <div className="flex items-center gap-3">
                  <span>{error}</span>
                  {lastUserMessage && <button onClick={retryLastMessage} className="font-bold text-red-100 underline underline-offset-2 hover:text-white">Retry</button>}
                </div>
                <button onClick={() => setError(null)} className="text-red-300 hover:text-white" aria-label="Dismiss error">
                  <X size={16} />
                </button>
              </div>
            )}
            {messages.map((m, index)=>(
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
                  {m.role === "assistant" && m.content && (
                    <div className="mt-4 flex items-center gap-3 border-t border-zinc-800/70 pt-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      <button onClick={() => void copyMessage(m)} className="flex items-center gap-1.5 transition-colors hover:text-emerald-400" aria-label="Copy response">
                        <Copy size={13} />
                        {copiedMessageId === m.id ? "Copied" : "Copy"}
                      </button>
                      <button onClick={() => savePlan(m)} className="flex items-center gap-1.5 transition-colors hover:text-emerald-400" aria-label="Save plan">
                        <Target size={13} />
                        Save plan
                      </button>
                      {index === messages.length - 1 && lastUserMessage && (
                        <button onClick={retryLastMessage} disabled={loading || streaming} className="flex items-center gap-1.5 transition-colors hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Regenerate response">
                          <RefreshCw size={13} />
                          Regenerate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Realistic Typing Indicator (Only shows before streaming starts) */}
            {loading && !streaming && (
              <div className="flex items-center gap-4 text-zinc-400 text-sm animate-in fade-in duration-300" role="status" aria-live="polite">
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
