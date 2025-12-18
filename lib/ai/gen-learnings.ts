import { generateObject } from "ai";
import { z } from "zod";

import { ollamaQwen3 } from "../models";
import type { SearchResult } from "../types";

// Query is the initial user query, generated learning can be used
// in final output in accumulated research
const generateLearnings = async (query: string, searchResult: SearchResult) => {
	const { object } = await generateObject({
		model: ollamaQwen3,
		prompt: `The user is researching "${query}". The following search result was deemed relevant.
Generate a learning and upto 3 follow-up question from the following search result:

<search_result>
${JSON.stringify(searchResult)}
</search_result>`,
		schema: z.object({
			learning: z.string(),
			followUpQuestions: z.array(z.string()).min(1).max(3),
		}),
	});

	return object;
};

export default generateLearnings;
