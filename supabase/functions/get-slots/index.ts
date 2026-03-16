import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("date"); // YYYY-MM-DD

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing or invalid date param (YYYY-MM-DD)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch available slots from calendar_events for the given date
    const { data: availableEvents, error: dbError } = await supabase
      .from("calendar_events")
      .select("slot_time")
      .eq("status", "available")
      .gte("slot_time", `${dateStr}T00:00:00+05:30`)
      .lt("slot_time", `${dateStr}T23:59:59+05:30`)
      .order("slot_time", { ascending: true });

    if (dbError) {
      console.error("DB query error:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch slots" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter out past slots and format for the frontend
    const now = new Date();
    const slots = (availableEvents || [])
      .filter((row) => new Date(row.slot_time) > now)
      .map((row) => {
        const d = new Date(row.slot_time);
        return {
          dateTime: row.slot_time,
          display: d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          }),
        };
      });

    return new Response(
      JSON.stringify({ success: true, date: dateStr, slots }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("get-slots error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
