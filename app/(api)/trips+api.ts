// app/api/append-trip/route.ts
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const SUPABASE_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}`;
    const SUPABASE_SERVICE_ROLE_KEY = `${process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await request.json().catch(() => null);
    const { clerkId, trip } = body ?? {};

    if (!clerkId)
      return new Response(JSON.stringify({ error: "Missing clerkId" }), {
        status: 400,
      });
    if (!trip || typeof trip !== "object")
      return new Response(JSON.stringify({ error: "Missing/invalid trip" }), {
        status: 400,
      });

    // Optional: light validation on trip id/title
    if (!("id" in trip) || typeof trip.id !== "string") {
      // you can allow missing id, but recommended to provide one
      trip.id = `trip_${Date.now()}`; // fallback id
    }

    // Prefer atomic RPC (append on DB side)
    const { data: rpcData, error: rpcErr } = await supabase.rpc(
      "append_trip_for_clerk",
      { p_clerk_id: clerkId, p_trip: trip }
    );

    if (rpcErr) {
      console.error("RPC error:", rpcErr);
      // fallback to safe read->update (best-effort) if RPC missing
      const { data: row, error: selErr } = await supabase
        .from("user_trips")
        .select("trips")
        .eq("clerk_id", clerkId)
        .maybeSingle();

      if (selErr) {
        console.error("Select fallback error:", selErr);
        return new Response(
          JSON.stringify({ error: "DB select failed", details: selErr }),
          { status: 500 }
        );
      }

      if (!row) {
        const { data: inserted, error: insertErr } = await supabase
          .from("user_trips")
          .insert([{ id: clerkId, clerk_id: clerkId, trips: [trip] }])
          .select()
          .maybeSingle();
        if (insertErr) {
          console.error("Fallback insert error:", insertErr);
          return new Response(
            JSON.stringify({ error: "DB insert failed", details: insertErr }),
            { status: 500 }
          );
        }
        return new Response(JSON.stringify({ data: inserted }), {
          status: 201,
        });
      }

      const existing = Array.isArray(row.trips) ? row.trips : [];
      let updatedTrips;

      //for replacing
      const existingIndex = existing.findIndex((t: any) => t.id === trip.id);

      if (existingIndex !== -1) {
        // Trip exists → replace it
        updatedTrips = [...existing];
        updatedTrips[existingIndex] = trip;
      } else {
        // Trip doesn't exist → append it
        updatedTrips = [...existing, trip];
      }
      //for replacing

      const { data: updated, error: updateErr } = await supabase
        .from("user_trips")
        .update({ trips: updatedTrips })
        .eq("clerk_id", clerkId)
        .select()
        .maybeSingle();

      if (updateErr) {
        console.error("Fallback update error:", updateErr);
        return new Response(
          JSON.stringify({ error: "DB update failed", details: updateErr }),
          { status: 500 }
        );
      }

      return new Response(JSON.stringify({ data: updated }), { status: 200 });
    }

    // RPC succeeded
    return new Response(JSON.stringify({ data: rpcData }), { status: 200 });
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
