// app/api/get-trips/route.ts
import { createClient } from "@supabase/supabase-js";

/**
 * GET /api/get-trips?clerkId=<clerk_id>
 * Returns the trips JSON array for the given clerk_id from the user_trips table.
 *
 * Notes:
 * - This is a server-side route and uses the SUPABASE_SERVICE_ROLE_KEY env var.
 * - Caller must provide clerkId as a query parameter. If you prefer POST, swap to reading request.json().
 */

export async function GET(request: Request) {
  try {
    const SUPABASE_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}`;
    const SUPABASE_SERVICE_ROLE_KEY = `${process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
        }
      );
    }

    const url = new URL(request.url);
    const clerkId = url.searchParams.get("clerkId");

    if (!clerkId) {
      return new Response(
        JSON.stringify({ error: "Missing query parameter: clerkId" }),
        {
          status: 400,
        }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: row, error: selectErr } = await supabase
      .from("user_trips")
      .select("trips")
      .eq("clerk_id", clerkId)
      .maybeSingle();

    if (selectErr) {
      console.error("DB select error:", selectErr);
      return new Response(
        JSON.stringify({ error: "DB select failed", details: selectErr }),
        {
          status: 500,
        }
      );
    }

    if (!row) {
      return new Response(JSON.stringify({ trips: [] }), { status: 200 });
    }

    // Ensure we return a JSON array for trips (default to empty array if null)
    const trips = Array.isArray(row.trips) ? row.trips : [];

    return new Response(JSON.stringify({ trips }), { status: 200 });
  } catch (err) {
    console.error("Unhandled error in GET /api/get-trips:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
