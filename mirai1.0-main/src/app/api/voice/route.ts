import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scriptPath = path.join(process.cwd(), "src", "scripts", "voice_reply.py");
    
    return new Promise<NextResponse>((resolve) => {
      const pythonProcess = spawn("python", [scriptPath], {
        env: { ...process.env },
      });

      let stdoutData = "";
      let stderrData = "";

      pythonProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python Voice Error:", stderrData);
          resolve(NextResponse.json({ error: "Voice module crashed", details: stderrData }, { status: 500 }));
          return;
        }

        try {
          const result = JSON.parse(stdoutData.trim());
          if (result.error) {
            resolve(NextResponse.json({ error: result.error, trace: result.trace }, { status: 500 }));
          } else {
            resolve(NextResponse.json(result));
          }
        } catch (e: any) {
          console.error("Failed to parse python output:", stdoutData);
          resolve(NextResponse.json({ error: "Invalid JSON from voice module", raw: stdoutData }, { status: 500 }));
        }
      });

      // Send the payload to python via stdin
      pythonProcess.stdin.write(JSON.stringify(body));
      pythonProcess.stdin.end();
    });

  } catch (error: any) {
    console.error("Voice API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
