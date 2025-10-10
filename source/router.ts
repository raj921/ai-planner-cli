import {GoogleGenerativeAI} from '@google/generative-ai';
import {
	TaskAnalysis,
	RoutingDecision,
	AgentType,
	TaskType,
	ComplexityLevel,
} from './types.js';
import {agents} from './agents.js';

export class Router {
	private genAI: GoogleGenerativeAI;
	private model: any;

	constructor(apiKey: string) {
		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({model: 'gemini-2.0-flash-exp'});
	}

	async route(
		query: string,
		analysis: TaskAnalysis,
	): Promise<RoutingDecision> {
		const agentDescriptions = Object.values(agents)
			.map(
				agent =>
					`- ${agent.type}: ${agent.purpose}\n  Ideal for: ${agent.idealFor.join(', ')}`,
			)
			.join('\n');

		const prompt = `You are a routing system for a planning layer.

Task: "${query}"

Analysis:
- Type: ${analysis.taskType}
- Complexity: ${analysis.complexity}
- Requires Design: ${analysis.requiresDesign}
- Estimated Files: ${analysis.estimatedFiles}
- Affected Areas: ${analysis.affectedAreas.join(', ')}

Available Agents:
${agentDescriptions}

Routing Rules:
1. direct_response: For general questions, explanations, no code involved
2. planner: For simple/moderate tasks with clear approach (1-5 files)
3. architect: For tasks needing design decisions or complex understanding (6-10 files)
4. engineering_team: For large-scale changes (10+ files) or system-wide refactoring
5. explorer: For initial codebase exploration (rarely used in final routing)

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "selectedAgent": "agent_type_here",
  "reasoning": ["reason 1", "reason 2", "reason 3"],
  "confidence": 0.85,
  "alternativeAgent": "optional_alternative_agent"
}`;

		const result = await this.model.generateContent(prompt);
		const response = result.response.text();
		
		const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
		
		try {
			return JSON.parse(cleanedResponse);
		} catch (error) {
			console.error('Failed to parse Gemini response:', cleanedResponse);
			return this.fallbackRouting(analysis);
		}
	}

	private fallbackRouting(analysis: TaskAnalysis): RoutingDecision {
		if (analysis.taskType === TaskType.Question) {
			return {
				selectedAgent: AgentType.DirectResponse,
				reasoning: ['Task is a question, no code changes needed'],
				confidence: 0.9,
			};
		}

		if (analysis.complexity === ComplexityLevel.LargeScale) {
			return {
				selectedAgent: AgentType.EngineeringTeam,
				reasoning: ['Large-scale task requiring coordinated effort'],
				confidence: 0.8,
			};
		}

		if (
			analysis.requiresDesign ||
			analysis.complexity === ComplexityLevel.Complex
		) {
			return {
				selectedAgent: AgentType.Architect,
				reasoning: ['Complex task requiring design decisions'],
				confidence: 0.75,
				alternativeAgent: AgentType.Planner,
			};
		}

		return {
			selectedAgent: AgentType.Planner,
			reasoning: ['Straightforward task with clear approach'],
			confidence: 0.85,
		};
	}
}
