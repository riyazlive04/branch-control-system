const SUPABASE_URL = "https://lbsiyqbhjatlmqphjitf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxic2l5cWJoamF0bG1xcGhqaXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzYyMTgsImV4cCI6MjA4ODExMjIxOH0.iWUso735ZmnaqI-WxtlSvhboFFPDMRPzETlCN9wzYDI";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  apikey: SUPABASE_ANON_KEY,
};

export interface Slot {
  dateTime: string;
  display: string;
}

export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  businessType: string;
  website: string;
  challenge: string;
  automateProcess: string;
  dateTime: string;
}

export interface BookingResponse {
  success: boolean;
  meet_link?: string;
  calendar_link?: string;
  error?: string;
}

export async function getAvailableSlots(date: string): Promise<Slot[]> {
  console.log("[booking] getAvailableSlots:", date);
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/get-slots?date=${date}`,
    { headers }
  );
  const data = await res.json();
  console.log("[booking] get-slots response:", data);
  if (data.success && Array.isArray(data.slots)) {
    return data.slots;
  }
  console.warn("[booking] get-slots error:", data.error ?? data);
  return [];
}

export async function createBooking(
  payload: BookingPayload,
  lp_name: string
): Promise<BookingResponse> {
  const body = { ...payload, lp_name };
  console.log("[booking] createBooking payload:", body);
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/create-booking`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }
  );
  const data = await res.json();
  console.log("[booking] createBooking response:", data);
  if (!res.ok || !data.success) {
    return { success: false, error: data.error || "Booking failed" };
  }
  return {
    success: true,
    meet_link: data.meet_link,
    calendar_link: data.calendar_link,
  };
}
