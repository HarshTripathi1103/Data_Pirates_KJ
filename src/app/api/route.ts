
import { NextResponse } from "next/server";

interface BlogInput {
  title: string;
  description: string;
  tone: string;
}
const corsHeaders ={
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
export async function POST(req:Request){
  try {
    const body = await req.json();
    const {title,description,tone} =  body as BlogInput;
    if(!title || !description || !tone){
      return NextResponse.json(
        {error: "Missing required fileds"},
        {status: 400}
      );
    }
    const workerUrl = "https://groq-api-worker.tripathiharsh2026.workers.dev";

    const workerResponse = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title,description,tone})
    });

    if(!workerResponse.ok){
      const errorDetails = await workerResponse.json();
      throw new Error(`Worker responded with error: ${errorDetails}`);
    }
    const responseData = await workerResponse.json();
    return NextResponse.json(responseData, {status: 200});
  } catch(error){
       return NextResponse.json(
       {
        error: "Failed to fetch from Worker",
        details: error instanceof Error ? error.message : "An unexpected error occurred"
       },
       {status: 500}
       )
  }
}