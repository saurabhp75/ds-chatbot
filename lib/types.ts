export type SearchResult = {
	title: string;
	url: string;
	content: string;
};

type Learning = {
	learning: string;
	followUpQuestions: string[];
};

export type Research = {
	query: string | undefined;
	queries: string[];
	searchResults: SearchResult[];
	learnings: Learning[];
	completedQueries: string[];
};

export const accumulatedResearch: Research = {
	query: undefined,     // user prompt
	queries: [],          // generated search queries
	searchResults: [],    // all search results	
	learnings: [],        // all learnings from search results
	completedQueries: [], // all completed search queries
};
