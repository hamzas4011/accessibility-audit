import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    const res = await fetch(url);
    const html = await res.text();

    return NextResponse.json({
      message: "Scan success",
      length: html.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch URL" },
      { status: 500 }
    );
  }
}