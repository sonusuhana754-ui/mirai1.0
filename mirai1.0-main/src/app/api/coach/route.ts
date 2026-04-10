import { NextRequest, NextResponse } from "next/server";
import { spawn, ChildProcess } from "child_process";
import path from "path";

// Keep a global reference to the process for the dev server
// so we can kill it when requested.
declare global {
  var __coachProcess: ChildProcess | undefined;
  var __coachLastError: string | undefined;
  var __coachTranscript: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { action, mode } = await req.json();

    if (action === "start") {
      if (global.__coachProcess) {
        return NextResponse.json({ message: "Process already running" }, { status: 400 });
      }

      global.__coachLastError = undefined;
      global.__coachTranscript = [];
      const scriptPath = path.join(process.cwd(), "src", "scripts", "live_coach.py");
      
      // Attempt to spawn python, fallback to python3
      let pythonProcess: ChildProcess;
      try {
        pythonProcess = spawn("python", [scriptPath, "--mode", mode || "none"], {
          env: { ...process.env },
        });

        // Basic check if it successfully spawned
        pythonProcess.on("error", (err: any) => {
          if (err.code === 'ENOENT') {
             console.warn("Python 'python' not found, trying 'python3'...");
             // This doesn't catch immediately because spawn is async, 
             // but we handle it in the next attempt or via global error.
          }
          global.__coachLastError = `Spawn Error: ${err.message}`;
        });

      } catch (e: any) {
        return NextResponse.json({ error: `Could not start Python: ${e.message}` }, { status: 500 });
      }

      pythonProcess.stdout?.on("data", (data) => {
        const text = data.toString();
        console.log(`[Gemini Coach] ${text}`);
        if (global.__coachTranscript) {
          global.__coachTranscript.push(text);
        }
      });

      pythonProcess.stderr?.on("data", (data) => {
        const errStr = data.toString();
        console.error(`[Gemini Coach Error] ${errStr}`);
        global.__coachLastError = errStr;
      });

      pythonProcess.on("close", (code) => {
        console.log(`[Gemini Coach] exited with code ${code}`);
        global.__coachProcess = undefined;
        if (code !== 0 && !global.__coachLastError) {
          global.__coachLastError = `Process exited with code ${code}`;
        }
      });

      global.__coachProcess = pythonProcess;
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for startup

      if (!global.__coachProcess && global.__coachLastError) {
        return NextResponse.json({ error: global.__coachLastError }, { status: 500 });
      }

      return NextResponse.json({ message: "Voice agent started", pid: pythonProcess.pid });
    }

    if (action === "stop") {
      if (global.__coachProcess) {
        global.__coachProcess.kill("SIGINT");
        global.__coachProcess = undefined;
        global.__coachLastError = undefined;
        return NextResponse.json({ message: "Voice agent stopped" });
      } else {
        return NextResponse.json({ message: "No active process found" }, { status: 400 });
      }
    }

    if (action === "status") {
      return NextResponse.json({ 
        active: !!global.__coachProcess,
        output: global.__coachTranscript || [],
        error: global.__coachLastError 
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("Coach API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
