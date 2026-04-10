import { NextRequest, NextResponse } from "next/server";
const pdfParse = require("pdf-parse");
require("pdf-parse/worker");
const mammoth = require("mammoth");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let extractedText = "";

    if (fileName.endsWith(".pdf")) {
      const { PDFParse } = pdfParse;
      if (!PDFParse) throw new Error("PDFParse constructor not found in module");
      
      const parser = new PDFParse({ data: buffer });
      try {
        const result = await parser.getText();
        extractedText = result.text;
      } finally {
        await parser.destroy();
      }
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (fileName.endsWith(".doc")) {
      return NextResponse.json({ error: "Legacy .doc format not supported. Please save as .docx or .pdf" }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Unsupported file format. Please upload PDF or DOCX." }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text from document" }, { status: 422 });
    }
    
    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error("Document Parsing error:", error);
    return NextResponse.json({ error: `Parsing failed: ${error.message}` }, { status: 500 });
  }
}
