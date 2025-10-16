import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface SummarizeRequest {
  text: string;
}

export async function POST(req: Request) {
  try {
    const { text }: SummarizeRequest = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required for summarization." }, { status: 400 });
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Summarize the following content in clear, concise bullet points.
      Keep the summary factual and well-structured.

      --- CONTENT ---
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    console.error("Gemini Error:", error);

    let message = "Unknown error occurred.";
    if (error instanceof Error) message = error.message;

    return NextResponse.json({
      error: `Error: Unable to generate summary with Gemini. ${message}`,
    }, { status: 500 });
  }
}