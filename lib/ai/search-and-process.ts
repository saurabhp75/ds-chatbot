import { generateObject, generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { ollamaQwen3 } from "../models";
import type { SearchResult } from "../types";
import searchWeb from "./search-web";

// This function searches web and evaluate every 
// LLM generated subquery 
const searchAndProcess = async (
	query: string,
	accumulatedSources: SearchResult[],
) => {
	const pendingSearchResults: SearchResult[] = [];
	const finalSearchResults: SearchResult[] = [];
	await generateText({
		model: ollamaQwen3,
		prompt: `Search the web for information about ${query}`,
		system:
			"You are a researcher. For each query, search the web and then evaluate if the results are relevant and will help in answering the query",
		stopWhen: stepCountIs(3),
		tools: {
			// TODO: This tool can be refactored to run deteministically outside
			// of the LLM loop. Also dedup the serach results.
			searchWeb: tool({
				description: "Search the web for information about a given query",
				inputSchema: z.object({
					query: z.string().min(1),
				}),
				execute: async ({ query }) => {
					const results = await searchWeb(query);
					pendingSearchResults.push(...results);
					return results;
				},
			}),
			// This tool 
			evaluate: tool({
				description: "Evaluate the search results",
				inputSchema: z.object({}),
				execute: async () => {
					const pendingResult = pendingSearchResults.pop();
					if (!pendingResult) {
						return "No pending search results to evaluate. Please search again with a more specific query.";
					}

					const { object: evaluation } = await generateObject({
						model: ollamaQwen3,
						prompt: `Evaluate whether the search results are relevant and help answer the following query: ${query}. If the page already exists in the existing results, mark it as irrelevant.\n
            <search_results>
            ${JSON.stringify(pendingResult)}
            </search_results>
			<search_results>
            ${JSON.stringify(accumulatedSources.map((result) => result.url))}
            </search_results>`,
						output: "enum",
						enum: ["relevant", "irrelevant"],
					});

					if (evaluation === "relevant") {
						finalSearchResults.push(pendingResult);
					}

					console.log("Found:", pendingResult.url);
					console.log("Evaluation completed:", evaluation);

					return evaluation === "irrelevant"
						? "Search results are irrelevant. Please search again with a more specific query."
						: "Search results are relevant. End research for this query.";
				},
			}),
		},
	});
	return finalSearchResults;
};

export default searchAndProcess;
