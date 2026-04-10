import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const pdf = require("pdf-parse");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Convert file to buffer and parse text
    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      text = data.text;
    } else {
      // Fallback for plain text
      text = buffer.toString("utf-8");
    }

    // 2. Prompt Gemini for structured extraction
    const prompt = `
      You are an elite technical recruiter. Analyze the following resume text and extract key builder traits in JSON format.
      Return EXACTLY this JSON structure:
      {
        "displayName": "Full Name",
        "title": "Professional Title (e.g. Full Stack Architect)",
        "bio": "A 1-sentence punchy professional bio",
        "skills": [ {"name": "Skill", "value": 1-100} ],
        "experienceYears": number,
        "primaryStack": "e.g. Next.js / Python",
        "level": 1-10 (1=Beginner, 5=Mid, 8+=Senior/Architect)
      }

      RESUME TEXT:
      ${text.substring(0, 10000)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from potential markdown wrapping
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract valid JSON from AI response");
    }

    const structuredData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ 
      success: true, 
      data: { ...structuredData, rawText: text.substring(0, 5000) } 
    });

  } catch (error: any) {
    console.error("Resume Parse Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
