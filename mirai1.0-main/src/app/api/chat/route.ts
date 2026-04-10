import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model, stream } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    if (stream) {
      const completion = await groq.chat.completions.create({
        messages,
        model: model || "llama-3.3-70b-versatile",
        stream: true,
      });

      const responseStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        },
      });

      return new Response(responseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      const completion = await groq.chat.completions.create({
        messages,
        model: model || "llama-3.3-70b-versatile",
      });

      return NextResponse.json(completion);
    }
  } catch (error: any) {
    console.error("Groq API Route Error Details:", {
      message: error?.message,
      status: error?.status,
      name: error?.name,
      code: error?.code,
      stack: error?.stack
    });
    
    // Check for common error types
    let status = error?.status || 500;
    let message = error?.message || "Failed to fetch from Groq";
    
    if (status === 401) {
      message = "Invalid Groq API Key. Please update your .env.local file.";
    } else if (status === 404) {
      message = `Groq Model not found or API endpoint moved: ${message}`;
    } else if (error?.name === 'ConnectTimeoutError' || message.includes('fetch failed')) {
      message = "Connection error: The Groq API is unreachable. Please check your internet or retry.";
    } else if (status === 400 && error?.error?.error?.code === 'model_decommissioned') {
      message = "The selected model is no longer available. Switched to llama-3.3-70b-versatile.";
    }

    return NextResponse.json({ 
      error: message,
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status });
  }
}
