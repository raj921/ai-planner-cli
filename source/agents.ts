import {Agent, AgentType} from './types.js';

export const agents: Record<AgentType, Agent> = {
	[AgentType.Explorer]: {
		type: AgentType.Explorer,
		name: 'Explorer',
		purpose: 'Initial reconnaissance and high-level understanding',
		capabilities: [
			'Quick directory exploration',
			'File structure analysis',
			'Web searches for up-to-date information',
			'Basic pattern recognition',
		],
		limitations: ['Read-only access', 'No deep code analysis'],
		idealFor: [
			'Understanding project structure',
			'Initial codebase exploration',
			'Quick information gathering',
		],
	},
	[AgentType.Architect]: {
		type: AgentType.Architect,
		name: 'Architect',
		purpose: 'Detailed technical design and exploration',
		capabilities: [
			'Deep codebase analysis',
			'Symbol and reference tracking',
			'Dependency mapping',
			'Design pattern identification',
		],
		limitations: ['Does not write implementation plans'],
		idealFor: [
			'Complex tasks requiring detailed understanding',
			'System design decisions',
			'Architecture-level changes',
		],
	},
	[AgentType.Planner]: {
		type: AgentType.Planner,
		name: 'Planner',
		purpose: 'File-by-file implementation planning',
		capabilities: [
			'Concrete modification plans',
			'Line-by-line change specifications',
			'Dependency ordering',
			'Step-by-step implementation guides',
		],
		limitations: ['Requires clear understanding of the approach'],
		idealFor: [
			'Straightforward implementation tasks',
			'Clear requirements with known approach',
			'Single-component changes',
		],
	},
	[AgentType.EngineeringTeam]: {
		type: AgentType.EngineeringTeam,
		name: 'Engineering Team',
		purpose: 'Multi-faceted analysis for large-scale changes',
		capabilities: [
			'Coordinating multiple agents',
			'Complex system-wide refactoring',
			'Cross-component analysis',
			'Parallel exploration and planning',
		],
		limitations: ['Requires more resources and time'],
		idealFor: [
			'Large-scale refactoring',
			'Multi-component features',
			'System-wide changes',
		],
	},
	[AgentType.DirectResponse]: {
		type: AgentType.DirectResponse,
		name: 'Direct Response',
		purpose: 'Immediate answers to questions',
		capabilities: [
			'Quick answers',
			'Explanations',
			'Documentation lookup',
			'Conceptual discussions',
		],
		limitations: ['No code analysis or implementation'],
		idealFor: [
			'General questions',
			'Concept explanations',
			'Documentation queries',
		],
	},
};
