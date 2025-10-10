import {TaskAnalyzer} from './taskAnalyzer.js';
import {Router} from './router.js';
import {PlanGenerator} from './planGenerator.js';
import {PlanningResult, AgentType} from './types.js';
import {agents} from './agents.js';

export class PlanningLayer {
	private analyzer: TaskAnalyzer;
	private router: Router;
	private planGenerator: PlanGenerator;

	constructor(apiKey: string) {
		this.analyzer = new TaskAnalyzer(apiKey);
		this.router = new Router(apiKey);
		this.planGenerator = new PlanGenerator(apiKey);
	}

	async process(query: string): Promise<PlanningResult> {
		const analysis = await this.analyzer.analyze(query);
		const routing = await this.router.route(query, analysis);
		const agent = agents[routing.selectedAgent];

		const estimatedSteps = this.generateEstimatedSteps(routing.selectedAgent);

		return {
			query,
			analysis,
			routing,
			agent,
			estimatedSteps,
		};
	}

	async generateAndSavePlan(
		result: PlanningResult,
		outputDir: string = '.',
	): Promise<string> {
		return this.planGenerator.savePlan(result, outputDir);
	}

	private generateEstimatedSteps(agentType: AgentType): string[] {
		switch (agentType) {
			case AgentType.DirectResponse:
				return ['Provide direct answer to the question'];
			case AgentType.Planner:
				return [
					'Review affected files',
					'Create line-by-line modification plan',
					'Specify dependency order',
					'Hand off to implementation',
				];
			case AgentType.Architect:
				return [
					'Deep dive into codebase structure',
					'Map dependencies and relationships',
					'Design technical approach',
					'Create architecture document',
					'Hand off to Planner for implementation plan',
				];
			case AgentType.EngineeringTeam:
				return [
					'Coordinate multiple specialized agents',
					'Parallel analysis of affected areas',
					'System-wide impact assessment',
					'Create comprehensive refactoring plan',
					'Execute changes across components',
				];
			case AgentType.Explorer:
				return [
					'Explore directory structure',
					'Identify key components',
					'Determine next agent for handoff',
				];
			default:
				return ['Process task'];
		}
	}
}
