import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudyTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyTimerModal: React.FC<StudyTimerModalProps> = ({ isOpen, onClose }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4 * 3600); // Default 4 hours max capstone
  const [isActive, setIsActive] = useState<boolean>(false);
  const [initialDuration, setInitialDuration] = useState<number>(4 * 3600);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const setPreset = (hours: number, minutes: number = 0) => {
    const sec = hours * 3600 + minutes * 60;
    setInitialDuration(sec);
    setSecondsRemaining(sec);
    setIsActive(false);
  };

  const percentLeft = Math.round((secondsRemaining / initialDuration) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Lab Study Timer</h2>
            <p className="text-xs text-slate-400">Track your 4-hour max capstone target</p>
          </div>
        </div>

        {/* Digital Clock Display */}
        <div className="py-6 px-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
          <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest">
            {formatTime(secondsRemaining)}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {secondsRemaining === 0 ? '🎉 Time limit reached! Great work!' : 'Remaining in Lab Session'}
          </p>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-3">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500"
              style={{ width: `${percentLeft}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/30'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Start Timer'}</span>
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              setSecondsRemaining(initialDuration);
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Quick Duration Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPreset(4, 0)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                initialDuration === 4 * 3600
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              4.0 Hours (Full)
            </button>
            <button
              onClick={() => setPreset(1, 0)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                initialDuration === 3600
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              60 Mins (Task)
            </button>
            <button
              onClick={() => setPreset(0, 30)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                initialDuration === 1800
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              30 Mins (Sprint)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
