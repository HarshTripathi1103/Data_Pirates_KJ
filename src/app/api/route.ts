import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";

interface BlogInput {
  title: string;
  description: string;
  tone: string;
}

const blogPromptTemplate = `
Write a blog post based on the following parameters:
Title:{title}
Description:{description}
Tone:{tone}
 
Please write a well structured blog post that includes:
1. An engaging introduction
2. 3-4 main sections with relevant subheadings
3. A conclusion
4. Maintain the {tone} tone throughout
5. Include relevant examples and explanations

Blog Post:`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in env");
    return NextResponse.json(
      { error: "API key config error" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const { title, description, tone } = body as BlogInput;

    if (!title || !description || !tone) {
      return NextResponse.json(
        { error: "Missing require fileds" },
        { status: 400 },
      );
    }

    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      maxTokens: 4096,
    });

    const formattedPrompt = blogPromptTemplate
      .replace("{title}", title)
      .replace("{description}", description)
      .replace(/\{tone\}/g, tone);

    // console.log("sending prompt to groq", formattedPrompt);

    const response = await model.invoke(formattedPrompt);

    // console.log("raw groq response", response);

    if (!response) {
      throw new Error("no response from groq");
    }

    let content = "";
    if (typeof response === "string") {
      content = response;
    } else if (typeof response === "object" && response) {
      content = response.content as string;
    } else {
      // console.error("unexpected response format:", response);
      throw new Error("unexpected response format from groq");
    }

    content = content.trim();

    return NextResponse.json(
      {
        content,
        metadata: {
          model: "mixtral-8x7b-32768",
          tone,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    // console.error("error in generate route", error);
    return NextResponse.json({
      error: "Failed to generate blog content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
