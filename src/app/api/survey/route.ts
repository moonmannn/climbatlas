import { createClient } from "@supabase/supabase-js";
import { parseSiteSurveySubmission } from "@/lib/siteSurvey";

export const runtime = "nodejs";

function response(body: Record<string, unknown>, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return response({ saved: false, error: "invalid-origin" }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return response({ saved: false, error: "invalid-content-type" }, 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 12000) return response({ saved: false, error: "request-too-large" }, 413);

  let input: unknown;
  try {
    // Read a bounded stream rather than buffering an arbitrarily large payload.
    const reader = request.body?.getReader();
    if (!reader) return response({ saved: false, error: "invalid-answers" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12000) {
        await reader.cancel();
        return response({ saved: false, error: "request-too-large" }, 413);
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response({ saved: false, error: "invalid-json" }, 400);
  }
  const submission = parseSiteSurveySubmission(input);
  if (!submission) return response({ saved: false, error: "invalid-answers" }, 400);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response({ saved: false, error: "temporarily-unavailable" }, 503);

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) }
    });
    const { error } = await supabase.rpc("submit_site_survey", {
      p_submission_id: submission.submissionId,
      p_version: submission.version,
      p_locale: submission.locale,
      p_answers: submission.answers,
      p_context: submission.context
    });
    if (error) {
      // Log the database code only; responses and logs never echo survey answers.
      console.error("Site survey storage failed", error.code);
      return response({ saved: false, error: "temporarily-unavailable" }, 503);
    }
    return response({ saved: true }, 201);
  } catch {
    return response({ saved: false, error: "temporarily-unavailable" }, 503);
  }
}
