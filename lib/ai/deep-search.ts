import fs from "node:fs";
import { accumulatedResearch } from "../types";
import generateLearnings from "./gen-learnings";
import generateReport from "./gen-report";
import { generateSearchQueries } from "./gen-search-queries";
import searchAndProcess from "./search-and-process";

const deepResearch = async (
	prompt: string,
	depth: number = 1,
	breadth: number = 3,
) => {
	if (!accumulatedResearch.query) {
		accumulatedResearch.query = prompt;
	}

	if (depth === 0) {
		return accumulatedResearch;
	}

	// Generate search queries based on the user prompt
	const queries = await generateSearchQueries(prompt, breadth);
	accumulatedResearch.queries = queries;

	// Process each search query and generate learnings
	for (const query of queries) {
		console.log(`Searching the web for: ${query}`);

		// Populate searchResults for the current query
		const searchResults = await searchAndProcess(
			query,
			accumulatedResearch.searchResults,
		);
		
		// Generate learnings for every search result 
		for (const searchResult of searchResults) {
			console.log(`Processing search result: ${searchResult.url}`);
			const learnings = await generateLearnings(query, searchResult);

			// Populate learnings and completedQueries
			accumulatedResearch.learnings.push(learnings);
			accumulatedResearch.completedQueries.push(query);

			// Call deepResearch recursively with decremented depth and breadth
			const newQuery = `Overall research goal: ${prompt}\n
        Previous search queries: ${accumulatedResearch.completedQueries.join(", ")}\n
        Follow-up questions: ${learnings.followUpQuestions.join(", ")}`;
			await deepResearch(newQuery, depth - 1, Math.ceil(breadth / 2));
		}
	}
};

// Example usage of deepResearch
const _main = async () => {
	const research = await deepResearch(
		"What do you need to be a D1 shotput athlete?",
	);

	if (!research) {
		console.log("No research generated.");
		return;
	}

	console.log("Research completed!");
	console.log("Generating report...");

	const report = await generateReport(research);
	console.log("Report generated! report.md");
	
	fs.writeFileSync("report.md", report);
};

export default deepResearch;
