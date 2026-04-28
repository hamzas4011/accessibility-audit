import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { source as axeSource } from "axe-core";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AccessibilityAudit/1.0)" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL (HTTP ${res.status})` }, { status: 400 });
    }

    const html = await res.text();

    const dom = new JSDOM(html, {
      url,
      runScripts: "outside-only",
    });

    // Inject axe-core into the jsdom window, then run it
    dom.window.eval(axeSource);
    const results: any = await (dom.window as any).axe.run(dom.window.document);

    return NextResponse.json({
      violations: results.violations.map((v: any) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n: any) => ({
          html: n.html,
          failureSummary: n.failureSummary,
        })),
      })),
      passesCount: results.passes.length,
      incompleteCount: results.incomplete.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to scan URL" }, { status: 500 });
  }
}
