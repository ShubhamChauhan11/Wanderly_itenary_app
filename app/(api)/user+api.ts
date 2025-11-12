import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const SUPABASE_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}`;
    const SUPABASE_SERVICE_ROLE_KEY = `${process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY}`;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase env vars");
      return Response.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create a server-side Supabase client (use service role key on the server)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await request.json();
    const { name, email, clerkId } = body ?? {};

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields: name, email, clerkId" },
        { status: 400 }
      );
    }

    // Insert into 'users' table. Adjust column names if different (e.g., clerk_id).
    const { data, error } = await supabase
      .from("user")
      .insert([{ name, email, clerk_id: clerkId }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json(
        { error: "Database insert failed", details: error },
        { status: 500 }
      );
    }

    return Response.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
