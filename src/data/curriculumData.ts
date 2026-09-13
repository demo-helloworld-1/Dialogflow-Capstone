import { Track, Task, SampleDataAsset, GoldenTestCase } from '../types';

export const TRACKS: Track[] = [
  {
    id: 'dialogflow-cx',
    title: 'Dialogflow CX Capstone',
    badge: 'State Machine Track',
    paradigm: 'Finite State Machine (FSM)',
    description: 'Build "CloudCafe" Order Management Agent with Pages, Intents, Routes, Parameters, and Cloud Functions Webhooks.',
    totalDuration: '~3.5 Hours',
    tasksCount: 6,
    color: {
      primary: '#0284c7',
      bg: 'bg-sky-950/40',
      border: 'border-sky-500/30',
      text: 'text-sky-400',
      gradient: 'from-sky-500 to-blue-600'
    }
  },
  {
    id: 'agent-studio',
    title: 'CX Agent Studio Capstone',
    badge: 'GenAI & ADK Track',
    paradigm: 'Generative Multi-Agent & Tool-Calling',
    description: 'Build "TechMart" Smart Support Agent with Root Agent, XML Prompts, Python backend tools, OpenAPI inventory, and Sub-Agent handoffs.',
    totalDuration: '~3.5 Hours',
    tasksCount: 6,
    color: {
      primary: '#8b5cf6',
      bg: 'bg-purple-950/40',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      gradient: 'from-purple-500 to-indigo-600'
    }
  },
  {
    id: 'enterprise-suite',
    title: 'Advanced Enterprise Capabilities',
    badge: 'Enterprise QA & Security',
    paradigm: 'Safety, UI Embedding, CI/CD Testing',
    description: 'Enhance your agent with negative guardrails, platform safety filters, Dialogflow Messenger web widgets, scenario assertions, and batch golden evaluations.',
    totalDuration: '~2.5 Hours',
    tasksCount: 4,
    color: {
      primary: '#10b981',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-teal-600'
    }
  }
];

export const TASKS: Task[] = [
  // --- TRACK 1: Dialogflow CX (CloudCafe) ---
  {
    id: 'df-cx-task-1',
    trackId: 'dialogflow-cx',
    taskNumber: 1,
    title: 'Initialize Environment & Create Agent',
    subtitle: 'Enable Dialogflow CX APIs and launch your first visual agent',
    durationMinutes: 30,
    goal: 'Enable the necessary Google Cloud APIs and set up your initial CloudCafe-Agent in us-central1.',
    tags: ['Google Cloud', 'Agent Setup', 'Console', 'Dialogflow CX'],
    keyConcepts: ['Agent Workspace', 'Region selection', 'Default Language & Timezone', 'Visual Builder Canvas'],
    steps: [
      {
        id: 'df1-1',
        title: 'Open Google Cloud Console',
        instructions: [
          'Navigate to the Google Cloud Console (https://console.cloud.google.com/).',
          'Ensure your billing-enabled GCP Project is selected in the top project dropdown bar.'
        ]
      },
      {
        id: 'df1-2',
        title: 'Enable Dialogflow CX API',
        instructions: [
          'Open the Navigation Menu (☰ hamburger icon in top-left).',
          'Go to Artificial Intelligence > Dialogflow CX.',
          'If prompted with an API activation screen, click "Enable API" and wait for provisioning to finish.'
        ]
      },
      {
        id: 'df1-3',
        title: 'Create CloudCafe Agent',
        instructions: [
          'In the Dialogflow CX console landing page, click "+ Create Agent".',
          'Choose the "Build your own" (Auto-setup) option.',
          'Configure the agent metadata:',
          '• Display name: CloudCafe-Agent',
          '• Location: us-central1',
          '• Time zone: Select your local timezone',
          '• Default language: English - en',
          'Click "Save" to open the visual builder canvas.'
        ],
        tip: 'Choosing us-central1 ensures low latency and compatibility with Cloud Functions and webhook integrations.'
      }
    ],
    verificationChallenge: {
      prompt: 'What core components make up the Dialogflow CX visual layout?',
      expectedAction: 'Left navigation (Build & Manage tabs), Center Canvas (Flows & Pages), and Right panel (Node inspector).',
      explanation: 'Dialogflow CX splits functionality into Build (canvas & flows) and Manage (intents, entity types, webhooks, analytics).'
    }
  },
  {
    id: 'df-cx-task-2',
    trackId: 'dialogflow-cx',
    taskNumber: 2,
    title: 'Import Sample Data & Define Entities',
    subtitle: 'Extract drink types & sizes using CSV synonyms and fuzzy matching',
    durationMinutes: 45,
    goal: 'Teach the agent how to recognize and extract custom parameters (coffee_type and coffee_size) from natural customer input.',
    tags: ['Entities', 'CSV Import', 'Fuzzy Matching', 'Synonyms'],
    keyConcepts: ['Custom Entity Types', 'Fuzzy Extraction', 'Reference Values vs Synonyms', 'Bulk CSV Upload'],
    sampleDataFile: 'coffee_menu.csv',
    steps: [
      {
        id: 'df2-1',
        title: 'Prepare the coffee_menu.csv sample file',
        instructions: [
          'Prepare your CSV data with reference values and common colloquial synonyms (e.g., "short black" for Espresso, "foamy coffee" for Cappuccino).'
        ],
        codeSnippet: {
          language: 'csv',
          filename: 'coffee_menu.csv',
          code: `reference value,synonym 1,synonym 2
Espresso,short black,strong coffee
Latte,cafe latte,milky coffee
Cappuccino,cap,foamy coffee
Mocha,choc coffee,mocha
Americano,black coffee,long black`,
          description: 'Save this file or copy it into Dialogflow CX'
        }
      },
      {
        id: 'df2-2',
        title: 'Create the coffee_type Entity Type',
        instructions: [
          'On the left sidebar, click the "Manage" tab.',
          'Click "Entity Types" in the submenu, then click "+ Create".',
          'Enter Display name: "coffee_type".',
          'Check the box for "Fuzzy extraction" (allows handling user typos like "Latt" or "Capuccino").',
          'Scroll to Entities section. Click the Upload icon (Cloud arrow) or select "Upload CSV".',
          'Upload your "coffee_menu.csv" file to populate the synonyms table.',
          'Click "Save".'
        ],
        tip: 'Fuzzy extraction uses character n-gram distance to tolerate slight misspellings during speech-to-text or quick typing.'
      },
      {
        id: 'df2-3',
        title: 'Create the coffee_size Entity Type (Manual Entry)',
        instructions: [
          'Click "+ Create" again under Manage > Entity Types.',
          'Enter Display name: "coffee_size".',
          'Manually add the 3 size tiers with reference values and synonyms:',
          '• Small → small, short, lil',
          '• Medium → medium, regular, normal',
          '• Large → large, tall, big',
          'Click "Save".'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'If a customer says "Give me a regular foamy coffee", what entities will be extracted?',
      expectedAction: '@coffee_size = Medium, @coffee_type = Cappuccino',
      explanation: 'Dialogflow CX maps "regular" to the reference value Medium and "foamy coffee" to Cappuccino.'
    }
  },
  {
    id: 'df-cx-task-3',
    trackId: 'dialogflow-cx',
    taskNumber: 3,
    title: 'Create Intents & Training Phrases',
    subtitle: 'Configure trigger phrases and annotate slot parameters',
    durationMinutes: 45,
    goal: 'Define user intent triggers and annotate training phrases with @coffee_size and @coffee_type entities.',
    tags: ['Intents', 'NLU', 'Annotations', 'Training Phrases'],
    keyConcepts: ['Intent Classification', 'Parameter Slot Annotation', 'Training Phrases Diversity'],
    steps: [
      {
        id: 'df3-1',
        title: 'Inspect Default Welcome Intent',
        instructions: [
          'In the Manage menu, click "Intents".',
          'Review the Default Welcome Intent provided out-of-the-box. Leave it enabled for standard greetings.'
        ]
      },
      {
        id: 'df3-2',
        title: 'Create order.drink Intent',
        instructions: [
          'Click "+ Create" to generate a new intent.',
          'Set Display name: "order.drink".',
          'In the Description field, enter: "User expresses intent to purchase or customize a coffee beverage".'
        ]
      },
      {
        id: 'df3-3',
        title: 'Add & Annotate Training Phrases',
        instructions: [
          'Add the following phrases under Training phrases (press Enter after each):',
          '1. "I want to order a coffee"',
          '2. "Can I get a large latte?"',
          '3. "I need a medium mocha please"',
          '4. "Order a drink"',
          '5. "Give me a small espresso"',
          'Annotation Check: Ensure "large", "medium", "small" are highlighted as @coffee_size and "latte", "mocha", "espresso" as @coffee_type.',
          'If not auto-highlighted, select the word with your cursor and pick the entity from the popup dropdown.',
          'Click "Save".'
        ],
        tip: 'Include both unfulfilled phrases ("I want coffee") and fully slotted phrases ("large mocha") so CX handles both single-turn and multi-turn orders.'
      }
    ],
    verificationChallenge: {
      prompt: 'Why should training phrases include both with and without size/type parameters?',
      expectedAction: 'Allows the NLU to classify the intent whether the user provides all details upfront or requires slot-filling follow-ups.',
      explanation: 'Training variety prevents overfitting to only complete sentences.'
    }
  },
  {
    id: 'df-cx-task-4',
    trackId: 'dialogflow-cx',
    taskNumber: 4,
    title: 'Build the State Machine Canvas',
    subtitle: 'Connect Start, Take Order, and Process Order pages with form parameters',
    durationMinutes: 60,
    goal: 'Structure the conversational finite state machine using Pages, State Transitions, and $page.params.status = "FINAL" evaluation.',
    tags: ['Pages', 'State Machine', 'Routes', 'Form Filling', 'Fulfillment'],
    keyConcepts: ['Finite State Machine', 'Page Parameters Form', 'Conditional Transitions', 'Final Parameter Status'],
    steps: [
      {
        id: 'df4-1',
        title: 'Create the Conversation Pages',
        instructions: [
          'Switch from the "Manage" tab back to the "Build" tab on the left sidebar.',
          'In the Default Start Flow canvas, hover and click "+", then select "Page".',
          'Create page 1: Name it "Take Order".',
          'Create page 2: Name it "Process Order".'
        ]
      },
      {
        id: 'df4-2',
        title: 'Route Start Node to Take Order',
        instructions: [
          'Click on the "Start" page node on the visual canvas. The right panel will open.',
          'Under Routes, click "+ Add Route".',
          'Select Intent: "order.drink".',
          'Scroll down to Transition > Page, and select "Take Order".',
          'Click "Save".'
        ]
      },
      {
        id: 'df4-3',
        title: 'Configure Form Parameters on Take Order Page',
        instructions: [
          'Click the "Take Order" page node on the canvas.',
          'In the right panel, under Parameters, click "+".',
          'Add Drink Type Parameter:',
          '• Display name: drink_type',
          '• Entity type: @coffee_type',
          '• Required: Checked ✓',
          '• Initial prompt fulfillment text: "What kind of coffee would you like?"',
          '• Click Save.',
          'Add Size Parameter (Click "+"):',
          '• Display name: drink_size',
          '• Entity type: @coffee_size',
          '• Required: Checked ✓',
          '• Initial prompt fulfillment text: "What size would you like? Small, Medium, or Large?"',
          '• Click Save.'
        ],
        tip: 'Dialogflow CX will automatically loop on the Take Order page prompting for any parameter that has not yet been filled!'
      },
      {
        id: 'df4-4',
        title: 'Add Condition Route when Form is Complete',
        instructions: [
          'Still in "Take Order" page inspector, click "+ Add Route".',
          'Under Condition, select the "Condition rules" radio button.',
          'Choose "Match AT LEAST ONE rule (OR)".',
          'Set Condition: Parameter "$page.params.status" | Operator "=" | Value \'"FINAL"\'',
          'Under Transition, select Page: "Process Order".',
          'Click "Save".'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'What does $page.params.status = "FINAL" signify in Dialogflow CX?',
      expectedAction: 'All required parameters marked in the page form have been successfully populated.',
      explanation: 'CX evaluates page parameters and sets the status to FINAL once every required slot has a value.'
    }
  },
  {
    id: 'df-cx-task-5',
    trackId: 'dialogflow-cx',
    taskNumber: 5,
    title: 'Webhook Integration via Cloud Functions',
    subtitle: 'Deploy a Node.js webhook backend and handle fulfillment responses',
    durationMinutes: 60,
    goal: 'Deploy a Node.js 20 Cloud Function and connect it to Dialogflow CX to process the captured order parameters.',
    tags: ['Webhooks', 'Cloud Functions', 'Node.js', 'Fulfillment', 'API'],
    keyConcepts: ['Webhook Fulfillment Contract', 'Fulfillment Messages', 'Session Parameters Payload', 'End Session Transition'],
    sampleDataFile: 'index.js',
    steps: [
      {
        id: 'df5-1',
        title: 'Deploy Google Cloud Function',
        instructions: [
          'Open a new browser tab: Google Cloud Console > Cloud Functions.',
          'Click "Create Function".',
          'Name: "cafe-order-processor".',
          'Trigger: HTTPS (Select "Allow unauthenticated invocations" for this lab).',
          'Click Save > Next.',
          'Runtime: Node.js 20.',
          'Replace index.js with the provided webhook code payload.',
          'Set Entry Point: "processOrder".',
          'Click "Deploy" (takes ~2 minutes) and copy the generated HTTPS Trigger URL.'
        ],
        codeSnippet: {
          language: 'javascript',
          filename: 'index.js',
          code: `const functions = require('@google-cloud/functions-framework');

functions.http('processOrder', (req, res) => {
  // Extract parameters sent by Dialogflow CX
  const params = req.body.sessionInfo?.parameters || {};
  const size = params.drink_size || 'standard';
  const type = params.drink_type || 'coffee';
  
  // Generate a mock order ID
  const orderId = Math.floor(Math.random() * 10000);

  // Build the specific JSON response Dialogflow CX expects
  const jsonResponse = {
    fulfillment_response: {
      messages: [
        {
          text: {
            text: [
              \`Success! The kitchen is preparing your \${size} \${type}. Your order number is #\${orderId}.\`
            ]
          }
        }
      ]
    }
  };

  res.status(200).send(jsonResponse);
});`,
          description: 'Cloud Function webhook handler returning fulfillment response'
        }
      },
      {
        id: 'df5-2',
        title: 'Register Webhook in Dialogflow CX',
        instructions: [
          'Return to Dialogflow CX console tab.',
          'Go to Manage > Webhooks > "+ Create".',
          'Display name: "BackendProcessor".',
          'Webhook URL: Paste your Cloud Function Trigger URL.',
          'Leave Subtype as Standard and click "Save".'
        ]
      },
      {
        id: 'df5-3',
        title: 'Trigger Webhook on Process Order Page Entry',
        instructions: [
          'Go back to Build tab and click the "Process Order" page.',
          'Under Entry fulfillment, click "Edit fulfillment".',
          'Scroll to Webhook section, check "Enable webhook", and select "BackendProcessor".',
          'Set Tag to: "process_order".',
          'Click "Save".'
        ]
      },
      {
        id: 'df5-4',
        title: 'Add Success Route to End Session',
        instructions: [
          'On the "Process Order" page, click "+ Add Route".',
          'Under Condition, enter: $request.webhook.status = "SUCCESS"',
          'Under Transition, select Page: "End Session".',
          'Click "Save".'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'Where does Dialogflow CX place parameters inside the webhook HTTP POST body?',
      expectedAction: 'req.body.sessionInfo.parameters',
      explanation: 'CX sends the active session state including all extracted parameters in the sessionInfo object.'
    }
  },
  {
    id: 'df-cx-task-6',
    trackId: 'dialogflow-cx',
    taskNumber: 6,
    title: 'Test & Verify the State Machine in Simulator',
    subtitle: 'Run complete test conversations and inspect page transitions & slots',
    durationMinutes: 15,
    goal: 'Verify the complete conversational lifecycle from Start to Take Order, slot filling, webhook trigger, and session close.',
    tags: ['Simulator', 'Testing', 'Debugging', 'Verification'],
    keyConcepts: ['Test Agent Simulator', 'FSM State Inspection', 'Live Parameter Tracing'],
    steps: [
      {
        id: 'df6-1',
        title: 'Launch the Built-in Test Simulator',
        instructions: [
          'In the top right corner of the CX console, click the "Test Agent" button.',
          'The side test drawer will open.'
        ]
      },
      {
        id: 'df6-2',
        title: 'Execute the Step-by-Step Order Scenario',
        instructions: [
          'Step 1: Type "Hi" → Agent responds with Default Welcome Intent greeting.',
          'Step 2: Type "I want a coffee" → Bot recognizes order.drink intent and transitions to Take Order. It asks: "What kind of coffee would you like?"',
          'Step 3: Type "A mocha" → Bot captures @coffee_type = Mocha, but still needs size. It asks: "What size would you like? Small, Medium, or Large?"',
          'Step 4: Type "Large" → Bot captures @coffee_size = Large. $page.params.status becomes FINAL. Transitions to Process Order. Webhook fires!',
          'Step 5: Inspect response: "Success! The kitchen is preparing your Large Mocha. Your order number is #XXXX."'
        ],
        tip: 'Try one-shot ordering too: type "Give me a small latte" in a single utterance to test direct parameter population without prompting.'
      }
    ],
    verificationChallenge: {
      prompt: 'What happens if a user provides both drink and size in the initial sentence?',
      expectedAction: 'Both slots fill immediately, skipping both prompts and transitioning directly to Process Order.',
      explanation: 'Dialogflow CX slot-filling detects pre-filled parameters from the initial utterance.'
    }
  },

  // --- TRACK 2: CX Agent Studio (TechMart) ---
  {
    id: 'as-task-1',
    trackId: 'agent-studio',
    taskNumber: 1,
    title: 'Initialize CX Agent Studio Environment',
    subtitle: 'Set up the Generative AI-first workspace powered by Gemini and ADK',
    durationMinutes: 30,
    goal: 'Create your TechMart-Support agent application on the Gemini Enterprise CX Agent Studio platform.',
    tags: ['Agent Studio', 'Gemini', 'ADK', 'GenAI Platform'],
    keyConcepts: ['Generative Agent Paradigm', 'Prompt-driven reasoning', 'Agent Development Kit (ADK)'],
    steps: [
      {
        id: 'as1-1',
        title: 'Navigate to CX Agent Studio',
        instructions: [
          'Open Google Cloud Console > Customer Experience (or search directly for "CX Agent Studio" in the top search bar).',
          'Ensure the active project has Vertex AI & Gemini APIs enabled.'
        ]
      },
      {
        id: 'as1-2',
        title: 'Create Agent Application',
        instructions: [
          'Click "Create Agent Application".',
          'Configure basic metadata:',
          '• Display Name: TechMart-Support',
          '• Time Zone: Select your local timezone',
          '• Default Language: English - en',
          'Click "Create".',
          'Notice how the UI centers on natural language instructions, tools, and sub-agents rather than rigid flow charts.'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'How does CX Agent Studio differ fundamentally from traditional Dialogflow CX?',
      expectedAction: 'CX Agent Studio uses LLM reasoning and tools instead of hardcoded state machine nodes, intents, and routes.',
      explanation: 'Agent Studio is built on the Agent Development Kit (ADK) where Gemini dynamically reasons over tools and handoffs.'
    }
  },
  {
    id: 'as-task-2',
    trackId: 'agent-studio',
    taskNumber: 2,
    title: 'Configure Root Agent & XML Prompts',
    subtitle: 'Use the Gemini "Structure" button to compile natural language into XML prompts',
    durationMinutes: 45,
    goal: 'Write the Root Agent system instructions and compile them into structured, reliable XML.',
    tags: ['Prompt Engineering', 'XML Structure', 'Root Agent', 'System Instructions'],
    keyConcepts: ['Root Agent Persona', 'Gemini Structure Compiler', 'Structured XML Prompts'],
    steps: [
      {
        id: 'as2-1',
        title: 'Open Root Agent Instructions',
        instructions: [
          'On the left navigation bar, select "Agents".',
          'Click on the default "Root Agent" to open the prompt editor.'
        ]
      },
      {
        id: 'as2-2',
        title: 'Draft Plain Text System Prompt',
        instructions: [
          'Paste the following plain-text instructions into the Instructions box:'
        ],
        codeSnippet: {
          language: 'text',
          filename: 'root_instructions.txt',
          code: `You are a helpful customer support agent for TechMart. 
Your primary goals are to assist users with checking their order status and to route product inquiries to the right specialist.

Rules:
- If a user asks for their order status, ask for their 4-digit Order ID. Once provided, use the check_order_status tool.
- If a user asks for product recommendations or inventory, hand off the conversation to the Product Specialist agent.
- Always be polite, concise, and do not make up order information.`,
          description: 'Initial plain-text agent prompt before structuring'
        }
      },
      {
        id: 'as2-3',
        title: 'Trigger the "Structure" Optimization',
        instructions: [
          'Click the "Structure" button located near the top of the instructions text area.',
          'Observe how CX Agent Studio uses Gemini to automatically format your rules into structured XML tags (<role>, <goals>, <rules>, <tool_guidance>).',
          'Review the generated XML output and click "Save".'
        ],
        tip: 'Structured XML significantly reduces LLM hallucinations and ensures strict adherence to routing and tool-calling constraints.'
      }
    ],
    verificationChallenge: {
      prompt: 'Why does CX Agent Studio recommend compiling prompts into XML format?',
      expectedAction: 'Gemini models parse XML tags with higher structural consistency and lower instruction drift.',
      explanation: 'XML formatting creates unambiguous boundaries between role, goals, constraints, and tool definitions.'
    }
  },
  {
    id: 'as-task-3',
    trackId: 'agent-studio',
    taskNumber: 3,
    title: 'Build Python Tool for Order Status',
    subtitle: 'Create a lightweight Python function tool with typed input/output schemas',
    durationMinutes: 60,
    goal: 'Create and attach a custom Python tool that performs mock database order status lookups.',
    tags: ['Python', 'Tools', 'Function Calling', 'Schema'],
    keyConcepts: ['Python Tool Execution', 'Docstring LLM Grounding', 'Input Schema Typing'],
    sampleDataFile: 'check_order_status.py',
    steps: [
      {
        id: 'as3-1',
        title: 'Create New Python Tool',
        instructions: [
          'On the left navigation menu, click "Tools" > "+ Create Tool".',
          'Select "Python" as the tool type.',
          'Tool Name: "check_order_status".',
          'Description: "Fetches the delivery status of an order. Requires a 4-digit order_id."'
        ],
        tip: 'The LLM uses the tool Description to determine WHEN to invoke the tool during its reasoning loop.'
      },
      {
        id: 'as3-2',
        title: 'Implement the Python Script',
        instructions: [
          'In the built-in Code Editor, paste the Python mock order lookup function:'
        ],
        codeSnippet: {
          language: 'python',
          filename: 'check_order_status.py',
          code: `def check_order_status(order_id: str) -> str:
    """Returns the order status for a given order ID."""
    orders = {
        "1234": {"status": "Shipped", "delivery_date": "Tomorrow"},
        "5678": {"status": "Processing", "delivery_date": "In 3 days"},
        "9999": {"status": "Delivered", "delivery_date": "Yesterday"}
    }
    if order_id in orders:
        return f"Order {order_id} is {orders[order_id]['status']}. Expected delivery is {orders[order_id]['delivery_date']}."
    else:
        return "Order not found. Please ensure it is a valid 4-digit number."`,
          description: 'Python tool handler with simulated mock order dictionary'
        }
      },
      {
        id: 'as3-3',
        title: 'Configure Schemas & Bind to Root Agent',
        instructions: [
          'Under Input Schema: Add parameter "order_id" with type "string".',
          'Under Output Schema: Set type to "string".',
          'Click "Save".',
          'Go back to "Agents" > "Root Agent".',
          'Scroll to the Tools section, click "Add Tool", and check "check_order_status".',
          'Click "Save".'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'If a user says "Where is order 5678?", what will the tool return?',
      expectedAction: 'Order 5678 is Processing. Expected delivery is In 3 days.',
      explanation: 'The Python tool matches key "5678" in the dictionary and formats the status string.'
    }
  },
  {
    id: 'as-task-4',
    trackId: 'agent-studio',
    taskNumber: 4,
    title: 'Build OpenAPI Tool with Public Sample Data',
    subtitle: 'Connect live REST API endpoints using OpenAPI 3.0 YAML schemas',
    durationMinutes: 45,
    goal: 'Declare an OpenAPI 3.0 schema that calls FakeStoreAPI to fetch live electronics inventory.',
    tags: ['OpenAPI', 'REST API', 'FakeStore API', 'YAML'],
    keyConcepts: ['OpenAPI 3.0 Specification', 'Dynamic REST Tool', 'Live Public Data Consumption'],
    sampleDataFile: 'search_electronics.yaml',
    steps: [
      {
        id: 'as4-1',
        title: 'Create OpenAPI Tool',
        instructions: [
          'Click "Tools" on the left menu, then click "+ Create Tool".',
          'Select "OpenAPI" as the tool type.',
          'Tool Name: "search_electronics".',
          'Description: "Fetches a real-time list of electronic products and gadgets available in the store."'
        ]
      },
      {
        id: 'as4-2',
        title: 'Define OpenAPI 3.0 YAML Schema',
        instructions: [
          'In the Schema Definition box, paste the following OpenAPI specification:'
        ],
        codeSnippet: {
          language: 'yaml',
          filename: 'search_electronics.yaml',
          code: `openapi: 3.0.0
info:
  title: FakeStore API
  version: 1.0.0
servers:
  - url: https://fakestoreapi.com
paths:
  /products/category/electronics:
    get:
      summary: Get electronic products
      operationId: getElectronics
      responses:
        '200':
          description: A JSON array of electronic products containing titles and prices.`,
          description: 'OpenAPI 3.0 schema targeting public FakeStore API electronics endpoint'
        }
      },
      {
        id: 'as4-3',
        title: 'Save and Validate Tool',
        instructions: [
          'Click "Save". CX Agent Studio will validate the OpenAPI spec syntax and create the callable REST tool endpoint.'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'What URL endpoint will this OpenAPI tool send a GET request to at runtime?',
      expectedAction: 'https://fakestoreapi.com/products/category/electronics',
      explanation: 'The servers URL is combined with the path /products/category/electronics.'
    }
  },
  {
    id: 'as-task-5',
    trackId: 'agent-studio',
    taskNumber: 5,
    title: 'Orchestrate Multi-Agent Handoffs',
    subtitle: 'Create a specialized Sub-Agent and connect dynamic delegation',
    durationMinutes: 45,
    goal: 'Create a specialized "Product Specialist" Sub-Agent, attach search_electronics, and configure handoffs from Root Agent.',
    tags: ['Multi-Agent', 'Sub-Agents', 'Handoffs', 'Specialization'],
    keyConcepts: ['Agent Delegation', 'Specialized Sub-Agents', 'Dynamic Intent-based Handoff'],
    steps: [
      {
        id: 'as5-1',
        title: 'Create Product Specialist Sub-Agent',
        instructions: [
          'Navigate to Agents menu and click "+ Create Agent".',
          'Agent Name: "Product Specialist".'
        ]
      },
      {
        id: 'as5-2',
        title: 'Configure Sub-Agent Instructions & Tools',
        instructions: [
          'In Instructions, paste:',
          '"""You are the TechMart Product Specialist. When a user wants to buy electronics, use the search_electronics tool to fetch live inventory. Summarize product titles and prices in a friendly, conversational way. Do not hallucinate products. If the user is done shopping, politely end your assistance so the Root Agent can take over."""',
          'Click "Structure" to convert to XML format.',
          'Scroll down to Tools, click "Add Tool", and select "search_electronics".',
          'Click "Save".'
        ]
      },
      {
        id: 'as5-3',
        title: 'Link Root Agent to Product Specialist',
        instructions: [
          'Go back to "Agents" > "Root Agent".',
          'Scroll down to "Available Agents" (or "Handoffs").',
          'Add "Product Specialist" to the allowed transfer list.',
          'Click "Save".'
        ],
        tip: 'The Root Agent can now seamlessly transfer conversation control to the Product Specialist whenever product shopping inquiries occur!'
      }
    ],
    verificationChallenge: {
      prompt: 'How does the Root Agent know when to transfer the user to the Product Specialist?',
      expectedAction: 'The Root Agent evaluates the user utterance against its system rules and Available Agents descriptions to initiate handoff.',
      explanation: 'Gemini uses semantic intent classification without needing manually configured transition routes.'
    }
  },
  {
    id: 'as-task-6',
    trackId: 'agent-studio',
    taskNumber: 6,
    title: 'Simulate, Trace, & Evaluate Reasoning',
    subtitle: 'Inspect live Gemini reasoning loops, tool calls, and trace execution graphs',
    durationMinutes: 30,
    goal: 'Execute interactive tests in the Simulator panel and inspect the raw execution traces and JSON responses.',
    tags: ['Simulator', 'Traces', 'Execution Graph', 'Reasoning Loop'],
    keyConcepts: ['Reasoning Loop Tracing', 'Tool Invocation Payloads', 'Sub-Agent Handoff Verification'],
    steps: [
      {
        id: 'as6-1',
        title: 'Test Python Tool Reasoning in Simulator',
        instructions: [
          'Open the Simulator panel on the right.',
          'Type: "Hi, I need help with my purchase."',
          'Type: "Where is order 5678?"',
          'Verify that Gemini reasons over the query, calls check_order_status with {"order_id": "5678"}, and answers: "Your order 5678 is currently processing and is expected to be delivered in 3 days."'
        ]
      },
      {
        id: 'as6-2',
        title: 'Test Sub-Agent Handoff & OpenAPI Tool',
        instructions: [
          'Next, in the same conversation, type: "Actually, do you sell any monitors or electronics?"',
          'Verify that the UI displays a "Handoff to Product Specialist" badge.',
          'The Sub-Agent triggers search_electronics, parses the real-time FakeStore API JSON array, and provides formatted product suggestions.'
        ]
      },
      {
        id: 'as6-3',
        title: 'Inspect Execution Traces',
        instructions: [
          'Click the Trace (or JSON) icon beside any agent response bubble.',
          'Inspect the raw tool input parameters, the returned HTTP/Python payload, and the LLM chain-of-thought.'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'What tool will execute when a user asks about order status versus product shopping?',
      expectedAction: 'Order status triggers check_order_status (Python); shopping triggers handoff to Product Specialist and search_electronics (OpenAPI).',
      explanation: 'Gemini intelligently routes between direct tool calling and sub-agent delegation.'
    }
  },

  // --- TRACK 3: Enterprise Suite (Part 2) ---
  {
    id: 'ent-task-7',
    trackId: 'enterprise-suite',
    taskNumber: 7,
    title: 'Implementing Guardrails and Safety',
    subtitle: 'Configure instructional negative constraints & platform safety filters',
    durationMinutes: 30,
    goal: 'Enforce strict instructional guardrails on politics/competitors and configure Google Cloud platform safety thresholds.',
    tags: ['Guardrails', 'Safety Settings', 'Content Moderation', 'Enterprise'],
    keyConcepts: ['Negative Instructional Constraints', 'Competitor Redirection', 'Safety Filter Thresholds'],
    steps: [
      {
        id: 'ent7-1',
        title: 'Configure Agent-Level Instructional Guardrails',
        instructions: [
          'In CX Agent Studio left menu, click "Agents" > "Root Agent".',
          'Scroll to the Instructions editor.',
          'Append the strict negative constraint rules:'
        ],
        codeSnippet: {
          language: 'text',
          filename: 'guardrails_prompt.txt',
          code: `GUARDRAILS:
1. NEVER discuss politics, religion, or personal opinions.
2. If the user asks about a competitor (e.g., "BestBuy" or "Amazon"), respond exactly with: "I can only provide information regarding TechMart products and services."`,
          description: 'Instructional guardrail snippet'
        }
      },
      {
        id: 'ent7-2',
        title: 'Re-Structure XML & Save',
        instructions: [
          'Click the "Structure" button to compile the new guardrails into dedicated <guardrails> XML tags.',
          'Click "Save".'
        ]
      },
      {
        id: 'ent7-3',
        title: 'Configure Platform Safety Settings',
        instructions: [
          'On the left navigation menu, click Settings (⚙ gear icon) > Safety Settings (or Security).',
          'Review the standard safety categories: Hate Speech, Dangerous Content, Harassment, Sexually Explicit.',
          'Move the sliders for "Dangerous Content" and "Hate Speech" to "Block low and above" (most restrictive enterprise setting).',
          'Click "Save".'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'If a customer asks: "Is BestBuy cheaper than you?", what should the agent answer?',
      expectedAction: 'I can only provide information regarding TechMart products and services.',
      explanation: 'The strict negative constraint enforces immediate competitor deflection.'
    }
  },
  {
    id: 'ent-task-8',
    trackId: 'enterprise-suite',
    taskNumber: 8,
    title: 'Web Widgets & Rich Responses',
    subtitle: 'Deploy Dialogflow Messenger embed & interactive suggestion chips',
    durationMinutes: 45,
    goal: 'Deploy Dialogflow Messenger web widget to an HTML store page and enable rich suggestion chips.',
    tags: ['Web Widget', 'Dialogflow Messenger', 'HTML', 'Suggestion Chips'],
    keyConcepts: ['Dialogflow Messenger Embed', 'Rich Suggestion Chips', 'Web Client Testing'],
    sampleDataFile: 'techmart_store.html',
    steps: [
      {
        id: 'ent8-1',
        title: 'Enable Dialogflow Messenger Integration',
        instructions: [
          'On the left navigation menu, click "Integrations".',
          'Find "Dialogflow Messenger" and click "Connect" (or Enable).',
          'A popup will display the HTML <script> and <df-messenger> tag.',
          'Click "Copy" to save the integration snippet.'
        ]
      },
      {
        id: 'ent8-2',
        title: 'Create Local Testing Website (techmart_store.html)',
        instructions: [
          'Create a file named "techmart_store.html" on your local system with the embed snippet:'
        ],
        codeSnippet: {
          language: 'html',
          filename: 'techmart_store.html',
          code: `<!DOCTYPE html>
<html>
<head>
    <title>TechMart Store</title>
    <style> body { font-family: system-ui, sans-serif; background-color: #f4f4f9; padding: 50px; } </style>
</head>
<body>
    <h1>Welcome to TechMart 🛒</h1>
    <p>Click the chat icon in the bottom right to talk to our AI Assistant!</p>
    
    <!-- Dialogflow Messenger Widget Integration -->
    <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
    <df-messenger
      intent="WELCOME"
      chat-title="TechMart Assistant"
      agent-id="YOUR_AGENT_ID"
      language-code="en"
    ></df-messenger>
</body>
</html>`,
          description: 'Client testing webpage with Dialogflow Messenger widget'
        }
      },
      {
        id: 'ent8-3',
        title: 'Add Suggestion Chips to Greeting',
        instructions: [
          'Go back to "Root Agent" > "Instructions".',
          'Add the UI instruction: "When you greet the user, always provide two options using suggestion chips: \'Check Order Status\' and \'Browse Electronics\'."',
          'Click "Structure" and "Save".',
          'Open your techmart_store.html in a browser and test the clickable chips!'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'What native UI component renders clickable quick-reply buttons in the web widget?',
      expectedAction: 'Suggestion Chips (<df-chips>) in Dialogflow Messenger.',
      explanation: 'Suggestion chips provide one-tap actions for common user intents.'
    }
  },
  {
    id: 'ent-task-9',
    trackId: 'enterprise-suite',
    taskNumber: 9,
    title: 'Scenario-Based Testing & Assertions',
    subtitle: 'Build multi-turn test cases with expected tool execution assertions',
    durationMinutes: 30,
    goal: 'Create and run end-to-end scenario test cases with automated assertions on tool execution.',
    tags: ['Test Cases', 'Scenario Testing', 'Assertions', 'QA'],
    keyConcepts: ['Multi-turn Test Recording', 'Expected Action Assertions', 'Automated Pass/Fail Evaluation'],
    steps: [
      {
        id: 'ent9-1',
        title: 'Navigate to Test Cases UI',
        instructions: [
          'On the left navigation menu, click Manage > Test Cases.',
          'Click "+ Create Test Case".',
          'Display Name: "Scenario: Order Status Success".'
        ]
      },
      {
        id: 'ent9-2',
        title: 'Simulate Multi-turn Conversation',
        instructions: [
          'In the scenario builder panel on the right:',
          '1. User Input: "Hi" (press Enter)',
          '2. Agent Response: Auto-populates greeting',
          '3. User Input: "Where is my order?" (press Enter)',
          '4. User Input: "1234" (press Enter)'
        ]
      },
      {
        id: 'ent9-3',
        title: 'Add Assertion & Run Test',
        instructions: [
          'Hover over the step where user entered "1234".',
          'Click "Add Assertion" (or "Add Expected Action").',
          'Check "Expected Tool Call" and select "check_order_status".',
          'Save the Test Case and click "Run Test".',
          'Confirm the test turns Green (Passed).'
        ]
      }
    ],
    verificationChallenge: {
      prompt: 'What condition causes a scenario test case assertion to fail?',
      expectedAction: 'The agent answers without invoking the specified tool, or invokes the wrong tool.',
      explanation: 'Assertions strictly validate that the underlying reasoning engine called the required tool.'
    }
  },
  {
    id: 'ent-task-10',
    trackId: 'enterprise-suite',
    taskNumber: 10,
    title: 'Golden Testing & Batch Evaluation',
    subtitle: 'Run parallel regression suites against Golden Datasets for CI/CD confidence',
    durationMinutes: 30,
    goal: 'Create a Golden Test Suite from golden_tests.csv and execute parallel batch regression evaluations.',
    tags: ['Golden Tests', 'Batch Evaluation', 'Regression Testing', 'CI/CD'],
    keyConcepts: ['Golden Dataset Curation', 'Test Suite Aggregation', 'Parallel Batch Execution', 'Pass/Fail Metrics'],
    sampleDataFile: 'golden_tests.csv',
    steps: [
      {
        id: 'ent10-1',
        title: 'Prepare Golden Dataset (golden_tests.csv)',
        instructions: [
          'Review the golden dataset containing positive tool-calling cases and negative guardrail tests:'
        ],
        codeSnippet: {
          language: 'csv',
          filename: 'golden_tests.csv',
          code: `Display Name,User Input,Expected Intent / Tool
Golden 1 - Status,Check my order 5678,check_order_status
Golden 2 - Handoff,I want to buy a laptop,search_electronics
Golden 3 - Guardrail,Who are you voting for?,(None - fallback)
Golden 4 - Guardrail,Is BestBuy cheaper?,(None - fallback)`,
          description: 'Golden batch evaluation dataset'
        }
      },
      {
        id: 'ent10-2',
        title: 'Create Test Suite in Console',
        instructions: [
          'In Manage > Test Cases, select the "Test Suites" tab at the top.',
          'Click "+ Create Test Suite".',
          'Name: "TechMart-Golden-Release-V1".',
          'Select your existing test cases (Scenario: Order Status, Competitor Guardrail, Politics Guardrail, etc.) into the suite.'
        ]
      },
      {
        id: 'ent10-3',
        title: 'Execute Batch Evaluation',
        instructions: [
          'Click on "TechMart-Golden-Release-V1".',
          'Click "Run all".',
          'The platform launches concurrent parallel sessions executing all conversations.',
          'Review the Pass/Fail percentage dashboard to guarantee zero prompt regressions!'
        ],
        tip: 'Run this Golden Test Suite whenever modifying prompt instructions or updating tool schemas before pushing to production.'
      }
    ],
    verificationChallenge: {
      prompt: 'Why is golden testing essential for Generative AI agents versus traditional code?',
      expectedAction: 'Prompt edits can cause non-deterministic behavioral shifts; batch golden suites catch regressions automatically.',
      explanation: 'Golden datasets provide consistent ground truth across LLM model iterations.'
    }
  }
];

export const SAMPLE_DATA_ASSETS: SampleDataAsset[] = [
  {
    id: 'asset-coffee-menu',
    title: 'Coffee Menu Entities CSV',
    filename: 'coffee_menu.csv',
    fileType: 'csv',
    size: '228 B',
    relatedTaskId: 'df-cx-task-2',
    description: 'Sample data for Dialogflow CX coffee_type entity with reference values and synonyms.',
    content: `reference value,synonym 1,synonym 2
Espresso,short black,strong coffee
Latte,cafe latte,milky coffee
Cappuccino,cap,foamy coffee
Mocha,choc coffee,mocha
Americano,black coffee,long black`
  },
  {
    id: 'asset-golden-tests',
    title: 'Golden Tests Batch CSV',
    filename: 'golden_tests.csv',
    fileType: 'csv',
    size: '264 B',
    relatedTaskId: 'ent-task-10',
    description: 'Golden evaluation dataset for batch regression testing against tools and guardrails.',
    content: `Display Name,User Input,Expected Intent / Tool
Golden 1 - Status,Check my order 5678,check_order_status
Golden 2 - Handoff,I want to buy a laptop,search_electronics
Golden 3 - Guardrail,Who are you voting for?,(None - fallback)
Golden 4 - Guardrail,Is BestBuy cheaper?,(None - fallback)`
  },
  {
    id: 'asset-cloud-function',
    title: 'Order Processor Cloud Function (Node.js)',
    filename: 'index.js',
    fileType: 'javascript',
    size: '792 B',
    relatedTaskId: 'df-cx-task-5',
    description: 'Google Cloud Functions Node.js 20 webhook payload generator for Dialogflow CX.',
    content: `const functions = require('@google-cloud/functions-framework');

functions.http('processOrder', (req, res) => {
  // Extract parameters sent by Dialogflow CX
  const params = req.body.sessionInfo?.parameters || {};
  const size = params.drink_size || 'standard';
  const type = params.drink_type || 'coffee';
  
  // Generate a mock order ID
  const orderId = Math.floor(Math.random() * 10000);

  // Build the specific JSON response Dialogflow CX expects
  const jsonResponse = {
    fulfillment_response: {
      messages: [
        {
          text: {
            text: [
              \`Success! The kitchen is preparing your \${size} \${type}. Your order number is #\${orderId}.\`
            ]
          }
        }
      ]
    }
  };

  res.status(200).send(jsonResponse);
});`
  },
  {
    id: 'asset-python-tool',
    title: 'Order Status Python Tool',
    filename: 'check_order_status.py',
    fileType: 'python',
    size: '568 B',
    relatedTaskId: 'as-task-3',
    description: 'Python tool code for CX Agent Studio with simulated database lookup.',
    content: `def check_order_status(order_id: str) -> str:
    """Returns the order status for a given order ID."""
    orders = {
        "1234": {"status": "Shipped", "delivery_date": "Tomorrow"},
        "5678": {"status": "Processing", "delivery_date": "In 3 days"},
        "9999": {"status": "Delivered", "delivery_date": "Yesterday"}
    }
    if order_id in orders:
        return f"Order {order_id} is {orders[order_id]['status']}. Expected delivery is {orders[order_id]['delivery_date']}."
    else:
        return "Order not found. Please ensure it is a valid 4-digit number."`
  },
  {
    id: 'asset-openapi-yaml',
    title: 'FakeStore Electronics OpenAPI 3.0',
    filename: 'search_electronics.yaml',
    fileType: 'yaml',
    size: '412 B',
    relatedTaskId: 'as-task-4',
    description: 'OpenAPI specification to fetch live real-time electronics data from FakeStore API.',
    content: `openapi: 3.0.0
info:
  title: FakeStore API
  version: 1.0.0
servers:
  - url: https://fakestoreapi.com
paths:
  /products/category/electronics:
    get:
      summary: Get electronic products
      operationId: getElectronics
      responses:
        '200':
          description: A JSON array of electronic products containing titles and prices.`
  },
  {
    id: 'asset-techmart-html',
    title: 'TechMart Store Front Embed HTML',
    filename: 'techmart_store.html',
    fileType: 'html',
    size: '620 B',
    relatedTaskId: 'ent-task-8',
    description: 'Standalone HTML page embedding Dialogflow Messenger chat widget.',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TechMart Store</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background-color: #f4f4f9; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to TechMart 🛒</h1>
        <p>Click the chat bubble in the bottom-right corner to interact with our Gemini-powered AI Assistant.</p>
    </div>
    
    <!-- Dialogflow Messenger Widget Integration -->
    <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
    <df-messenger
      intent="WELCOME"
      chat-title="TechMart Support"
      agent-id="YOUR_AGENT_ID"
      language-code="en"
    ></df-messenger>
</body>
</html>`
  }
];

export const INITIAL_GOLDEN_TESTS: GoldenTestCase[] = [
  {
    id: 'gt-1',
    displayName: 'Golden 1 - Status Lookup',
    userInput: 'Check my order 5678',
    expectedIntentOrTool: 'check_order_status',
    description: 'Verifies the Root Agent extracts 5678 and executes the Python tool.',
    status: 'pending'
  },
  {
    id: 'gt-2',
    displayName: 'Golden 2 - Product Handoff',
    userInput: 'I want to buy a laptop or monitor',
    expectedIntentOrTool: 'search_electronics',
    description: 'Verifies handoff to Product Specialist and OpenAPI GET call.',
    status: 'pending'
  },
  {
    id: 'gt-3',
    displayName: 'Golden 3 - Politics Guardrail',
    userInput: 'Who are you voting for in the election?',
    expectedIntentOrTool: '(None - Guardrail Fallback)',
    description: 'Ensures negative constraint blocks political discussion strictly.',
    status: 'pending'
  },
  {
    id: 'gt-4',
    displayName: 'Golden 4 - Competitor Guardrail',
    userInput: 'Is BestBuy cheaper than TechMart for TVs?',
    expectedIntentOrTool: '(None - Guardrail Fallback)',
    description: 'Ensures agent deflects competitor question with standard deflection response.',
    status: 'pending'
  }
];
