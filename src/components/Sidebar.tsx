import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Tag, 
  Coffee, 
  Cpu, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Task, Track } from '../types';

interface SidebarProps {
  tracks: Track[];
  tasks: Task[];
  activeTaskId: string;
  onSelectTask: (taskId: string) => void;
  selectedTrackFilter: string;
  onSelectTrackFilter: (trackId: string) => void;
  completedTaskIds: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  tracks,
  tasks,
  activeTaskId,
  onSelectTask,
  selectedTrackFilter,
  onSelectTrackFilter,
  completedTaskIds
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Filter tasks based on selected track, search, and status
  const filteredTasks = tasks.filter(task => {
    const matchesTrack = selectedTrackFilter === 'all' || task.trackId === selectedTrackFilter;
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const isCompleted = completedTaskIds.includes(task.id);
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'completed' ? isCompleted :
      !isCompleted;

    return matchesTrack && matchesSearch && matchesStatus;
  });

  const getTrackIcon = (trackId: string) => {
    switch (trackId) {
      case 'dialogflow-cx':
        return <Coffee className="w-3.5 h-3.5 text-sky-400" />;
      case 'agent-studio':
        return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case 'enterprise-suite':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900/70 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col h-auto lg:h-[calc(100vh-61px)] overflow-hidden">
      {/* Track Filter Tabs */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Curriculum Tracks</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {completedTaskIds.length} / {tasks.length} Done
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            id="track-filter-all"
            onClick={() => onSelectTrackFilter('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
              selectedTrackFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>All Tasks</span>
            <span className="text-[10px] opacity-75">{tasks.length}</span>
          </button>

          {tracks.map(track => {
            const count = tasks.filter(t => t.trackId === track.id).length;
            const isSelected = selectedTrackFilter === track.id;
            return (
              <button
                key={track.id}
                id={`track-filter-${track.id}`}
                onClick={() => onSelectTrackFilter(track.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-slate-700 text-white ring-1 ring-slate-500'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {getTrackIcon(track.id)}
                  <span className="truncate">
                    {track.id === 'dialogflow-cx' ? 'CloudCafe CX' : track.id === 'agent-studio' ? 'TechMart GenAI' : 'Enterprise'}
                  </span>
                </div>
                <span className="text-[10px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tasks, tools, entities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-700/80">
            <button
              onClick={() => setStatusFilter('all')}
              title="Show all"
              className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              title="Show incomplete"
              className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                statusFilter === 'pending' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              title="Show completed"
              className={`px-2 py-1 rounded text-[10px] font-medium transition ${
                statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-500 text-xs">
            No tasks match your search or filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            const isActive = task.id === activeTaskId;

            return (
              <button
                key={task.id}
                id={`task-item-${task.id}`}
                onClick={() => onSelectTask(task.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-2.5 group relative border ${
                  isActive
                    ? 'bg-slate-800/90 border-indigo-500/80 shadow-md shadow-indigo-950/40 text-white'
                    : isCompleted
                    ? 'bg-slate-900/40 border-emerald-900/40 hover:bg-slate-800/50 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                {/* Completion Indicator */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950/60" />
                  ) : (
                    <Circle className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  )}
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      task.trackId === 'dialogflow-cx'
                        ? 'bg-sky-950 text-sky-400 border border-sky-800/50'
                        : task.trackId === 'agent-studio'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800/50'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                    }`}>
                      Task {task.taskNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {task.durationMinutes}m
                    </span>
                  </div>

                  <h3 className={`text-xs font-semibold leading-snug line-clamp-1 ${
                    isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-200'
                  }`}>
                    {task.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {task.subtitle}
                  </p>
                </div>

                {isActive && (
                  <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 self-center" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Estimated Lab Time:</span>
        <span className="font-semibold text-slate-200">Max 4.0 Hours</span>
      </div>
    </aside>
  );
};
