import React from 'react';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  FolderDown, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  Layers,
  FlaskConical,
  BarChart3
} from 'lucide-react';
import { Track } from '../types';

interface HeaderProps {
  tracks: Track[];
  activeTrackId: string;
  onSelectTrack: (trackId: 'dialogflow-cx' | 'agent-studio' | 'enterprise-suite' | 'all') => void;
  completedTasksCount: number;
  totalTasksCount: number;
  onOpenSimulator: () => void;
  onOpenDataHub: () => void;
  onOpenGoldenRunner: () => void;
  onOpenArchitecture: () => void;
  onOpenTimer: () => void;
  onResetProgress: () => void;
  activeView: 'tasks' | 'simulator' | 'datahub' | 'golden' | 'architecture' | 'analytics';
  setActiveView: (view: 'tasks' | 'simulator' | 'datahub' | 'golden' | 'architecture' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  completedTasksCount,
  totalTasksCount,
  onOpenSimulator,
  onOpenDataHub,
  onOpenGoldenRunner,
  onOpenArchitecture,
  onOpenTimer,
  onResetProgress,
  activeView,
  setActiveView
}) => {
  const percentComplete = Math.round((completedTasksCount / (totalTasksCount || 1)) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                  Cloud Agent <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Learning Lab</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Capstone
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dialogflow CX & CX Agent Studio Step-by-Step Training Platform
              </p>
            </div>
          </div>

          {/* Quick Progress Bar Mobile */}
          <div className="flex md:hidden items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">{completedTasksCount}/{totalTasksCount}</span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Nav Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto w-full md:w-auto justify-start md:justify-center">
          <button
            id="nav-tab-tasks"
            onClick={() => setActiveView('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'tasks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tasks & Guide</span>
          </button>

          <button
            id="nav-tab-simulator"
            onClick={() => setActiveView('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'simulator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Live Simulator</span>
          </button>

          <button
            id="nav-tab-golden"
            onClick={() => setActiveView('golden')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'golden'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
            <span>Golden Tests</span>
          </button>

          <button
            id="nav-tab-architecture"
            onClick={() => setActiveView('architecture')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'architecture'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Architecture Map</span>
          </button>

          <button
            id="nav-tab-datahub"
            onClick={() => setActiveView('datahub')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'datahub'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Data (6)</span>
          </button>

          <button
            id="nav-tab-analytics"
            onClick={() => setActiveView('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Progress Analytics</span>
          </button>
        </div>

        {/* Right Tools: Progress & Timer */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Progress Indicator - Clickable to Analytics */}
          <button
            onClick={() => setActiveView('analytics')}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 text-xs transition cursor-pointer text-left group"
            title="View Progress Analytics"
          >
            <div className="flex flex-col text-right">
              <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                {completedTasksCount} / {totalTasksCount} Completed
              </span>
              <span className="text-[10px] text-slate-400">{percentComplete}% of Capstone • Analytics</span>
            </div>
            <div className="w-20 h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </button>

          {/* Study Timer Button */}
          <button
            id="btn-study-timer"
            onClick={onOpenTimer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
            title="Lab Focus Timer"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Timer</span>
          </button>

          {/* Reset progress */}
          <button
            id="btn-reset-progress"
            onClick={onResetProgress}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/50 transition"
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
