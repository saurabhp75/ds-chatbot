import Exa from "exa-js";
import { SearchResult } from "../types";

const exa = new Exa(process.env.EXA_API_KEY);

// Gives an array of search results for a given query
const searchWeb = async (query: string) => {
	const { results } = await exa.search(query, {
		numResults: 1,
		contents: {
			text: true,
			livecrawl: "fallback",
		},
	});

	console.log("### results from search query:\n");
	console.log({ results });

	return results.map((r) => ({
		title: r.title ?? "No title", // Title of the search result
		url: r.url,
		content: r.text,
	} as SearchResult));
};

export default searchWeb;
