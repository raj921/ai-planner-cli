# Traycer Clone - AI Planning Layer

A simplified implementation of Traycer AI's planning layer concept, built with TypeScript and powered by Google's Gemini AI 2.0 Flash.

## 🎯 What is This?

This project demonstrates the core concept behind Traycer AI: **an intelligent planning layer that sits on top of coding agents**. Instead of directly executing tasks, it analyzes them first and routes them to specialized agents based on complexity, scope, and requirements.

## 🧠 How It Works

```
User Query → Planning Layer → Agent Selection → Execution Plan
                    ↓
            ┌──────────────┐
            │ Task Analyzer│ (Gemini AI)
            └──────┬───────┘
                   ↓
            ┌──────────────┐
            │    Router    │ (Gemini AI)
            └──────┬───────┘
                   ↓
        ┌──────────┴──────────┐
        ↓                     ↓
   Simple Task          Complex Task
        ↓                     ↓
    Planner             Architect/Team
```

### Multi-Tiered Architecture

The planning layer uses specialized agents, each with distinct responsibilities:

#### 1. **Explorer** 
- **Purpose**: Initial reconnaissance and high-level understanding
- **Best For**: Quick exploration, file structure analysis
- **Limitations**: Read-only access, no deep code analysis

#### 2. **Planner**
- **Purpose**: File-by-file implementation planning
- **Best For**: Simple/moderate tasks (1-5 files) with clear approach
- **Capabilities**: Line-by-line change specs, dependency ordering

#### 3. **Architect**
- **Purpose**: Detailed technical design and exploration
- **Best For**: Complex tasks (6-10 files) requiring design decisions
- **Capabilities**: Deep codebase analysis, dependency mapping, design patterns

#### 4. **Engineering Team**
- **Purpose**: Multi-faceted analysis for large-scale changes
- **Best For**: Large-scale tasks (10+ files), system-wide refactoring
- **Capabilities**: Multi-agent coordination, parallel analysis

#### 5. **Direct Response**
- **Purpose**: Immediate answers to questions
- **Best For**: General questions, explanations, no code changes

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone and navigate to the project
cd my-cli-ts

# Install dependencies
npm install

# Build the project
npm run build

# Set up your API key
export GEMINI_API_KEY="your_api_key_here"
# OR create a .env file (see .env.example)
```

### Usage

**Interactive Mode (Recommended):**
```bash
# Start interactive mode with input box
node dist/cli.js --interactive

# Or simply run without arguments
node dist/cli.js
```

**Single Query Mode:**
```bash
# Run with a query
node dist/cli.js "Add a dark mode toggle to the settings page"

# Or pass API key directly
node dist/cli.js "Refactor authentication to use JWT" --api-key=YOUR_KEY

# Ask a question
node dist/cli.js "How does user authentication work in this codebase?"
```

## ✨ Interactive Mode Features

The interactive mode provides a **conversational interface** with:

- 📝 **Input box** - Type queries directly in the terminal
- 📜 **Query history** - See all your previous queries and results
- 🤖 **Agent routing** - Each query shows which agent was selected
- 📄 **Auto-saved plans** - Each query generates a `planning.md` file
- ⚡ **Fast iteration** - No need to restart the CLI for each query
- 🚪 **Easy exit** - Press ESC or 'q' to quit anytime

```bash
# Start interactive mode
node dist/cli.js --interactive
```

## 📊 What You Get

When you run a query (in either mode), the planning layer:

1. **Analyzes the task** using Gemini AI
   - Determines task type (question, code change, refactoring, etc.)
   - Assesses complexity level (simple, moderate, complex, large-scale)
   - Identifies affected areas and estimated file count

2. **Routes to appropriate agent**
   - Selects the best agent based on analysis
   - Provides reasoning for the decision
   - Suggests alternative agents if applicable

3. **Generates execution plan**
   - Lists estimated steps for the selected agent
   - Shows agent capabilities and limitations

4. **Creates `planning.md` file** 🆕
   - Detailed, AI-generated implementation plan
   - Structured markdown document ready for handoff
   - Includes task analysis, routing decisions, and step-by-step instructions
   - Can be given to any coding agent (Cursor, Claude, Windsurf, etc.) for implementation

## 🏗️ Architecture

### Core Components

```
source/
├── types.ts           # Type definitions for the planning layer
├── agents.ts          # Agent definitions and capabilities
├── taskAnalyzer.ts    # Gemini-powered task analysis
├── router.ts          # Gemini-powered agent routing
├── planGenerator.ts   # Generates planning.md files 🆕
├── planningLayer.ts   # Main orchestrator
├── planningUI.tsx     # CLI interface (Ink/React)
└── cli.tsx            # Entry point
```

### Key Design Decisions

1. **Gemini AI Integration**: Uses Gemini 2.0 Flash for fast, intelligent analysis and routing decisions
2. **TypeScript**: Type-safe implementation with clear interfaces
3. **CLI with Ink**: Beautiful terminal UI using React components
4. **Separation of Concerns**: Each agent has well-defined responsibilities
5. **JSON-based Communication**: Structured responses from Gemini AI

## 🎨 Why This Approach?

The planning layer provides several benefits:

- **✅ Efficient Resource Usage**: Don't use heavy agents for simple tasks
- **✅ Better Decision Making**: AI analyzes before acting
- **✅ Clear Responsibility Boundaries**: Each agent specializes in specific types of work
- **✅ Faster Response Times**: Right-sized solutions for each problem
- **✅ Scalable Architecture**: Easy to add new agents or modify routing logic

## 🔧 Tech Stack

- **TypeScript**: Type-safe implementation
- **Node.js**: Runtime environment
- **Gemini AI 2.0 Flash**: Intelligent task analysis and routing
- **Ink**: React for CLI interfaces
- **Meow**: CLI argument parsing

## 📝 Example Scenarios

### Scenario 1: Simple Feature Addition
```bash
$ traycer-clone "Add a logout button to the navbar"

Analysis:
- Type: feature
- Complexity: simple
- Estimated Files: 1-2

Selected Agent: Planner
Reasoning: Straightforward UI change, clear implementation path
```

### Scenario 2: Complex Refactoring
```bash
$ traycer-clone "Refactor the entire authentication system to use OAuth 2.0"

Analysis:
- Type: refactoring
- Complexity: large_scale
- Estimated Files: 15+

Selected Agent: Engineering Team
Reasoning: System-wide changes, multiple components affected, requires coordination
```

### Scenario 3: Question
```bash
$ traycer-clone "How does the caching layer work?"

Analysis:
- Type: question
- Complexity: simple

Selected Agent: Direct Response
Reasoning: No code changes needed, requires explanation only
```

## 📄 The `planning.md` File

After analyzing your query, the tool generates a comprehensive `planning.md` file that includes:

### Structure

```markdown
# Implementation Plan

**Generated by:** [Agent Name]
**Date:** [Timestamp]
**Query:** [Your original query]

## Task Analysis
- Type, complexity, estimated files, affected areas

## Agent Selection
- Selected agent with routing reasoning
- Confidence score
- Alternative agent (if applicable)

## Detailed Plan
- [AI-generated, agent-specific implementation plan]
- For Planner: File-by-file changes with specific steps
- For Architect: Architecture overview, design decisions, phases
- For Engineering Team: Multi-workstream coordination plan
- For Explorer: Codebase discovery and recommendations
- For Direct Response: Detailed answer with examples

## Agent Capabilities
- Purpose, capabilities, limitations, ideal use cases
```

### How to Use the Plan

1. **Review**: Read the generated `planning.md` file
2. **Refine**: Adjust or add details as needed
3. **Handoff**: Give the plan to your implementation agent:
   - Cursor: Open the file and ask it to implement
   - Claude: Copy the plan into your conversation
   - Windsurf/Cody: Use as context for implementation
4. **Execute**: Let the agent implement following the plan
5. **Verify**: Check that implementation matches the plan

This workflow mirrors Traycer's approach: **Plan → Review → Execute → Verify**

## 🧪 Development

```bash
# Watch mode for development
npm run dev

# Build
npm run build

# Run tests
npm test
```


