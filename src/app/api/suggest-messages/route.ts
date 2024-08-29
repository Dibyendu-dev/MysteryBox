import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      " Create a list of three open-ended and engaging questions formated as a single string. each question should be separated by '||'. these questions are for an anonymous social messaging platyform, like Qooh.me, and should be suitable for a diverse audience. avoid personal or sensitive topics, focusing instead on universal themes and encourage friendly interaction. for example, your output shold be structured like this: 'what;s hobby you've recently started?||if you could have dinner with any hisorical figure,who whould it be?||what's a simple thing that makes you happy?' . ensure  the questions are intriguing , foster curiosity, and contribute to a positive and welcoming conversational enviroment. ";

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        max_tokens: 400,
        stream: true,
        prompt,
      });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status }
      );
    } else {
      console.log("an unexpected error is occured", error);
      throw error;
    }
  }
}
