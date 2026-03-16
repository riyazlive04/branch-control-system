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
    const {
      name,
      email,
      phone,
      countryCode,
      businessType,
      website,
      challenge,
      automateProcess,
      dateTime,
      lp_name,
    } = await req.json();

    if (!name || !email || !dateTime) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields (name, email, dateTime)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── Step 1: Atomically reserve the slot ───────────────────────────────
    // Only updates if status is still 'available' — prevents double bookings
    const { data: reserved, error: reserveError } = await supabase
      .from("calendar_events")
      .update({ status: "booked" })
      .eq("slot_time", dateTime)
      .eq("status", "available")
      .select("id")
      .maybeSingle();

    if (reserveError) {
      console.error("Reserve error:", reserveError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to reserve slot" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!reserved) {
      return new Response(
        JSON.stringify({ success: false, error: "Slot already booked or unavailable" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Step 2: Insert lead into leads table ──────────────────────────────
    const leadRow = {
      name,
      email,
      phone,
      country_code: countryCode,
      business_type: businessType,
      website: website || null,
      challenge: challenge || null,
      automate_process: automateProcess || null,
      meeting_time: dateTime,
      lp_name: lp_name || null,
    };
    console.log("Inserting lead:", JSON.stringify(leadRow));

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadRow)
      .select("id")
      .single();

    if (leadError) {
      console.error("Lead insert error:", JSON.stringify(leadError));
      // Rollback: release the slot
      await supabase
        .from("calendar_events")
        .update({ status: "available" })
        .eq("id", reserved.id);
      return new Response(
        JSON.stringify({ success: false, error: `Failed to create lead: ${leadError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Step 3: Link lead to the calendar event ───────────────────────────
    await supabase
      .from("calendar_events")
      .update({ lead_id: lead.id })
      .eq("id", reserved.id);

    // ── Step 4: Create Google Calendar event with Meet link ───────────────
    let meet_link: string | undefined;
    let calendar_link: string | undefined;

    try {
      const gcalCreds = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
      if (gcalCreds) {
        const creds = JSON.parse(gcalCreds);
        const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || creds.client_email;
        const token = await getGoogleAccessToken(creds);

        const startTime = new Date(dateTime);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

        const eventRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: `Meeting with ${name}`,
              description: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Phone: ${countryCode || ""} ${phone || ""}`.trim(),
                `Business: ${businessType || ""}`,
                website ? `Website: ${website}` : "",
                challenge ? `Challenge: ${challenge}` : "",
                automateProcess ? `Automate: ${automateProcess}` : "",
                lp_name ? `Source: ${lp_name}` : "",
              ].filter(Boolean).join("\n"),
              start: { dateTime: startTime.toISOString(), timeZone: "Asia/Kolkata" },
              end: { dateTime: endTime.toISOString(), timeZone: "Asia/Kolkata" },
              conferenceData: {
                createRequest: {
                  requestId: `booking-${reserved.id}`,
                  conferenceSolutionKey: { type: "hangoutsMeet" },
                },
              },
              attendees: [{ email }],
            }),
          }
        );

        if (eventRes.ok) {
          const eventData = await eventRes.json();
          meet_link = eventData.conferenceData?.entryPoints?.find(
            (ep: { entryPointType: string; uri: string }) => ep.entryPointType === "video"
          )?.uri;
          calendar_link = eventData.htmlLink;

          // Store links on the lead
          if (meet_link || calendar_link) {
            await supabase
              .from("leads")
              .update({ meet_link, calendar_link })
              .eq("id", lead.id);
          }
        } else {
          const errText = await eventRes.text();
          console.error("Google Calendar event creation failed:", errText);
        }
      }
    } catch (gcalErr) {
      // Google Calendar is a synced copy — booking still succeeds
      console.error("Google Calendar sync failed (non-fatal):", gcalErr);
    }

    // ── Step 5: Trigger n8n webhook ───────────────────────────────────────
    try {
      const webhookUrl = "https://n8n.srv930949.hstgr.cloud/webhook/book-meetings";
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: `${countryCode || ""} ${phone || ""}`.trim(),
          businessType,
          website,
          challenge,
          automateProcess,
          dateTime,
          meet_link,
          calendar_link,
          calendarLink: calendar_link,
          lp_name,
        }),
      });
    } catch (webhookErr) {
      console.error("Webhook error (non-fatal):", webhookErr);
    }

    return new Response(
      JSON.stringify({ success: true, meet_link, calendar_link }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-booking error:", err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// --- Google Auth Helper (base64url-safe JWT) ---
function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGoogleAccessToken(creds: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      iss: creds.client_email,
      scope: "https://www.googleapis.com/auth/calendar",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const signInput = `${header}.${payload}`;

  const pemBody = creds.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signInput)
  );
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${header}.${payload}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}
