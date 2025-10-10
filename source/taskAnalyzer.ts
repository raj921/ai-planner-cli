import {GoogleGenerativeAI} from '@google/generative-ai';
import {TaskAnalysis, TaskType, ComplexityLevel} from './types.js';

export class TaskAnalyzer {
	private genAI: GoogleGenerativeAI;
	private model: any;

	constructor(apiKey: string) {
		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({model: 'gemini-2.0-flash-exp'});
	}

	async analyze(query: string): Promise<TaskAnalysis> {
		const prompt = `Analyze this task and respond ONLY with valid JSON (no markdown, no code blocks):

Task: "${query}"

Respond with this exact JSON structure:
{
  "taskType": "question" | "code_change" | "exploration" | "refactoring" | "bug_fix" | "feature",
  "complexity": "simple" | "moderate" | "complex" | "large_scale",
  "requiresDesign": true | false,
  "affectedAreas": ["area1", "area2"],
  "estimatedFiles": number,
  "keywords": ["keyword1", "keyword2"]
}

Guidelines:
- taskType: "question" for general questions, "code_change" for modifications, "exploration" for understanding code
- complexity: "simple" (1-2 files), "moderate" (3-5 files), "complex" (6-10 files), "large_scale" (10+ files)
- requiresDesign: true if architectural decisions needed
- affectedAreas: components/modules affected
- estimatedFiles: rough count of files to modify
- keywords: key technical terms from the task`;

		const result = await this.model.generateContent(prompt);
		const response = result.response.text();
		
		const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
		
		try {
			return JSON.parse(cleanedResponse);
		} catch (error) {
			console.error('Failed to parse Gemini response:', cleanedResponse);
			return this.fallbackAnalysis(query);
		}
	}

	private fallbackAnalysis(query: string): TaskAnalysis {
		const lowerQuery = query.toLowerCase();
		const isQuestion =
			lowerQuery.includes('what') ||
			lowerQuery.includes('how') ||
			lowerQuery.includes('why') ||
			lowerQuery.includes('explain') ||
			lowerQuery.includes('?');

		return {
			taskType: isQuestion ? TaskType.Question : TaskType.CodeChange,
			complexity: ComplexityLevel.Moderate,
			requiresDesign: false,
			affectedAreas: ['unknown'],
			estimatedFiles: 1,
			keywords: query.split(' ').slice(0, 5),
		};
	}
}
