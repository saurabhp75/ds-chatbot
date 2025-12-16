import { generateText } from "ai";
import { ollamaLlama } from "../models";
import type { Research } from "../types";

const generateReport = async (research: Research) => {
	const { text } = await generateText({
		model: ollamaLlama,
		prompt:
			"Generate a report based on the following research data:\n\n" +
			JSON.stringify(research, null, 2),
	});
	return text;
};

export default generateReport;
