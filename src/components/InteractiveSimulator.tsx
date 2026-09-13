import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Coffee, 
  ShieldAlert, 
  CheckCircle2, 
  Code2, 
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SimulatorMessage } from '../types';

interface InteractiveSimulatorProps {
  initialMode?: 'dialogflow-cx' | 'agent-studio';
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  initialMode = 'dialogflow-cx'
}) => {
  const [simulatorMode, setSimulatorMode] = useState<'dialogflow-cx' | 'agent-studio'>(initialMode);
  
  // CX State Machine State
  const [cxPage, setCxPage] = useState<'Start' | 'Take Order' | 'Process Order' | 'End Session'>('Start');
  const [cxParams, setCxParams] = useState<{ drink_type?: string; drink_size?: string }>({});
  
  // Studio State
  const [activeAgent, setActiveAgent] = useState<'Root Agent' | 'Product Specialist'>('Root Agent');
  const [inspectMessage, setInspectMessage] = useState<SimulatorMessage | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<SimulatorMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on mode change or reset
  const resetSimulator = (mode?: string) => {
    const validMode: 'dialogflow-cx' | 'agent-studio' = mode === 'agent-studio' ? 'agent-studio' : 'dialogflow-cx';
    setSimulatorMode(validMode);
    setCxPage('Start');
    setCxParams({});
    setActiveAgent('Root Agent');
    setInspectMessage(null);

    if (validMode === 'dialogflow-cx') {
      setMessages([
        {
          id: '1',
          sender: 'system',
          text: '⚡ Dialogflow CX Visual Engine Initialized. Flow: Default Start Flow (State: Start).',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: '2',
          sender: 'agent',
          agentName: 'CloudCafe-Agent',
          text: 'Hello! Welcome to CloudCafe ☕. How can I help you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stateInfo: { page: 'Start', parameters: {}, status: 'INITIAL' }
        }
      ]);
    } else {
      setMessages([
        {
          id: '1',
          sender: 'system',
          text: '🤖 CX Agent Studio (ADK Runtime) Initialized. Model: Gemini 2.0 Flash Enterprise.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: '2',
          sender: 'agent',
          agentName: 'Root Agent (TechMart)',
          text: 'Welcome to TechMart Support! 🛒 I can assist you with your orders or connect you with a product specialist.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: ['Check Order Status', 'Browse Electronics']
        }
      ]);
    }
  };

  useEffect(() => {
    resetSimulator(initialMode);
  }, [initialMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Dialogflow CX Logic handler
  const handleCxMessage = (userText: string) => {
    const textLower = userText.toLowerCase();
    const newMsg: SimulatorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let nextParams = { ...cxParams };
      let nextPage = cxPage;
      let replyText = '';
      let webhookTriggered = false;

      // Extract entities
      if (textLower.includes('latte') || textLower.includes('cafe latte') || textLower.includes('milky coffee')) {
        nextParams.drink_type = 'Latte';
      } else if (textLower.includes('espresso') || textLower.includes('short black') || textLower.includes('strong coffee')) {
        nextParams.drink_type = 'Espresso';
      } else if (textLower.includes('cappuccino') || textLower.includes('cap') || textLower.includes('foamy coffee')) {
        nextParams.drink_type = 'Cappuccino';
      } else if (textLower.includes('mocha') || textLower.includes('choc coffee')) {
        nextParams.drink_type = 'Mocha';
      } else if (textLower.includes('americano') || textLower.includes('black coffee')) {
        nextParams.drink_type = 'Americano';
      }

      if (textLower.includes('small') || textLower.includes('short') || textLower.includes('lil')) {
        nextParams.drink_size = 'Small';
      } else if (textLower.includes('medium') || textLower.includes('regular') || textLower.includes('normal')) {
        nextParams.drink_size = 'Medium';
      } else if (textLower.includes('large') || textLower.includes('tall') || textLower.includes('big')) {
        nextParams.drink_size = 'Large';
      }

      // State machine transitions
      const isOrderIntent = textLower.includes('order') || textLower.includes('coffee') || textLower.includes('drink') || textLower.includes('want') || textLower.includes('get') || nextParams.drink_type;

      if (cxPage === 'Start') {
        if (isOrderIntent) {
          nextPage = 'Take Order';
          if (!nextParams.drink_type) {
            replyText = 'What kind of coffee would you like? (e.g. Latte, Cappuccino, Mocha, Espresso, Americano)';
          } else if (!nextParams.drink_size) {
            replyText = `Great, a ${nextParams.drink_type}. What size would you like? Small, Medium, or Large?`;
          } else {
            nextPage = 'Process Order';
            webhookTriggered = true;
          }
        } else if (textLower.includes('hi') || textLower.includes('hello')) {
          replyText = 'Hello! Welcome to CloudCafe ☕. How can I help you today?';
        } else {
          replyText = "I can help you order fresh coffee drinks! Try saying 'I want to order a coffee'.";
        }
      } else if (cxPage === 'Take Order') {
        if (!nextParams.drink_type) {
          replyText = 'What kind of coffee would you like?';
        } else if (!nextParams.drink_size) {
          replyText = `What size would you like for your ${nextParams.drink_type}? Small, Medium, or Large?`;
        } else {
          nextPage = 'Process Order';
          webhookTriggered = true;
        }
      } else if (cxPage === 'End Session' || cxPage === 'Process Order') {
        nextPage = 'Start';
        nextParams = {};
        replyText = 'Welcome back to CloudCafe! What can I get started for you?';
      }

      const isFinal = !!(nextParams.drink_type && nextParams.drink_size);

      if (webhookTriggered || (nextPage === 'Process Order' && isFinal)) {
        nextPage = 'End Session';
        const mockOrderId = Math.floor(1000 + Math.random() * 9000);
        replyText = `Success! The kitchen is preparing your ${nextParams.drink_size} ${nextParams.drink_type}. Your order number is #${mockOrderId}.`;
      }

      setCxPage(nextPage);
      setCxParams(nextParams);

      const agentMsg: SimulatorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        agentName: 'CloudCafe-Agent',
        text: replyText || "I'm ready to take your order!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stateInfo: {
          page: nextPage,
          parameters: nextParams as Record<string, string>,
          status: isFinal ? 'FINAL' : 'COLLECTING'
        },
        toolCall: webhookTriggered ? {
          name: 'BackendProcessor (Cloud Function: processOrder)',
          input: { parameters: nextParams },
          output: { fulfillment_status: 'SUCCESS', response_text: replyText }
        } : undefined
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 700);
  };

  // Agent Studio GenAI Logic handler
  const handleStudioMessage = async (userText: string) => {
    const textLower = userText.toLowerCase();
    const newMsg: SimulatorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let toolCallData: any = undefined;
      let handoffName: string | undefined = undefined;
      let guardrailTriggered = false;
      let newAgent: 'Root Agent' | 'Product Specialist' = activeAgent;

      // 1. Guardrail Check: Politics or Religion
      if (
        textLower.includes('vote') || 
        textLower.includes('voting') || 
        textLower.includes('election') || 
        textLower.includes('president') || 
        textLower.includes('politics') || 
        textLower.includes('religion')
      ) {
        guardrailTriggered = true;
        replyText = "I'm designed to assist specifically with TechMart customer support and products. I cannot discuss political or religious topics.";
      }
      // 2. Guardrail Check: Competitor mention (BestBuy, Amazon)
      else if (textLower.includes('bestbuy') || textLower.includes('best buy') || textLower.includes('amazon') || textLower.includes('walmart')) {
        guardrailTriggered = true;
        replyText = "I can only provide information regarding TechMart products and services.";
      }
      // 3. Python Tool: Order Status Lookup
      else if (
        textLower.includes('order') || 
        textLower.includes('1234') || 
        textLower.includes('5678') || 
        textLower.includes('9999') || 
        /\b\d{4}\b/.test(textLower)
      ) {
        const orderMatch = textLower.match(/\b(\d{4})\b/);
        if (orderMatch) {
          const orderId = orderMatch[1];
          const mockDb: Record<string, { status: string; date: string }> = {
            '1234': { status: 'Shipped', date: 'Tomorrow' },
            '5678': { status: 'Processing', date: 'In 3 days' },
            '9999': { status: 'Delivered', date: 'Yesterday' }
          };

          if (mockDb[orderId]) {
            replyText = `Your order ${orderId} is currently ${mockDb[orderId].status} and expected delivery is ${mockDb[orderId].date}.`;
            toolCallData = {
              name: 'check_order_status (Python Tool)',
              input: { order_id: orderId },
              output: `Order ${orderId} is ${mockDb[orderId].status}. Expected delivery is ${mockDb[orderId].date}.`
            };
          } else {
            replyText = `Order ${orderId} was not found in our database. Please ensure it is a valid 4-digit order number (e.g., 1234, 5678, 9999).`;
            toolCallData = {
              name: 'check_order_status (Python Tool)',
              input: { order_id: orderId },
              output: 'Order not found.'
            };
          }
        } else {
          replyText = "I'd be glad to look up your order! Could you please provide your 4-digit Order ID? (e.g. 1234, 5678, or 9999)";
        }
      }
      // 4. Sub-Agent Handoff & OpenAPI Tool: Electronics
      else if (
        textLower.includes('electronics') || 
        textLower.includes('monitor') || 
        textLower.includes('laptop') || 
        textLower.includes('tv') || 
        textLower.includes('buy') || 
        textLower.includes('browse') || 
        textLower.includes('product') ||
        textLower.includes('gadget')
      ) {
        newAgent = 'Product Specialist';
        handoffName = 'Product Specialist';
        
        replyText = "Here are top electronic products currently in stock at TechMart:\n\n• WD 2TB Elements Portable External Hard Drive — $64.00\n• SanDisk SSD PLUS 1TB Internal SSD — $109.00\n• Silicon Power 256GB SSD 3D NAND — $109.00\n• Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor — $999.99\n\nWould you like more details on any of these items?";
        
        toolCallData = {
          name: 'search_electronics (OpenAPI 3.0 -> FakeStore API)',
          input: { endpoint: 'https://fakestoreapi.com/products/category/electronics', method: 'GET' },
          output: {
            status: 200,
            products_count: 6,
            top_item: 'WD 2TB Elements ($64.00)'
          }
        };
      }
      // 5. General Greeting or fallback
      else {
        replyText = "Hello! I am your TechMart AI Assistant. How can I help you today? You can check an order status or explore our electronics selection.";
      }

      setActiveAgent(newAgent);

      const agentMsg: SimulatorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        agentName: newAgent,
        handoffTo: handoffName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCall: toolCallData,
        isGuardrailBlocked: guardrailTriggered,
        chips: ['Check order 5678', 'Browse electronics', 'Where is order 1234?']
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const text = inputVal.trim();
    setInputVal('');

    if (simulatorMode === 'dialogflow-cx') {
      handleCxMessage(text);
    } else {
      handleStudioMessage(text);
    }
  };

  const handleChipClick = (chipText: string) => {
    if (isTyping) return;
    if (simulatorMode === 'dialogflow-cx') {
      handleCxMessage(chipText);
    } else {
      handleStudioMessage(chipText);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-61px)] overflow-hidden">
      {/* Simulator Control Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Interactive Agent Runtime Simulator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                Live Interactive Sandbox
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Test FSM transitions, slot-filling, Python tool execution, OpenAPI requests, and guardrails in real time.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              id="sim-mode-cx"
              onClick={() => resetSimulator('dialogflow-cx')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                simulatorMode === 'dialogflow-cx'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>CloudCafe CX (FSM)</span>
            </button>

            <button
              id="sim-mode-studio"
              onClick={() => resetSimulator('agent-studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                simulatorMode === 'agent-studio'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TechMart Studio (GenAI)</span>
            </button>
          </div>

          <button
            id="sim-btn-reset"
            onClick={() => resetSimulator(simulatorMode)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
            title="Reset Simulator Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Simulator Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left 2 Cols: Chat Window */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
          {/* Active Status Bar */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">
                {simulatorMode === 'dialogflow-cx' ? 'CloudCafe-Agent' : activeAgent}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 font-mono">
                {simulatorMode === 'dialogflow-cx' ? `Page: [${cxPage}]` : 'Gemini Reasoning Loop Active'}
              </span>
            </div>

            {simulatorMode === 'dialogflow-cx' && (
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-slate-500">$page.params:</span>
                <span className="text-sky-300 font-semibold">
                  {Object.keys(cxParams).length > 0 ? JSON.stringify(cxParams) : '{}'}
                </span>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block text-[11px] font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-1">
                    <span>{isUser ? 'You' : msg.agentName || 'Agent'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.handoffTo && (
                    <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-medium">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Transferred to {msg.handoffTo}</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.isGuardrailBlocked
                        ? 'bg-amber-950/70 border border-amber-800 text-amber-200 rounded-bl-none'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Tool Call Tag */}
                    {msg.toolCall && (
                      <div className="mt-2.5 pt-2 border-t border-slate-700/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">Tool: {msg.toolCall.name}</span>
                        </div>
                        <button
                          onClick={() => setInspectMessage(msg)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-950 text-indigo-300 border border-indigo-500/30 shrink-0 transition"
                        >
                          Inspect Trace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono py-1 px-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>
                  {simulatorMode === 'dialogflow-cx' ? 'Evaluating state routes...' : 'Gemini reasoning loop & tools...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Quick Prompts:
            </span>
            {simulatorMode === 'dialogflow-cx' ? (
              <>
                <button
                  onClick={() => handleChipClick('I want to order a coffee')}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 whitespace-nowrap transition"
                >
                  "I want coffee"
                </button>
                <button
                  onClick={() => handleChipClick('Large Mocha')}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 whitespace-nowrap transition"
                >
                  "Large Mocha"
                </button>
                <button
                  onClick={() => handleChipClick('Can I get a small espresso?')}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 whitespace-nowrap transition"
                >
                  "Small espresso"
                </button>
                <button
                  onClick={() => handleChipClick('Regular foamy coffee')}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 whitespace-nowrap transition"
                >
                  "Regular foamy coffee"
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleChipClick('Where is order 5678?')}
                  className="px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-purple-900/80 text-xs text-purple-200 border border-purple-800 whitespace-nowrap transition"
                >
                  "Where is order 5678?"
                </button>
                <button
                  onClick={() => handleChipClick('Do you sell monitors or electronics?')}
                  className="px-2.5 py-1 rounded-full bg-purple-950/60 hover:bg-purple-900/80 text-xs text-purple-200 border border-purple-800 whitespace-nowrap transition"
                >
                  "Browse electronics"
                </button>
                <button
                  onClick={() => handleChipClick('Who are you voting for in the election?')}
                  className="px-2.5 py-1 rounded-full bg-amber-950/60 hover:bg-amber-900/80 text-xs text-amber-200 border border-amber-800 whitespace-nowrap transition"
                >
                  "Politics test"
                </button>
                <button
                  onClick={() => handleChipClick('Is BestBuy cheaper than you?')}
                  className="px-2.5 py-1 rounded-full bg-amber-950/60 hover:bg-amber-900/80 text-xs text-amber-200 border border-amber-800 whitespace-nowrap transition"
                >
                  "Competitor test"
                </button>
              </>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              id="simulator-input"
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={
                simulatorMode === 'dialogflow-cx'
                  ? 'Type an order phrase (e.g. "I want a medium latte")...'
                  : 'Ask about order status, electronics, or test guardrails...'
              }
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              id="simulator-submit"
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className={`p-2.5 rounded-xl font-semibold transition ${
                inputVal.trim() && !isTyping
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right 1 Col: Execution Graph & Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 overflow-y-auto shadow-xl">
          {simulatorMode === 'dialogflow-cx' ? (
            /* Dialogflow CX State Machine Inspector */
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-1">
                  <Coffee className="w-4 h-4" />
                  FSM State Transition Graph
                </h3>
                <p className="text-[11px] text-slate-400">
                  Visual representation of the active page node and slot filling parameters.
                </p>
              </div>

              {/* State Nodes */}
              <div className="space-y-2">
                {[
                  { name: 'Start', desc: 'Routes "order.drink" intent to Take Order' },
                  { name: 'Take Order', desc: 'Collects @coffee_type & @coffee_size form slots' },
                  { name: 'Process Order', desc: 'Dispatches Cloud Function webhook' },
                  { name: 'End Session', desc: 'Order placed, resets context' }
                ].map((node, i) => {
                  const isNodeActive = cxPage === node.name;
                  return (
                    <div
                      key={node.name}
                      className={`p-3 rounded-xl border transition ${
                        isNodeActive
                          ? 'bg-sky-950/80 border-sky-500 shadow-md text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isNodeActive ? 'bg-sky-400 animate-ping' : 'bg-slate-600'}`} />
                          <span>{node.name}</span>
                        </div>
                        {isNodeActive && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-sky-500 text-white rounded font-mono">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {node.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Parameter Form Slots */}
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Page Form Parameters ($page.params)
                </span>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">@coffee_type:</span>
                    <span className={cxParams.drink_type ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {cxParams.drink_type || '(unfilled)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">@coffee_size:</span>
                    <span className={cxParams.drink_size ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {cxParams.drink_size || '(unfilled)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                    <span className="text-slate-400">$page.params.status:</span>
                    <span className={cxParams.drink_type && cxParams.drink_size ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {cxParams.drink_type && cxParams.drink_size ? 'FINAL ✓' : 'COLLECTING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CX Agent Studio Inspector */
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-1">
                  <Cpu className="w-4 h-4" />
                  Multi-Agent & Tool Graph
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time Gemini reasoning traces and tool invocation payloads.
                </p>
              </div>

              {/* Agents Hierarchy */}
              <div className="space-y-2">
                <div className={`p-3 rounded-xl border transition ${
                  activeAgent === 'Root Agent'
                    ? 'bg-purple-950/80 border-purple-500 shadow-md text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Root Agent (TechMart-Support)</span>
                    {activeAgent === 'Root Agent' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-purple-500 text-white rounded">
                        REASONING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Attached Tool: <code>check_order_status</code> (Python)
                  </p>
                </div>

                <div className={`p-3 rounded-xl border transition ${
                  activeAgent === 'Product Specialist'
                    ? 'bg-purple-950/80 border-purple-500 shadow-md text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Sub-Agent (Product Specialist)</span>
                    {activeAgent === 'Product Specialist' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-purple-500 text-white rounded">
                        ACTIVE HANDOFF
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Attached Tool: <code>search_electronics</code> (OpenAPI 3.0)
                  </p>
                </div>
              </div>

              {/* Guardrails Status */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Guardrails</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>• Negative Politics/Religion filter:</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Competitor Deflection (BestBuy):</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Safety Filters (Hate/Dangerous):</span>
                    <span className="text-emerald-400 font-mono">BLOCK LOW+</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trace Detail Modal / Box */}
          {inspectMessage && inspectMessage.toolCall && (
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/40 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-indigo-400 font-bold">
                <span className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  Execution Trace
                </span>
                <button
                  onClick={() => setInspectMessage(null)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div>
                  <span className="text-slate-500 font-semibold">Tool:</span> {inspectMessage.toolCall.name}
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Input:</span>
                  <pre className="p-1.5 bg-slate-900 rounded text-[10px] mt-0.5 text-emerald-300 overflow-x-auto">
                    {JSON.stringify(inspectMessage.toolCall.input, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Output:</span>
                  <pre className="p-1.5 bg-slate-900 rounded text-[10px] mt-0.5 text-sky-300 overflow-x-auto">
                    {JSON.stringify(inspectMessage.toolCall.output, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
