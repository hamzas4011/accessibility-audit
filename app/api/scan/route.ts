import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    // fetch HTML
    const res = await fetch(url);
    const html = await res.text();

    return NextResponse.json({ message: "Scan working", htmlLength: html.length });
  } catch (error) {
    return NextResponse.json({ error: "Failed to scan" }, { status: 500 });
  }
}