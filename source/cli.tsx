#!/usr/bin/env node
import 'dotenv/config';
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import PlanningUI from './planningUI.js';
import InteractiveMode from './interactiveMode.js';

const cli = meow(
	`
	Usage
	  $ cli [query]
	  $ cli --interactive

	Options
		--api-key       Your Gemini API key (or set GEMINI_API_KEY env var)
		--interactive   Start interactive mode with input box

	Examples
	  $ cli "Add a dark mode toggle to the settings page"
	  $ cli "Refactor the authentication system to use JWT" --api-key=YOUR_KEY
	  $ cli --interactive
`,
	{
		importMeta: import.meta,
		flags: {
			apiKey: {
				type: 'string',
			},
			interactive: {
				type: 'boolean',
				default: false,
			},
		},
	},
);

const query = cli.input.join(' ');
const apiKey = cli.flags.apiKey ?? process.env['GEMINI_API_KEY'] ?? '';
const interactive = cli.flags.interactive;

if (!apiKey) {
	console.error('❌ Error: Please provide a Gemini API key via --api-key flag or GEMINI_API_KEY environment variable');
	console.log('\nGet your API key at: https://makersuite.google.com/app/apikey');
	process.exit(1);
}

if (interactive || !query) {
	render(<InteractiveMode apiKey={apiKey} />);
} else {
	render(<PlanningUI query={query} apiKey={apiKey} />);
}
