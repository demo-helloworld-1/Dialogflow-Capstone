import React, { useState } from 'react';
import { 
  Layers, 
  Coffee, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Database,
  Globe,
  Radio
} from 'lucide-react';

export const ArchitectureGraph: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<'cx-fsm' | 'studio-adk'>('studio-adk');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-purple-950 text-purple-400 border border-purple-800/50">
                Architecture Blueprint
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Visual State Machines & Multi-Agent Topologies
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              System Architecture & Workflow Visualizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive visual maps comparing Dialogflow CX state machines vs CX Agent Studio generative orchestration.
            </p>
          </div>

          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setActiveDiagram('studio-adk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeDiagram === 'studio-adk'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>CX Agent Studio (GenAI)</span>
            </button>

            <button
              onClick={() => setActiveDiagram('cx-fsm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeDiagram === 'cx-fsm'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Dialogflow CX (FSM)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Diagram Canvas */}
      {activeDiagram === 'studio-adk' ? (
        /* Agent Studio Architecture */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              CX Agent Studio — Multi-Agent & Tool Orchestration Topology
            </h2>
            <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              ADK + Gemini Enterprise CX
            </span>
          </div>

          {/* Interactive Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            {/* Step 1: User & Guardrails */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">1. Ingress Layer</span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  User & Web Widget
                </h3>
                <p className="text-xs text-slate-400">
                  User sends utterance via Dialogflow Messenger chat widget (<code>&lt;df-messenger&gt;</code>).
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                <div className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Instructional Guardrails
                </div>
                <span className="text-[11px] text-amber-300/80 block mt-0.5">
                  Blocks politics & competitor mentions (BestBuy).
                </span>
              </div>
            </div>

            {/* Step 2: Root Agent Reasoning */}
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 shadow-lg flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">2. Orchestration Core</span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  Root Agent (TechMart)
                </h3>
                <p className="text-xs text-slate-300">
                  Powered by structured XML system instructions. Evaluates user intent to route tools or delegate.
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-purple-800 text-[11px] font-mono text-purple-300">
                Structure Button → XML Rules
              </div>
            </div>

            {/* Step 3: Tools & Sub-Agents */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">3. Execution Layer</span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  Tools & Handoffs
                </h3>
              </div>

              <div className="space-y-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-amber-400 font-bold font-mono text-[11px]">Python Tool:</span>
                  <p className="text-slate-300 text-[11px]"><code>check_order_status</code> (Mock DB)</p>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-purple-400 font-bold font-mono text-[11px]">Sub-Agent:</span>
                  <p className="text-slate-300 text-[11px]">Product Specialist</p>
                </div>
              </div>
            </div>

            {/* Step 4: External Services */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">4. Live Data Source</span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-sky-400" />
                  REST OpenAPI
                </h3>
                <p className="text-xs text-slate-400">
                  Calls FakeStore API (<code>/products/category/electronics</code>) in real-time.
                </p>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300">
                HTTP 200 OK Live JSON
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dialogflow CX FSM Architecture */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Dialogflow CX — Finite State Machine (FSM) Flow Graph
            </h2>
            <span className="text-xs font-mono text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              CloudCafe Virtual Agent
            </span>
          </div>

          {/* FSM Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
            {/* Start Node */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">State 1</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-sky-400" />
                Start Page
              </h3>
              <p className="text-xs text-slate-400">
                Listens for <code>order.drink</code> intent triggers.
              </p>
              <div className="p-2 rounded bg-sky-950/60 border border-sky-800 text-[11px] text-sky-300 font-mono">
                Route: order.drink → Take Order
              </div>
            </div>

            {/* Take Order Node */}
            <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/50 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">State 2 (Slot Filling)</span>
              <h3 className="text-sm font-bold text-white">
                Take Order Page
              </h3>
              <p className="text-xs text-slate-300">
                Extracts <code>@coffee_type</code> and <code>@coffee_size</code> parameters.
              </p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                Condition: $page.params.status = "FINAL"
              </div>
            </div>

            {/* Process Order Node */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">State 3 (Fulfillment)</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Process Order Page
              </h3>
              <p className="text-xs text-slate-400">
                Invokes Cloud Functions webhook (<code>processOrder</code>).
              </p>
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 font-mono">
                Condition: $request.webhook.status = "SUCCESS"
              </div>
            </div>

            {/* End Session Node */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">State 4</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                End Session
              </h3>
              <p className="text-xs text-slate-400">
                Fulfillment message delivered to customer, session concludes cleanly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Deep-Dive Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Key Architectural Differences: Dialogflow CX vs CX Agent Studio
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 border-b border-slate-800">Capability</th>
                <th className="p-3 border-b border-slate-800 text-sky-400">Classic Dialogflow CX</th>
                <th className="p-3 border-b border-slate-800 text-purple-400">Modern CX Agent Studio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Logic Engine</td>
                <td className="p-3">Deterministic Finite State Machine (Pages, Routes, Conditions)</td>
                <td className="p-3">Generative LLM Reasoning Loop (Gemini 2.0 + ADK)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Intent & Slot Filling</td>
                <td className="p-3">Intent matching & Annotated Entity Types</td>
                <td className="p-3">Natural Prompt Instructions & Tool Argument Extraction</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Backend Integration</td>
                <td className="p-3">HTTPS Webhook JSON fulfillment schemas</td>
                <td className="p-3">Native Python Tools, OpenAPI 3.0 specs, MCP protocols</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Modular Delegation</td>
                <td className="p-3">Sub-flows and Page transitions</td>
                <td className="p-3">Sub-Agents with dynamic autonomous handoffs</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Safety & QA</td>
                <td className="p-3">Fallback routes & intent threshold tuning</td>
                <td className="p-3">Negative Prompt Guardrails, Safety Filters & Golden Test Suites</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
