// app/api/delete-trip/route.ts
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await request.json().catch(() => null);
    const clerkId = body?.clerkId;
    const tripId = body?.tripId;

    if (!clerkId || !tripId) {
      return new Response(
        JSON.stringify({ error: "Missing clerkId or tripId in body" }),
        {
          status: 400,
        }
      );
    }

    // 1) fetch existing trips for the user (if any)
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
      // No row for this clerkId
      return new Response(
        JSON.stringify({ error: "No trips found for this clerkId" }),
        {
          status: 404,
        }
      );
    }

    const existingTrips = Array.isArray(row.trips) ? row.trips : [];

    // If trips do not have id field, we cannot match — return 400
    const hasIdField = existingTrips.some(
      (t: any) => t && typeof t.id !== "undefined"
    );
    if (!hasIdField) {
      return new Response(
        JSON.stringify({
          error:
            "Trips entries do not contain an 'id' field. Cannot delete by tripId. Ensure trips are stored with an 'id' property.",
        }),
        { status: 400 }
      );
    }

    // Filter out the trip with matching id
    const updatedTrips = existingTrips.filter(
      (t: any) => String(t.id) !== String(tripId)
    );

    // If nothing changed, return 404 (trip not found)
    if (updatedTrips.length === existingTrips.length) {
      return new Response(JSON.stringify({ error: "Trip not found" }), {
        status: 404,
      });
    }

    // Update the row with the new trips array
    const { data: updatedRow, error: updateErr } = await supabase
      .from("user_trips")
      .update({ trips: updatedTrips })
      .eq("clerk_id", clerkId)
      .select()
      .maybeSingle();

    if (updateErr) {
      console.error("DB update error:", updateErr);
      return new Response(
        JSON.stringify({ error: "DB update failed", details: updateErr }),
        {
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify({ data: updatedRow }), { status: 200 });
  } catch (err) {
    console.error("Unhandled error in POST /api/delete-trip:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
