import React, {useState} from 'react';
import {Box, Text, Newline, useApp, useInput} from 'ink';
import TextInput from 'ink-text-input';
import {PlanningLayer} from './planningLayer.js';
import {PlanningResult} from './types.js';

type Props = {
	apiKey: string;
};

type QueryResult = {
	query: string;
	result: PlanningResult;
	planPath: string;
};

export default function InteractiveMode({apiKey}: Props) {
	const [query, setQuery] = useState('');
	const [history, setHistory] = useState<QueryResult[]>([]);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {exit} = useApp();

	useInput((input, key) => {
		if (key.escape || (input === 'q' && !processing)) {
			exit();
		}
	});

	const handleSubmit = async (value: string) => {
		if (!value.trim() || processing) return;

		setProcessing(true);
		setError(null);

		try {
			const planningLayer = new PlanningLayer(apiKey);
			const planningResult = await planningLayer.process(value);
			const savedPath = await planningLayer.generateAndSavePlan(planningResult);

			setHistory([
				...history,
				{
					query: value,
					result: planningResult,
					planPath: savedPath,
				},
			]);
			setQuery('');
		} catch (err: any) {
			setError(err.message || 'Failed to process query');
		} finally {
			setProcessing(false);
		}
	};

	return (
		<Box flexDirection="column" padding={1}>
			<Box borderStyle="round" borderColor="cyan" paddingX={1}>
				<Text bold color="cyan">
					Planning Layer - Interactive Mode
				</Text>
			</Box>
			<Text color="gray" dimColor>
				Type your query and press Enter. Press ESC or 'q' to quit.
			</Text>
			<Newline />

			{history.map((item, idx) => (
				<Box key={idx} flexDirection="column" marginBottom={1}>
					<Box borderStyle="single" borderColor="blue" flexDirection="column" paddingX={1}>
						<Text color="cyan">Query: </Text>
						<Text color="white">{item.query}</Text>
						<Newline />
						<Text color="green">✅ Agent: </Text>
						<Text bold color="magenta">
							{item.result.agent.name}
						</Text>
						<Text color="gray"> ({item.result.analysis.complexity})</Text>
						<Newline />
						<Text color="green">📄 Plan saved: </Text>
						<Text color="white">{item.planPath}</Text>
					</Box>
					<Newline />
				</Box>
			))}

			{processing && (
				<Box>
					<Text color="yellow">⏳ Analyzing and generating plan...</Text>
				</Box>
			)}

			{error && (
				<Box borderStyle="round" borderColor="red" paddingX={1} marginBottom={1}>
					<Text color="red">❌ Error: {error}</Text>
				</Box>
			)}

			<Box
				borderStyle="round"
				borderColor={processing ? 'gray' : 'green'}
				paddingX={1}
			>
				<Text color="green" bold>
					{'>'}
				</Text>
				<Text> </Text>
				{!processing && (
					<TextInput
						value={query}
						onChange={setQuery}
						onSubmit={handleSubmit}
						placeholder="Enter your query..."
					/>
				)}
				{processing && <Text color="gray">Processing...</Text>}
			</Box>
		</Box>
	);
}
