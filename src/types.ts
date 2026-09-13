export interface StepItem {
  id: string;
  title: string;
  instructions: string[];
  codeSnippet?: {
    language: string;
    filename?: string;
    code: string;
    description?: string;
  };
  tip?: string;
  isCompleted?: boolean;
}

export interface Task {
  id: string;
  trackId: 'dialogflow-cx' | 'agent-studio' | 'enterprise-suite';
  taskNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  goal: string;
  tags: string[];
  steps: StepItem[];
  keyConcepts: string[];
  sampleDataFile?: string;
  verificationChallenge?: {
    prompt: string;
    expectedAction: string;
    explanation: string;
  };
}

export interface Track {
  id: 'dialogflow-cx' | 'agent-studio' | 'enterprise-suite';
  title: string;
  badge: string;
  paradigm: string;
  description: string;
  totalDuration: string;
  tasksCount: number;
  color: {
    primary: string;
    bg: string;
    border: string;
    text: string;
    gradient: string;
  };
}

export interface SampleDataAsset {
  id: string;
  title: string;
  filename: string;
  fileType: 'csv' | 'json' | 'yaml' | 'python' | 'javascript' | 'html';
  size: string;
  relatedTaskId: string;
  description: string;
  content: string;
}

export interface SimulatorMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  agentName?: string;
  handoffTo?: string;
  toolCall?: {
    name: string;
    input: any;
    output: any;
  };
  stateInfo?: {
    page?: string;
    parameters?: Record<string, string>;
    status?: string;
  };
  chips?: string[];
  isGuardrailBlocked?: boolean;
}

export interface GoldenTestCase {
  id: string;
  displayName: string;
  userInput: string;
  expectedIntentOrTool: string;
  description: string;
  status?: 'pending' | 'running' | 'passed' | 'failed';
  actualOutput?: string;
  latencyMs?: number;
  reasoning?: string;
}
