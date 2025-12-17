// import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import "dotenv/config";
import { ollamaLlama } from "../models";

// const mainModel = openai("gpt-4o");
export const generateSearchQueries = async (query: string, n: number = 3) => {
	const result = await generateObject({
		model: ollamaLlama,
		prompt: `Generate ${n} search queries for the following query:\n ${query}`,
		schema: z.object({
			queries: z.array(z.string()).min(1).max(5),
		}),
	});
	return result.object.queries;
};
