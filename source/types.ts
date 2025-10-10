export enum TaskType {
	Question = 'question',
	CodeChange = 'code_change',
	Exploration = 'exploration',
	Refactoring = 'refactoring',
	BugFix = 'bug_fix',
	Feature = 'feature',
}

export enum ComplexityLevel {
	Simple = 'simple',
	Moderate = 'moderate',
	Complex = 'complex',
	LargeScale = 'large_scale',
}

export enum AgentType {
	Explorer = 'explorer',
	Architect = 'architect',
	Planner = 'planner',
	EngineeringTeam = 'engineering_team',
	DirectResponse = 'direct_response',
}

export type Agent = {
	type: AgentType;
	name: string;
	purpose: string;
	capabilities: string[];
	limitations: string[];
	idealFor: string[];
};

export type TaskAnalysis = {
	taskType: TaskType;
	complexity: ComplexityLevel;
	requiresDesign: boolean;
	affectedAreas: string[];
	estimatedFiles: number;
	keywords: string[];
};

export type RoutingDecision = {
	selectedAgent: AgentType;
	reasoning: string[];
	confidence: number;
	alternativeAgent?: AgentType;
};

export type PlanningResult = {
	query: string;
	analysis: TaskAnalysis;
	routing: RoutingDecision;
	agent: Agent;
	estimatedSteps: string[];
};
