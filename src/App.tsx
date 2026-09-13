/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TaskDetail } from './components/TaskDetail';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { GoldenTestRunner } from './components/GoldenTestRunner';
import { DataHub } from './components/DataHub';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { StudyTimerModal } from './components/StudyTimerModal';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { TRACKS, TASKS } from './data/curriculumData';

const STORAGE_KEYS = {
  COMPLETED_TASKS: 'cloud_agent_completed_tasks_v1',
  COMPLETED_STEPS: 'cloud_agent_completed_steps_v1',
  TASK_NOTES: 'cloud_agent_task_notes_v1',
  ACTIVE_TASK: 'cloud_agent_active_task_v1',
  ACTIVE_TRACK: 'cloud_agent_active_track_v1',
  TIME_SPENT: 'cloud_agent_time_spent_v1'
};

export default function App() {
  // Persistence state
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedStepIds, setCompletedStepIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [taskNotes, setTaskNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASK_NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [timeSpentPerTask, setTimeSpentPerTask] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIME_SPENT);
      if (saved) return JSON.parse(saved);
      // Default initial state: populate realistic starter values so charts are immediately informative
      const initial: Record<string, number> = {};
      TASKS.forEach(t => {
        // Starter baseline: if completed, target; if first few tasks, partial time
        if (t.taskNumber === 1 && t.trackId === 'dialogflow-cx') {
          initial[t.id] = 20;
        } else if (t.taskNumber === 2 && t.trackId === 'dialogflow-cx') {
          initial[t.id] = 25;
        }
      });
      return initial;
    } catch {
      return {};
    }
  });

  const [activeTaskId, setActiveTaskId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK);
      return saved && TASKS.some(t => t.id === saved) ? saved : TASKS[0].id;
    } catch {
      return TASKS[0].id;
    }
  });

  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRACK);
      return saved || 'all';
    } catch {
      return 'all';
    }
  });

  const [activeView, setActiveView] = useState<'tasks' | 'simulator' | 'datahub' | 'golden' | 'architecture' | 'analytics'>('tasks');
  const [simulatorTrack, setSimulatorTrack] = useState<'dialogflow-cx' | 'agent-studio'>('dialogflow-cx');
  const [dataHubSelectedFile, setDataHubSelectedFile] = useState<string | undefined>(undefined);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(completedStepIds));
  }, [completedStepIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASK_NOTES, JSON.stringify(taskNotes));
  }, [taskNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_SPENT, JSON.stringify(timeSpentPerTask));
  }, [timeSpentPerTask]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK, activeTaskId);
  }, [activeTaskId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRACK, selectedTrackFilter);
  }, [selectedTrackFilter]);

  // Current active task & track
  const currentTask = TASKS.find(t => t.id === activeTaskId) || TASKS[0];
  const currentTrack = TRACKS.find(tr => tr.id === currentTask.trackId);

  // Filtered task navigation
  const currentTaskIndex = TASKS.findIndex(t => t.id === activeTaskId);
  const hasPrevious = currentTaskIndex > 0;
  const hasNext = currentTaskIndex < TASKS.length - 1;

  const handleGoToPrevious = () => {
    if (hasPrevious) {
      setActiveTaskId(TASKS[currentTaskIndex - 1].id);
    }
  };

  const handleGoToNext = () => {
    if (hasNext) {
      setActiveTaskId(TASKS[currentTaskIndex + 1].id);
    }
  };

  // Toggle step completion
  const handleToggleStep = (stepId: string) => {
    setCompletedStepIds(prev => {
      if (prev.includes(stepId)) {
        return prev.filter(id => id !== stepId);
      } else {
        const next = [...prev, stepId];
        // If all steps of the task are completed, auto mark task as complete
        const taskSteps = currentTask.steps.map(s => s.id);
        const allStepsDone = taskSteps.every(id => next.includes(id));
        if (allStepsDone && !completedTaskIds.includes(currentTask.id)) {
          setCompletedTaskIds(tPrev => [...tPrev, currentTask.id]);
        }
        return next;
      }
    });
  };

  // Toggle task complete
  const handleToggleTaskCompleted = (taskId: string) => {
    const targetTask = TASKS.find(t => t.id === taskId);
    if (!targetTask) return;

    const isCurrentlyDone = completedTaskIds.includes(taskId);

    if (isCurrentlyDone) {
      // Mark as incomplete
      setCompletedTaskIds(prev => prev.filter(id => id !== taskId));
    } else {
      // Mark as complete and complete all its steps
      setCompletedTaskIds(prev => [...prev, taskId]);
      setCompletedStepIds(prev => {
        const newSteps = targetTask.steps.map(s => s.id).filter(id => !prev.includes(id));
        return [...prev, ...newSteps];
      });
      // If time spent is not yet logged, populate with estimated time
      setTimeSpentPerTask(prev => {
        if (!prev[taskId] || prev[taskId] === 0) {
          return { ...prev, [taskId]: targetTask.durationMinutes };
        }
        return prev;
      });
    }
  };

  // Time tracking updates
  const handleUpdateTimeSpent = (taskId: string, minutes: number) => {
    setTimeSpentPerTask(prev => ({
      ...prev,
      [taskId]: minutes
    }));
  };

  const handleResetTimes = () => {
    setTimeSpentPerTask({});
  };

  const handleApplyPresetTimes = (preset: 'optimal' | 'deep' | 'fast') => {
    const multiplier = preset === 'optimal' ? 1.0 : preset === 'fast' ? 0.8 : 1.25;
    const newTimes: Record<string, number> = {};
    TASKS.forEach((t, idx) => {
      // Create slight realistic variance
      const variance = (idx % 3 - 1) * 2;
      const calc = Math.max(5, Math.round(t.durationMinutes * multiplier) + variance);
      newTimes[t.id] = calc;
    });
    setTimeSpentPerTask(newTimes);
  };

  // Save notes
  const handleSaveNotes = (taskId: string, note: string) => {
    setTaskNotes(prev => ({
      ...prev,
      [taskId]: note
    }));
  };

  // Open simulator helper
  const handleOpenSimulator = (mode?: 'dialogflow-cx' | 'agent-studio') => {
    if (mode) {
      setSimulatorTrack(mode);
    }
    setActiveView('simulator');
  };

  // Open Data Hub with specific file
  const handleOpenDataHubWithFile = (filename: string) => {
    setDataHubSelectedFile(filename);
    setActiveView('datahub');
  };

  // Reset all progress
  const handleConfirmReset = () => {
    setCompletedTaskIds([]);
    setCompletedStepIds([]);
    setTaskNotes({});
    setTimeSpentPerTask({});
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        tracks={TRACKS}
        activeTrackId={selectedTrackFilter}
        onSelectTrack={setSelectedTrackFilter}
        completedTasksCount={completedTaskIds.length}
        totalTasksCount={TASKS.length}
        onOpenSimulator={() => handleOpenSimulator()}
        onOpenDataHub={() => setActiveView('datahub')}
        onOpenGoldenRunner={() => setActiveView('golden')}
        onOpenArchitecture={() => setActiveView('architecture')}
        onOpenTimer={() => setIsTimerOpen(true)}
        onResetProgress={() => setShowResetConfirm(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* If Tasks view, show sidebar + task detail */}
        {activeView === 'tasks' && (
          <>
            <Sidebar
              tracks={TRACKS}
              tasks={TASKS}
              activeTaskId={activeTaskId}
              onSelectTask={setActiveTaskId}
              selectedTrackFilter={selectedTrackFilter}
              onSelectTrackFilter={setSelectedTrackFilter}
              completedTaskIds={completedTaskIds}
            />

            <TaskDetail
              task={currentTask}
              track={currentTrack}
              isCompleted={completedTaskIds.includes(currentTask.id)}
              completedStepIds={completedStepIds}
              onToggleStep={handleToggleStep}
              onToggleTaskCompleted={handleToggleTaskCompleted}
              onGoToPrevious={handleGoToPrevious}
              onGoToNext={handleGoToNext}
              hasPrevious={hasPrevious}
              hasNext={hasNext}
              onOpenSimulator={handleOpenSimulator}
              onOpenDataHubWithFile={handleOpenDataHubWithFile}
              notes={taskNotes[currentTask.id] || ''}
              onSaveNotes={handleSaveNotes}
              timeSpentMinutes={timeSpentPerTask[currentTask.id] || 0}
              onOpenAnalytics={() => setActiveView('analytics')}
            />
          </>
        )}

        {/* Live Simulator View */}
        {activeView === 'simulator' && (
          <InteractiveSimulator initialMode={simulatorTrack} />
        )}

        {/* Golden Test Runner View */}
        {activeView === 'golden' && (
          <GoldenTestRunner />
        )}

        {/* Sample Data & Code Hub View */}
        {activeView === 'datahub' && (
          <DataHub
            initialSelectedFile={dataHubSelectedFile}
            onSelectTaskById={(taskId) => {
              setActiveTaskId(taskId);
              setActiveView('tasks');
            }}
          />
        )}

        {/* Architecture Diagram View */}
        {activeView === 'architecture' && (
          <ArchitectureGraph />
        )}

        {/* Progress Analytics View */}
        {activeView === 'analytics' && (
          <ProgressAnalytics
            tasks={TASKS}
            tracks={TRACKS}
            completedTaskIds={completedTaskIds}
            completedStepIds={completedStepIds}
            timeSpentPerTask={timeSpentPerTask}
            onUpdateTimeSpent={handleUpdateTimeSpent}
            onResetTimes={handleResetTimes}
            onApplyPresetTimes={handleApplyPresetTimes}
            onNavigateToTask={(taskId) => {
              setActiveTaskId(taskId);
              setActiveView('tasks');
            }}
          />
        )}
      </div>

      {/* Study Focus Timer Modal */}
      <StudyTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
      />

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reset Course Progress?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will clear all marked completed tasks, step checkboxes, and saved project notes. Are you sure you want to reset?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
