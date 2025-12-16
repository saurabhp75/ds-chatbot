import {
	convertToModelMessages,
	type InferUITools,
	stepCountIs,
	streamText,
	tool,
	type UIMessage,
} from "ai";
import { z } from "zod";
import { ollamaDeepSeek } from "@/lib/models";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const tools = {
	fetch_weather_data: tool({
		description: "Fetch weather information for a specific location",
		inputSchema: z.object({
			location: z.string().describe("The location to get weather for"),
			units: z
				.enum(["celsius", "fahrenheit"])
				.default("celsius")
				.describe("Temperature units"),
		}),
		execute: async ({ location, units }) => {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			const temp =
				units === "celsius"
					? Math.floor(Math.random() * 35) + 5
					: Math.floor(Math.random() * 63) + 41;
			return {
				location,
				temperature: `${temp}°${units === "celsius" ? "C" : "F"}`,
				conditions: "Sunny",
				humidity: `12%`,
				windSpeed: `35 ${units === "celsius" ? "km/h" : "mph"}`,
				lastUpdated: new Date().toLocaleString(),
			};
		},
	}),
};

export type MyUIMessage = UIMessage<never, never, InferUITools<typeof tools>>;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();
	const result = streamText({
		// model: webSearch ? "perplexity/sonar" : model,
		// model: ollamaLlama,
		model: ollamaDeepSeek,
		messages: convertToModelMessages(messages),
		tools,
		stopWhen: stepCountIs(3),
		system:
			"You are a helpful assistant that can answer questions and help with tasks",
	});
	// send sources and reasoning back to the client
	return result.toUIMessageStreamResponse({
		sendSources: true,
		sendReasoning: true,
	});
}
