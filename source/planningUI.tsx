import React, {useState, useEffect} from 'react';
import {Box, Text, Newline} from 'ink';
import {PlanningLayer} from './planningLayer.js';
import {PlanningResult} from './types.js';

type Props = {
	query: string;
	apiKey: string;
};

export default function PlanningUI({query, apiKey}: Props) {
	const [result, setResult] = useState<PlanningResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [planPath, setPlanPath] = useState<string | null>(null);

	useEffect(() => {
		const process = async () => {
			try {
				const planningLayer = new PlanningLayer(apiKey);
				const planningResult = await planningLayer.process(query);
				setResult(planningResult);

				const savedPath = await planningLayer.generateAndSavePlan(
					planningResult,
				);
				setPlanPath(savedPath);
			} catch (err: any) {
				setError(err.message || 'Failed to process query');
			} finally {
				setLoading(false);
			}
		};

		process();
	}, [query, apiKey]);

	if (loading) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text bold color="cyan">
					 Planning Layer
				</Text>
				<Newline />
				<Text color="yellow">Analyzing task with Gemini AI 2.0 Flash...</Text>
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column" padding={1}>
				<Text bold color="red">
					 Error
				</Text>
				<Text color="red">{error}</Text>
			</Box>
		);
	}

	if (!result) {
		return null;
	}

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold color="cyan">
				 Planning Layer
			</Text>
			<Newline />

			<Box borderStyle="round" borderColor="blue" flexDirection="column" paddingX={1}>
				<Text bold color="white">
					 Query
				</Text>
				<Text color="gray">{result.query}</Text>
			</Box>
			<Newline />

			<Box borderStyle="round" borderColor="green" flexDirection="column" paddingX={1}>
				<Text bold color="white">
					 Task Analysis
				</Text>
				<Text>
					<Text color="cyan">Type: </Text>
					<Text color="white">{result.analysis.taskType}</Text>
				</Text>
				<Text>
					<Text color="cyan">Complexity: </Text>
					<Text color="white">{result.analysis.complexity}</Text>
				</Text>
				<Text>
					<Text color="cyan">Requires Design: </Text>
					<Text color="white">
						{result.analysis.requiresDesign ? 'Yes' : 'No'}
					</Text>
				</Text>
				<Text>
					<Text color="cyan">Estimated Files: </Text>
					<Text color="white">{result.analysis.estimatedFiles}</Text>
				</Text>
				<Text>
					<Text color="cyan">Affected Areas: </Text>
					<Text color="white">{result.analysis.affectedAreas.join(', ')}</Text>
				</Text>
			</Box>
			<Newline />

			<Box borderStyle="round" borderColor="magenta" flexDirection="column" paddingX={1}>
				<Text bold color="white">
					 Routing Decision
				</Text>
				<Text>
					<Text color="cyan">Selected Agent: </Text>
					<Text bold color="magenta">
						{result.agent.name}
					</Text>
				</Text>
				<Text>
					<Text color="cyan">Confidence: </Text>
					<Text color="white">
						{(result.routing.confidence * 100).toFixed(0)}%
					</Text>
				</Text>
				{result.routing.alternativeAgent && (
					<Text>
						<Text color="cyan">Alternative: </Text>
						<Text color="white">{result.routing.alternativeAgent}</Text>
					</Text>
				)}
				<Newline />
				<Text bold color="white">
					Reasoning:
				</Text>
				{result.routing.reasoning.map((reason, idx) => (
					<Text key={idx}>
						<Text color="gray">  • </Text>
						<Text color="white">{reason}</Text>
					</Text>
				))}
			</Box>
			<Newline />

			<Box borderStyle="round" borderColor="yellow" flexDirection="column" paddingX={1}>
				<Text bold color="white">
					 Agent: {result.agent.name}
				</Text>
				<Text>
					<Text color="cyan">Purpose: </Text>
					<Text color="white">{result.agent.purpose}</Text>
				</Text>
				<Newline />
				<Text bold color="white">
					Capabilities:
				</Text>
				{result.agent.capabilities.map((cap, idx) => (
					<Text key={idx}>
						<Text color="gray">  ✓ </Text>
						<Text color="white">{cap}</Text>
					</Text>
				))}
				<Newline />
				<Text bold color="white">
					Estimated Steps:
				</Text>
				{result.estimatedSteps.map((step, idx) => (
					<Text key={idx}>
						<Text color="gray">  {idx + 1}. </Text>
						<Text color="white">{step}</Text>
					</Text>
				))}
			</Box>
			<Newline />

			{planPath && (
				<Box borderStyle="round" borderColor="green" flexDirection="column" paddingX={1}>
					<Text bold color="green">
						✅ Plan Generated Successfully
					</Text>
					<Text>
						<Text color="cyan">Saved to: </Text>
						<Text bold color="white">
							{planPath}
						</Text>
					</Text>
					<Text color="gray">
						Review the plan and hand it off to an implementation agent.
					</Text>
				</Box>
			)}
		</Box>
	);
}
