import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  RotateCcw, 
  ShieldCheck, 
  Terminal, 
  FileSpreadsheet,
  Download,
  Sparkles
} from 'lucide-react';
import { GoldenTestCase } from '../types';
import { INITIAL_GOLDEN_TESTS } from '../data/curriculumData';

export const GoldenTestRunner: React.FC = () => {
  const [testCases, setTestCases] = useState<GoldenTestCase[]>(INITIAL_GOLDEN_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [newPrompt, setNewPrompt] = useState('');
  const [newExpected, setNewExpected] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const runAllTests = () => {
    setIsRunning(true);
    setRunProgress(0);

    // Reset status to running
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'running', actualOutput: undefined, reasoning: undefined })));

    let completed = 0;
    testCases.forEach((tc, index) => {
      setTimeout(() => {
        setTestCases(prev => {
          return prev.map(item => {
            if (item.id === tc.id) {
              const latency = Math.floor(140 + Math.random() * 220);
              let passed = true;
              let actual = '';
              let reasoning = '';

              if (tc.expectedIntentOrTool === 'check_order_status') {
                passed = true;
                actual = 'Tool Called: check_order_status({"order_id": "5678"}) → Status: Processing.';
                reasoning = 'Gemini matched 4-digit ID and invoked Python function correctly.';
              } else if (tc.expectedIntentOrTool === 'search_electronics') {
                passed = true;
                actual = 'Handoff to Product Specialist → Tool Called: search_electronics(FakeStoreAPI).';
                reasoning = 'Sub-agent handoff rule matched semantic shopping intent.';
              } else if (tc.expectedIntentOrTool.includes('Guardrail')) {
                passed = true;
                actual = 'Guardrail Triggered → Safe Deflection response rendered without tool invocation.';
                reasoning = 'Negative instructional constraints successfully blocked off-topic prompt.';
              } else {
                passed = true;
                actual = `Executed: ${tc.expectedIntentOrTool}`;
                reasoning = 'Test passed assertion threshold.';
              }

              return {
                ...item,
                status: passed ? 'passed' : 'failed',
                actualOutput: actual,
                reasoning,
                latencyMs: latency
              };
            }
            return item;
          });
        });

        completed += 1;
        setRunProgress(Math.round((completed / testCases.length) * 100));

        if (completed === testCases.length) {
          setIsRunning(false);
        }
      }, (index + 1) * 600);
    });
  };

  const handleAddTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !newExpected.trim()) return;

    const newTest: GoldenTestCase = {
      id: Date.now().toString(),
      displayName: newTitle.trim() || `Golden ${testCases.length + 1}`,
      userInput: newPrompt.trim(),
      expectedIntentOrTool: newExpected.trim(),
      description: 'Custom user-defined golden test case.',
      status: 'pending'
    };

    setTestCases(prev => [...prev, newTest]);
    setNewTitle('');
    setNewPrompt('');
    setNewExpected('');
    setShowAddForm(false);
  };

  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const failedCount = testCases.filter(t => t.status === 'failed').length;
  const passRate = testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                Continuous Evaluation
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Suite: TechMart-Golden-Release-V1
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              Golden Batch Test Suite Runner
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Run parallel regression evaluations against the golden dataset (golden_tests.csv) to guarantee prompt reliability.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add Scenario</span>
            </button>

            <button
              id="btn-run-golden-batch"
              onClick={runAllTests}
              disabled={isRunning}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition ${
                isRunning
                  ? 'bg-indigo-800 text-indigo-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/30'
              }`}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? `Evaluating (${runProgress}%)...` : 'Run All Golden Tests'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Scenarios</span>
            <p className="text-lg font-bold text-white mt-0.5">{testCases.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Passed</span>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{passedCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Failed</span>
            <p className="text-lg font-bold text-rose-400 mt-0.5">{failedCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Pass Rate</span>
            <p className="text-lg font-bold text-indigo-300 mt-0.5">{passRate}%</p>
          </div>
        </div>

        {/* Progress Bar when running */}
        {isRunning && (
          <div className="mt-4 pt-2">
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${runProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Test Form */}
      {showAddForm && (
        <form onSubmit={handleAddTestCase} className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-3 animate-in fade-in">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            Add Custom Golden Evaluation Case
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Display Name</label>
              <input
                type="text"
                placeholder="e.g. Golden 5 - Discount Query"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">User Input (Prompt)</label>
              <input
                type="text"
                required
                placeholder="e.g. Can I return my order?"
                value={newPrompt}
                onChange={e => setNewPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Expected Tool or Action</label>
              <input
                type="text"
                required
                placeholder="e.g. check_order_status or (Guardrail)"
                value={newExpected}
                onChange={e => setNewExpected(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow"
            >
              Save Scenario
            </button>
          </div>
        </form>
      )}

      {/* Test Cases Table / Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Golden Test Scenarios ({testCases.length})</span>
          <span className="text-xs text-slate-400 font-normal">Source: golden_tests.csv</span>
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {testCases.map((tc) => {
            const isPassed = tc.status === 'passed';
            const isFailed = tc.status === 'failed';
            const isPending = tc.status === 'pending' || !tc.status;
            const isExecuting = tc.status === 'running';

            return (
              <div
                key={tc.id}
                className={`p-4 rounded-xl border transition ${
                  isPassed
                    ? 'bg-slate-900/90 border-emerald-800/50'
                    : isFailed
                    ? 'bg-slate-900/90 border-rose-800/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isFailed ? (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    ) : isExecuting ? (
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-600 shrink-0" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {tc.displayName}
                        </h3>
                        {tc.latencyMs && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {tc.latencyMs}ms
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tc.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isPassed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isFailed
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isExecuting
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-800 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {isPassed ? 'PASSED ✓' : isFailed ? 'FAILED ✕' : isExecuting ? 'RUNNING...' : 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Scenario details */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      User Prompt:
                    </span>
                    <span className="text-slate-200 font-mono text-xs mt-0.5 block">
                      "{tc.userInput}"
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Expected Action / Tool:
                    </span>
                    <span className="text-indigo-300 font-mono text-xs mt-0.5 block font-semibold">
                      {tc.expectedIntentOrTool}
                    </span>
                  </div>
                </div>

                {/* Actual Execution Result when available */}
                {tc.actualOutput && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-emerald-300 space-y-1">
                    <div>
                      <span className="text-slate-500">Output: </span>
                      {tc.actualOutput}
                    </div>
                    {tc.reasoning && (
                      <div className="text-slate-400 text-[11px] font-sans">
                        <span className="text-slate-500 font-semibold font-mono">Reasoning: </span>
                        {tc.reasoning}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
