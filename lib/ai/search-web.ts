import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

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
		title: r.title ?? "No title from exa API", // Title of the search result
		url: r.url,
		content: r.text,
	}));
};

export default searchWeb;
