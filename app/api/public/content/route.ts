import { NextRequest } from "next/server";
import { corsHeaders, getPortfolioContent } from "@/lib/content/service";
import { jsonResponse } from "@/lib/utils";

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders(request.headers.get("origin"));

  try {
    const content = await getPortfolioContent();
    if (!content) {
      return jsonResponse({ error: "No content published yet" }, 404);
    }
    return Response.json(content, { headers });
  } catch (error) {
    console.error("[public/content]", error);
    return Response.json(
      { error: "Failed to load content" },
      { status: 500, headers },
    );
  }
}
