import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RotateCcw,
  Sliders,
  ExternalLink,
  Award,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Task, Track } from '../types';

interface ProgressAnalyticsProps {
  tasks: Task[];
  tracks: Track[];
  completedTaskIds: string[];
  completedStepIds: string[];
  timeSpentPerTask: Record<string, number>;
  onUpdateTimeSpent: (taskId: string, minutes: number) => void;
  onResetTimes: () => void;
  onApplyPresetTimes: (preset: 'optimal' | 'deep' | 'fast') => void;
  onNavigateToTask: (taskId: string) => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  tasks,
  tracks,
  completedTaskIds,
  completedStepIds,
  timeSpentPerTask,
  onUpdateTimeSpent,
  onResetTimes,
  onApplyPresetTimes,
  onNavigateToTask
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState<number>(0);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);

  // Filter tasks based on selected track
  const filteredTasks = useMemo(() => {
    if (selectedTrackId === 'all') return tasks;
    return tasks.filter(t => t.trackId === selectedTrackId);
  }, [tasks, selectedTrackId]);

  // Overall Statistics Calculation
  const totalTasks = tasks.length;
  const completedTasksCount = completedTaskIds.length;
  const completionPercentage = Math.round((completedTasksCount / (totalTasks || 1)) * 100);

  const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalActualMinutes = tasks.reduce((sum, t) => sum + (timeSpentPerTask[t.id] || 0), 0);

  // Calculate efficiency index on completed tasks:
  // (Sum of Estimated Time for completed tasks / Sum of Actual Time for completed tasks) * 100
  const completedTasksList = tasks.filter(t => completedTaskIds.includes(t.id));
  const completedEstimatedTime = completedTasksList.reduce((sum, t) => sum + t.durationMinutes, 0);
  const completedActualTime = completedTasksList.reduce((sum, t) => sum + (timeSpentPerTask[t.id] || 0), 0);

  const efficiencyIndex = completedActualTime > 0
    ? Math.round((completedEstimatedTime / completedActualTime) * 100)
    : completedTasksCount > 0 ? 100 : 0;

  // Velocity: average minutes per completed step
  const totalCompletedSteps = completedStepIds.length;
  const minutesPerStep = totalCompletedSteps > 0 && totalActualMinutes > 0
    ? (totalActualMinutes / totalCompletedSteps).toFixed(1)
    : '0.0';

  // Track breakdown data for PieChart & Progress
  const trackBreakdownData = useMemo(() => {
    return tracks.map(tr => {
      const trackTasks = tasks.filter(t => t.trackId === tr.id);
      const trackDone = trackTasks.filter(t => completedTaskIds.includes(t.id)).length;
      const trackEstTime = trackTasks.reduce((s, t) => s + t.durationMinutes, 0);
      const trackActTime = trackTasks.reduce((s, t) => s + (timeSpentPerTask[t.id] || 0), 0);
      const pct = Math.round((trackDone / (trackTasks.length || 1)) * 100);

      return {
        id: tr.id,
        name: tr.title.replace(' Capstone', ''),
        total: trackTasks.length,
        completed: trackDone,
        percentage: pct,
        estimatedTime: trackEstTime,
        actualTime: trackActTime,
        color: tr.id === 'dialogflow-cx' ? '#0284c7' : tr.id === 'agent-studio' ? '#8b5cf6' : '#10b981'
      };
    });
  }, [tracks, tasks, completedTaskIds, timeSpentPerTask]);

  // Task comparison data for BarChart
  const taskComparisonData = useMemo(() => {
    return filteredTasks.map(t => {
      const actual = timeSpentPerTask[t.id] || 0;
      const estimated = t.durationMinutes;
      const isDone = completedTaskIds.includes(t.id);
      const ratio = actual > 0 ? Math.round((estimated / actual) * 100) : 0;

      return {
        id: t.id,
        shortName: `T${t.taskNumber}: ${t.title.length > 18 ? t.title.slice(0, 16) + '…' : t.title}`,
        fullName: t.title,
        trackId: t.trackId,
        actualMinutes: actual,
        estimatedMinutes: estimated,
        isCompleted: isDone,
        efficiencyRatio: ratio,
        stepsDone: t.steps.filter(s => completedStepIds.includes(s.id)).length,
        totalSteps: t.steps.length
      };
    });
  }, [filteredTasks, timeSpentPerTask, completedTaskIds, completedStepIds]);

  // Cumulative learning curve data
  const cumulativeCurveData = useMemo(() => {
    let cumEst = 0;
    let cumAct = 0;
    return tasks.map((t, idx) => {
      cumEst += t.durationMinutes;
      cumAct += (timeSpentPerTask[t.id] || 0);
      return {
        index: idx + 1,
        name: `T${t.taskNumber}`,
        title: t.title,
        cumulativeEstimate: cumEst,
        cumulativeActual: cumAct,
        isCompleted: completedTaskIds.includes(t.id)
      };
    });
  }, [tasks, timeSpentPerTask, completedTaskIds]);

  const handleStartEditTime = (task: Task) => {
    setEditingTaskId(task.id);
    setEditMinutes(timeSpentPerTask[task.id] || task.durationMinutes);
  };

  const handleSaveEditTime = (taskId: string) => {
    onUpdateTimeSpent(taskId, Math.max(0, editMinutes));
    setEditingTaskId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8 space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Progress Analytics & Efficiency Hub</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visualization of completion milestones, time allocation vs. curriculum targets, and learning pace metrics.
          </p>
        </div>

        {/* Quick controls: Filters & Preset Simulation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Track Filter selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setSelectedTrackId('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedTrackId === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tracks
            </button>
            {tracks.map(tr => (
              <button
                key={tr.id}
                onClick={() => setSelectedTrackId(tr.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  selectedTrackId === tr.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tr.id === 'dialogflow-cx' ? 'Dialogflow CX' : tr.id === 'agent-studio' ? 'Agent Studio' : 'Enterprise'}
              </button>
            ))}
          </div>

          {/* Preset study pace generator */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition"
              title="Simulate or set benchmark pacing"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulate Pace</span>
            </button>

            {showPresetsMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Fill Study Time Benchmarks
                </div>
                <button
                  onClick={() => {
                    onApplyPresetTimes('optimal');
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Optimal Pace (100% Target)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1.0x</span>
                </button>
                <button
                  onClick={() => {
                    onApplyPresetTimes('fast');
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Fast Track Sprint</span>
                  <span className="text-[10px] text-sky-400 font-mono">1.25x</span>
                </button>
                <button
                  onClick={() => {
                    onApplyPresetTimes('deep');
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Deep Dive Exploration</span>
                  <span className="text-[10px] text-purple-400 font-mono">0.85x</span>
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    onResetTimes();
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Recorded Times</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bento Grid: 4 Key Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Completion Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{completionPercentage}%</span>
              <span className="text-xs text-slate-400">({completedTasksCount} of {totalTasks} tasks)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
              <span>{completedStepIds.length} Steps Validated</span>
              <span>{totalTasks - completedTasksCount} Remaining</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Total Time Logged vs Estimated */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Invested</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{totalActualMinutes}</span>
              <span className="text-xs text-slate-400">mins spent</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
              <span>Target: <span className="font-mono text-slate-300">{totalEstimatedMinutes}m</span></span>
              <span>•</span>
              <span>{Math.round((totalEstimatedMinutes / 60) * 10) / 10}h total curriculum</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((totalActualMinutes / (totalEstimatedMinutes || 1)) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tile 3: Learning Efficiency Index */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Efficiency Index</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">
                {efficiencyIndex > 0 ? `${efficiencyIndex}%` : '--'}
              </span>
              {efficiencyIndex >= 100 ? (
                <span className="inline-flex items-center text-xs text-emerald-400 font-semibold gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> High Pace
                </span>
              ) : efficiencyIndex > 0 ? (
                <span className="inline-flex items-center text-xs text-amber-400 font-semibold gap-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" /> Deep Study
                </span>
              ) : (
                <span className="text-xs text-slate-500">Awaiting tasks</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              {efficiencyIndex >= 110
                ? 'Rapid execution: Completing steps faster than expected target duration.'
                : efficiencyIndex >= 90
                ? 'Optimal pace: Perfectly calibrated with curriculum target time.'
                : efficiencyIndex > 0
                ? 'Thorough pace: Spending extra time testing simulator routes & edge cases.'
                : 'Mark tasks or log time to generate efficiency indexing.'}
            </p>
          </div>
        </div>

        {/* Tile 4: Step Velocity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning Velocity</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{minutesPerStep}</span>
              <span className="text-xs text-slate-400">min / step</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="text-slate-400">Active Pace:</span>
              <span className="font-semibold text-purple-400">
                {Number(minutesPerStep) > 0 && Number(minutesPerStep) <= 6
                  ? 'Agile Builder'
                  : Number(minutesPerStep) > 6
                  ? 'Deep Architect'
                  : 'Starting Lab'}
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Estimated remaining:</span>
              <span className="font-mono text-slate-300">
                {Math.max(0, totalEstimatedMinutes - totalActualMinutes)}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Main Grid: 2 Primary Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (2 cols): Time Spent vs. Target Estimate Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Task Time Allocation: Actual Spent vs. Curriculum Target</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Compare actual minutes recorded against estimated target time for each capstone module.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
                <span className="text-slate-300">Actual (min)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-700 inline-block" />
                <span className="text-slate-400">Target (min)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit="m"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 max-w-xs">
                          <div className="font-bold text-white flex items-center justify-between gap-2">
                            <span>{data.fullName}</span>
                            {data.isCompleted && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                Completed
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Track: <span className="text-slate-200 capitalize">{data.trackId.replace('-', ' ')}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                            <div>
                              <span className="text-slate-400 text-[10px]">Actual Time:</span>
                              <div className="font-mono text-indigo-400 font-semibold">{data.actualMinutes} mins</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px]">Target Estimate:</span>
                              <div className="font-mono text-slate-300 font-semibold">{data.estimatedMinutes} mins</div>
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex justify-between">
                            <span>Steps Validated:</span>
                            <span className="text-slate-200 font-mono">{data.stepsDone} / {data.totalSteps}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="actualMinutes"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Actual Minutes"
                >
                  {taskComparisonData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={entry.isCompleted ? '#6366f1' : '#475569'}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="estimatedMinutes"
                  fill="#334155"
                  radius={[4, 4, 0, 0]}
                  name="Target Duration"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <span>Tip: Colored bars indicate completed tasks; muted bars indicate pending modules.</span>
            <span>Scale: Minutes</span>
          </div>
        </div>

        {/* Secondary Tile (1 col): Track Completion Breakdown Pie / Donut */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Track Completion Status</h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                3 Tracks
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Task distribution and completion rates per curriculum stream.
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trackBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="completed"
                >
                  {trackBreakdownData.map((entry) => (
                    <Cell key={`slice-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white">{data.name}</div>
                          <div className="text-slate-300">
                            Completed: <span className="font-mono text-emerald-400">{data.completed}</span> of {data.total} tasks ({data.percentage}%)
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Time Spent: <span className="font-mono text-indigo-400">{data.actualTime}m</span> / {data.estimatedTime}m
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white font-mono">{completionPercentage}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">Overall</span>
            </div>
          </div>

          {/* Track Detail Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {trackBreakdownData.map(tr => (
              <div key={tr.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tr.color }} />
                  <span className="text-slate-300 truncate max-w-[130px]">{tr.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400 text-[11px]">{tr.completed}/{tr.total}</span>
                  <span className="text-slate-200 font-semibold">{tr.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Grid Second Row: Cumulative Learning Curve & Efficiency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cumulative Velocity Curve */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Cumulative Learning Curve: Target vs. Actual Timeline</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tracking cumulative minute accumulation across the 16 capstone modules.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-indigo-500 inline-block rounded" />
                <span className="text-slate-300">Actual Accumulated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-slate-600 inline-block rounded" />
                <span className="text-slate-400">Target Trajectory</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cumulativeCurveData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorEstimate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="m" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white">{d.title}</div>
                          <div className="text-indigo-400 font-mono">
                            Actual Cumulative: {d.cumulativeActual} mins
                          </div>
                          <div className="text-slate-400 font-mono">
                            Target Cumulative: {d.cumulativeEstimate} mins
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeEstimate"
                  stroke="#475569"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEstimate)"
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeActual"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Insights Tile */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Efficiency Insights</span>
              </h3>
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                Lab Analytics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Personalized pacing feedback based on your active module metrics.
            </p>
          </div>

          <div className="space-y-3 my-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-400" />
                  <span>Curriculum Calibration</span>
                </span>
                <span className="text-[11px] font-mono text-sky-400">
                  {totalActualMinutes > 0 ? `${Math.round((totalActualMinutes / totalEstimatedMinutes) * 100)}% expended` : '0% expended'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {totalActualMinutes < totalEstimatedMinutes * 0.5
                  ? 'Early phase: Build solid mental models around Dialogflow CX Pages and Parameters.'
                  : 'Advanced phase: Focus on CX Agent Studio OpenAPI schemas and Guardrails.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Velocity Rating</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {Number(minutesPerStep) > 0 ? `${minutesPerStep}m / step` : 'Not Started'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {Number(minutesPerStep) > 0 && Number(minutesPerStep) <= 6
                  ? 'High efficiency cadence: Maintaining rapid verification across step items.'
                  : 'Steady exploratory pacing: Taking time to read code artifacts and test edge cases.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>Capstone Readiness</span>
                </span>
                <span className="text-[11px] font-mono text-purple-400">{completedTasksCount}/16 Tasks</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {completedTasksCount >= 12
                  ? 'Enterprise Certified: You have mastered both State Machine & Generative ADK architectures.'
                  : 'Keep progressing through both Dialogflow CX and Agent Studio tracks to achieve full certification.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Updated with every verified step</span>
            <span className="text-slate-400 font-mono">16 Lab Modules</span>
          </div>
        </div>
      </div>

      {/* Task Time Adjustment & Efficiency Table (Bento Tile) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Task Efficiency Breakdown & Time Logger</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and adjust your actual study minutes per task. Click "Log Time" to update.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Showing <span className="text-slate-200 font-semibold">{filteredTasks.length}</span> tasks
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Task Title</th>
                <th className="py-2.5 px-3">Track</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Target (min)</th>
                <th className="py-2.5 px-3 text-center">Actual Spent</th>
                <th className="py-2.5 px-3 text-center">Efficiency</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.map(t => {
                const actual = timeSpentPerTask[t.id] || 0;
                const isDone = completedTaskIds.includes(t.id);
                const efficiency = actual > 0 ? Math.round((t.durationMinutes / actual) * 100) : 0;
                const isEditing = editingTaskId === t.id;

                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono text-slate-500 font-bold">
                      {t.taskNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{t.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        t.trackId === 'dialogflow-cx'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : t.trackId === 'agent-studio'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {t.trackId === 'dialogflow-cx' ? 'Dialogflow CX' : t.trackId === 'agent-studio' ? 'Agent Studio' : 'Enterprise'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">
                      {t.durationMinutes}m
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="600"
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(Number(e.target.value))}
                            className="w-16 px-1.5 py-0.5 bg-slate-950 border border-indigo-500 rounded text-center text-xs font-mono text-white focus:outline-none"
                            autoFocus
                          />
                          <span className="text-[10px] text-slate-400">m</span>
                          <button
                            onClick={() => handleSaveEditTime(t.id)}
                            className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditTime(t)}
                          className="font-mono text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
                          title="Click to edit logged time"
                        >
                          {actual > 0 ? `${actual}m` : '0m (Log)'}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {efficiency > 0 ? (
                        <span className={`text-[11px] font-semibold ${
                          efficiency >= 100 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {efficiency}%
                        </span>
                      ) : (
                        <span className="text-slate-600">--</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigateToTask(t.id)}
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                      >
                        <span>Open Task</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
