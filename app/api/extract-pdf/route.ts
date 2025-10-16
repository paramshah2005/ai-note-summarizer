// app/api/extract-pdf/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Buffer } from "buffer";
import pdf from "pdf-extraction";

export async function POST(req: Request) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);
    return NextResponse.json({ text: data.text || "" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: "", error: "Failed to extract PDF text." }, { status: 500 });
  }
}