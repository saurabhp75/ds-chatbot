import { generateObject } from "ai";
import { z } from "zod";

import { ollamaQwen3 } from "../models";

type SearchResult = {
	title: string;
	url: string;
	content: string;
};

const generateLearnings = async (query: string, searchResult: SearchResult) => {
	const { object } = await generateObject({
		model: ollamaQwen3,
		prompt: `The user is researching "${query}". The following search result was deemed relevant.
Generate a learning and a follow-up question from the following search result:

<search_result>
${JSON.stringify(searchResult)}
</search_result>`,
		schema: z.object({
			learning: z.string(),
			followUpQuestions: z.array(z.string()),
		}),
	});

	return object;
};

export default generateLearnings;
