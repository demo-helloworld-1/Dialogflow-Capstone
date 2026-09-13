import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  Lightbulb, 
  Terminal, 
  FileText, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Edit3, 
  Save, 
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Share2,
  BarChart3
} from 'lucide-react';
import { Task, Track } from '../types';

interface TaskDetailProps {
  task: Task;
  track?: Track;
  isCompleted: boolean;
  completedStepIds: string[];
  onToggleStep: (stepId: string) => void;
  onToggleTaskCompleted: (taskId: string) => void;
  onGoToPrevious: () => void;
  onGoToNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onOpenSimulator: (initialTrack?: 'dialogflow-cx' | 'agent-studio') => void;
  onOpenDataHubWithFile?: (filename: string) => void;
  notes: string;
  onSaveNotes: (taskId: string, note: string) => void;
  timeSpentMinutes?: number;
  onOpenAnalytics?: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  track,
  isCompleted,
  completedStepIds,
  onToggleStep,
  onToggleTaskCompleted,
  onGoToPrevious,
  onGoToNext,
  hasPrevious,
  hasNext,
  onOpenSimulator,
  onOpenDataHubWithFile,
  notes,
  onSaveNotes,
  timeSpentMinutes = 0,
  onOpenAnalytics
}) => {
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [showVerificationAnswer, setShowVerificationAnswer] = useState(false);
  const [localNote, setLocalNote] = useState(notes || '');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    setLocalNote(notes || '');
    setShowVerificationAnswer(false);
  }, [task.id, notes]);

  const handleCopy = (code: string, snippetId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(snippetId);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCompleteTask = () => {
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }
    onToggleTaskCompleted(task.id);
  };

  const handleSaveNote = () => {
    onSaveNotes(task.id, localNote);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Breadcrumb & Task Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none ${
          task.trackId === 'dialogflow-cx' ? 'bg-sky-500' : task.trackId === 'agent-studio' ? 'bg-purple-500' : 'bg-emerald-500'
        }`} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                task.trackId === 'dialogflow-cx'
                  ? 'bg-sky-950 text-sky-400 border border-sky-800/50'
                  : task.trackId === 'agent-studio'
                  ? 'bg-purple-950 text-purple-400 border border-purple-800/50'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
              }`}>
                {track?.title || 'Capstone Track'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Task {task.taskNumber} of 6
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {task.durationMinutes}m target
              </span>
              {timeSpentMinutes > 0 && (
                <button
                  onClick={onOpenAnalytics}
                  className="text-xs font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition flex items-center gap-1"
                  title="View task in Progress Analytics"
                >
                  <BarChart3 className="w-3 h-3 text-indigo-400" />
                  <span>{timeSpentMinutes}m logged</span>
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              {task.title}
            </h1>
            <p className="text-sm text-slate-400">
              {task.subtitle}
            </p>
          </div>

          {/* Mark Complete Action Button */}
          <div className="flex items-center gap-2">
            <button
              id={`btn-complete-task-${task.id}`}
              onClick={handleCompleteTask}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Completed ✓' : 'Mark Task Complete'}</span>
            </button>
          </div>
        </div>

        {/* Goal & Key Concepts */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Task Objective / Goal
            </span>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {task.goal}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Concepts & Artifacts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {task.keyConcepts.map((concept, idx) => (
                <span 
                  key={idx}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/80"
                >
                  {concept}
                </span>
              ))}
            </div>
            {task.sampleDataFile && (
              <div className="pt-1">
                <button
                  onClick={() => onOpenDataHubWithFile && onOpenDataHubWithFile(task.sampleDataFile!)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 underline underline-offset-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View sample file: {task.sampleDataFile}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step-by-Step Walkthrough Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Step-by-Step Implementation Instructions</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
              {task.steps.filter(s => completedStepIds.includes(s.id)).length} of {task.steps.length} Steps Done
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {task.steps.map((step, stepIndex) => {
            const isStepDone = completedStepIds.includes(step.id);

            return (
              <div
                key={step.id}
                id={`step-card-${step.id}`}
                className={`border rounded-xl transition p-4 sm:p-5 ${
                  isStepDone
                    ? 'bg-slate-900/60 border-emerald-800/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Step Header with Checkbox */}
                <div className="flex items-start gap-3 justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      id={`checkbox-step-${step.id}`}
                      onClick={() => onToggleStep(step.id)}
                      className="mt-0.5 shrink-0 rounded-lg p-1 hover:bg-slate-800 text-slate-400 transition"
                      title={isStepDone ? 'Mark step incomplete' : 'Mark step done'}
                    >
                      {isStepDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                          Step {task.taskNumber}.{stepIndex + 1}
                        </span>
                        <h3 className={`text-sm font-semibold ${isStepDone ? 'text-emerald-300 line-through opacity-80' : 'text-white'}`}>
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleStep(step.id)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition ${
                      isStepDone
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isStepDone ? 'Done' : 'Mark Done'}
                  </button>
                </div>

                {/* Instructions List */}
                <div className="pl-8 pt-3 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>
                        {inst}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Optional Code / Data Snippet */}
                {step.codeSnippet && (
                  <div className="pl-8 pt-4">
                    <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner">
                      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-bold text-indigo-400">
                            {step.codeSnippet.language}
                          </span>
                          <span className="text-slate-300 font-medium">
                            {step.codeSnippet.filename || 'Code Snippet'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            id={`btn-copy-${step.id}`}
                            onClick={() => handleCopy(step.codeSnippet!.code, step.id)}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 font-medium transition"
                          >
                            {copiedSnippetId === step.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {step.codeSnippet.filename && (
                            <button
                              onClick={() => handleDownload(step.codeSnippet!.filename!, step.codeSnippet!.code)}
                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition"
                              title="Download File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-72">
                        <code>{step.codeSnippet.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Optional Pro Tip */}
                {step.tip && (
                  <div className="pl-8 pt-3">
                    <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Pro Tip:</strong> {step.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification / Knowledge Check Challenge */}
      {task.verificationChallenge && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">
                Task Verification & Checkpoint
              </h3>
            </div>
            <button
              onClick={() => setShowVerificationAnswer(!showVerificationAnswer)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {showVerificationAnswer ? 'Hide Solution' : 'Check Solution'}
              {showVerificationAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {task.verificationChallenge.prompt}
          </p>

          {showVerificationAnswer && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs sm:text-sm space-y-2 animate-in fade-in duration-200">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expected Outcome:</span>
              </div>
              <p className="text-slate-200 font-mono text-xs bg-slate-950 p-2 rounded border border-slate-800">
                {task.verificationChallenge.expectedAction}
              </p>
              <p className="text-slate-400 text-xs">
                {task.verificationChallenge.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Personal Scratchpad / Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white">
              Task Notes & Project Scratchpad
            </h3>
          </div>
          <button
            onClick={handleSaveNote}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isNoteSaved ? 'Saved! ✓' : 'Save Note'}</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          placeholder="Jot down your custom GCP project IDs, Cloud Function URLs, entity references, or observations..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
        />
      </div>

      {/* Bottom Task Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
        <button
          onClick={onGoToPrevious}
          disabled={!hasPrevious}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            hasPrevious
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Task</span>
        </button>

        <button
          onClick={() => onOpenSimulator(task.trackId === 'dialogflow-cx' ? 'dialogflow-cx' : 'agent-studio')}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 transition shadow-sm"
        >
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Test in Live Simulator</span>
        </button>

        <button
          onClick={onGoToNext}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            hasNext
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              : 'opacity-40 cursor-not-allowed bg-slate-900 text-slate-600'
          }`}
        >
          <span>Next Task</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
