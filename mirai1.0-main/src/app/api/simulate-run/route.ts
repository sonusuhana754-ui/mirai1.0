import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    const systemPrompt = `You are the Mirai Neural Runtime, a highly advanced code execution simulator.
    Your task is to analyze the provided code and predict exactly what its output would be if run in a standard environment.
    
    RULES:
    1. If the code is correct, provide the EXACT stdout.
    2. If there are syntax or logic errors, provide the EXACT stderr or error message that a real compiler/interpreter would throw.
    3. Provide an exitCode (0 for success, non-zero for failure).
    4. Provide a very brief "explanation" for the Mirai Mentor.
    
    RETURN ONLY A VALID JSON OBJECT:
    {
      "stdout": "string",
      "stderr": "string",
      "exitCode": number,
      "explanation": "string"
    }
    
    Current Environment: 
    Language: ${language}
    Code:
    \`\`\`${language}
    ${code}
    \`\`\``;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Low temperature for deterministic output
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Neural Runtime Error:", error);
    return NextResponse.json({ 
      error: "Neural Link Divergence", 
      stderr: error.message,
      exitCode: 1 
    }, { status: 500 });
  }
}
