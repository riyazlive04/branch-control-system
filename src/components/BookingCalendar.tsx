import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format, isSunday, addDays, startOfToday } from "date-fns";
import {
  CheckCircle2,
  Loader2,
  Video,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getAvailableSlots, createBooking, type Slot } from "@/services/booking";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  businessType: string;
  website: string;
  challenge: string;
  automateProcess: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;

const COUNTRY_CODES = [
  { code: "+91",  country: "India" },
  { code: "+1",   country: "US" },
  { code: "+44",  country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi" },
  { code: "+65",  country: "Singapore" },
  { code: "+61",  country: "Australia" },
  { code: "+49",  country: "Germany" },
  { code: "+33",  country: "France" },
  { code: "+81",  country: "Japan" },
  { code: "+86",  country: "China" },
  { code: "+55",  country: "Brazil" },
  { code: "+27",  country: "South Africa" },
  { code: "+234", country: "Nigeria" },
  { code: "+254", country: "Kenya" },
];

const BUSINESS_TYPES = [
  "Clinic/Healthcare",
  "Agency/Marketing",
  "Coaching/Consulting",
  "E-commerce/Product Business",
  "Real Estate",
  "Education/Training",
  "Restaurant/Hospitality",
  "Service Provider",
  "Other",
];

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  countryCode: "+91",
  businessType: "",
  website: "",
  challenge: "",
  automateProcess: "",
};

// ─── BookingCalendar ───────────────────────────────────────────────────────────

const BookingCalendar: React.FC = () => {
  const today = startOfToday();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [meetLink, setMeetLink] = useState("");

  const slotCache = useRef<Map<string, Slot[]>>(new Map());

  // ─── Fetch helpers ─────────────────────────────────────────────────────────

  // Raw fetch — calls shared booking service
  const fetchSlotsRaw = useCallback(async (date: Date): Promise<Slot[]> => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (slotCache.current.has(dateStr)) {
      return slotCache.current.get(dateStr)!;
    }

    const slots = await getAvailableSlots(dateStr);

    slotCache.current.set(dateStr, slots);
    return slots;
  }, []);

  // User-initiated fetch — shows spinner while fetching
  const fetchSlots = useCallback(
    async (date: Date) => {
      setLoadingSlots(true);
      setSlots([]);
      const data = await fetchSlotsRaw(date);
      setSlots(data);
      setLoadingSlots(false);
    },
    [fetchSlotsRaw]
  );

  // Prefetch next 4 weekdays silently on mount to warm cache
  useEffect(() => {
    const prefetch = async () => {
      const weekdays: Date[] = [];
      let d = addDays(today, 1);
      while (weekdays.length < 4) {
        if (!isSunday(d)) weekdays.push(d);
        d = addDays(d, 1);
      }
      await Promise.all(weekdays.map((date) => fetchSlotsRaw(date)));
    };
    prefetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Event handlers ────────────────────────────────────────────────────────

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    fetchSlots(date);
  };

  const setField = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Manual validation for Select fields (Radix doesn't use native required)
    if (!form.businessType) {
      toast.error("Please select your business type.");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      countryCode: form.countryCode,
      businessType: form.businessType,
      website: form.website,
      challenge: form.challenge,
      automateProcess: form.automateProcess,
      dateTime: selectedSlot.dateTime,
    };

    const result = await createBooking(payload, "Branch Control System");

    if (!result.success) {
      toast.error("Booking failed. Please try again or contact us directly.");
      setSubmitting(false);
      return;
    }

    // Evict this date from cache so slot is removed immediately
    const dateStr = format(selectedDate!, "yyyy-MM-dd");
    slotCache.current.delete(dateStr);

    // Open WhatsApp with pre-filled confirmation message
    if (WHATSAPP_NUMBER) {
      const msg = encodeURIComponent(
        `Hi! I've just booked a *Multi-Branch System Strategy Session* with Sirah Digital.\n\n` +
          `📅 Date: ${selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}\n` +
          `⏰ Time: ${selectedSlot.display}\n\n` +
          `👤 Name: ${form.name}\n` +
          `📧 Email: ${form.email}\n` +
          `📱 Phone: ${form.countryCode} ${form.phone}\n\n` +
          `🏢 Business Type: ${form.businessType}\n\n` +
          `Looking forward to the call!`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }

    // Fire Meta Pixel Lead event on successful booking
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead");
    }

    setMeetLink(result.meet_link || "");
    setConfirmed(true);
    setSubmitting(false);
  };

  const resetBooking = () => {
    setConfirmed(false);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setSlots([]);
    setForm(EMPTY_FORM);
    setMeetLink("");
  };

  // ─── Disabled day matchers ─────────────────────────────────────────────────

  const disabledDays = [
    { before: addDays(today, 1) },
    (date: Date) => isSunday(date),
  ];

  const showForm = !!(selectedDate && selectedSlot);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <section id="consultation" className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl mb-3">
            Select a <span className="gradient-text">Date & Time</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Timezone:{" "}
            <span className="font-medium text-foreground">{timezone}</span>
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── Confirmation screen ──────────────────────────────────── */}
          {confirmed ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="glass-card max-w-md mx-auto text-center py-10 md:py-14"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 160 }}
                className="w-20 h-20 rounded-full bg-health-green/15 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-10 h-10 text-health-green-text" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                  Booking Confirmed!
                </h3>
                {selectedDate && selectedSlot && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {format(selectedDate, "MMMM d, yyyy")} · {selectedSlot.display}
                    </span>
                  </div>
                )}

                {meetLink ? (
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm w-full sm:w-auto inline-flex mb-4"
                  >
                    <Video className="w-4 h-4" />
                    Join Google Meet
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    Your meet link will be sent to{" "}
                    <span className="font-medium text-foreground">{form.email}</span>
                  </p>
                )}

                <p className="text-xs text-muted-foreground mb-6">
                  A WhatsApp confirmation has been sent with all details.
                </p>

                <button onClick={resetBooking} className="btn-secondary text-sm w-full sm:w-auto">
                  Book Another Slot
                </button>
              </motion.div>
            </motion.div>

          ) : (

            /* ── Picker + Form ──────────────────────────────────────── */
            <motion.div
              key="picker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              {/* Calendar + Slots card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="glass-card !p-0 overflow-hidden mb-5"
              >
                <div className="flex flex-col md:flex-row">

                  {/* ── Left: Calendar ── */}
                  <div className="border-b md:border-b-0 md:border-r border-border p-4 md:p-6 md:w-[340px] lg:w-[370px] flex-shrink-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Choose a Date
                    </p>
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={disabledDays}
                      fromMonth={today}
                      showOutsideDays={false}
                      className="w-full"
                      classNames={{
                        months: "w-full",
                        month: "w-full",
                        caption:
                          "flex justify-center pt-1 pb-4 relative items-center",
                        caption_label:
                          "text-sm font-semibold text-foreground",
                        nav: "flex items-center gap-1",
                        nav_button: cn(
                          "h-7 w-7 bg-transparent border border-border rounded-lg",
                          "flex items-center justify-center opacity-60 hover:opacity-100",
                          "hover:bg-accent/10 transition-all"
                        ),
                        nav_button_previous: "absolute left-0",
                        nav_button_next: "absolute right-0",
                        table: "w-full border-collapse",
                        head_row: "flex w-full",
                        head_cell:
                          "flex-1 text-center text-[11px] font-medium text-muted-foreground pb-2",
                        row: "flex w-full mt-1",
                        cell: "flex-1 flex items-center justify-center p-0",
                        day: cn(
                          "h-9 w-full max-w-[38px] rounded-lg text-sm font-normal",
                          "flex items-center justify-center transition-all duration-150",
                          "hover:bg-teal/10 focus:outline-none focus:ring-2 focus:ring-teal/30"
                        ),
                        day_selected:
                          "bg-teal !text-white hover:bg-teal/90 font-semibold shadow-sm",
                        day_today:
                          "border-2 border-teal/40 text-teal font-semibold",
                        day_outside:
                          "text-muted-foreground opacity-25",
                        day_disabled:
                          "text-muted-foreground opacity-20 cursor-not-allowed hover:bg-transparent",
                        day_hidden: "invisible",
                      }}
                    />
                  </div>

                  {/* ── Right: Time slots ── */}
                  <div className="flex-1 p-4 md:p-6">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Available Times
                    </p>

                    {!selectedDate ? (
                      <div className="flex flex-col items-center justify-center h-36 md:h-full min-h-[160px] text-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-teal" />
                        </div>
                        <p className="text-sm text-muted-foreground max-w-[160px]">
                          Select a date to view available times
                        </p>
                      </div>
                    ) : loadingSlots ? (
                      <div className="flex items-center justify-center h-36 md:h-full min-h-[160px]">
                        <Loader2 className="w-6 h-6 text-teal animate-spin" />
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-36 md:h-full min-h-[160px] text-center gap-2">
                        <CalendarIcon className="w-8 h-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                          No slots available.
                          <br />
                          Please select another day.
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                      >
                        {slots.map((slot, i) => (
                          <motion.button
                            key={slot.dateTime}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200",
                              selectedSlot?.dateTime === slot.dateTime
                                ? "bg-teal text-white border-teal shadow-md scale-[1.02]"
                                : "bg-background border-border text-foreground hover:border-teal/50 hover:bg-teal/5"
                            )}
                          >
                            {slot.display}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* ── Form panel (slides in when date + slot selected) ── */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="glass-card">

                      {/* Selected summary header */}
                      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                        <div className="w-9 h-9 rounded-xl bg-teal/12 flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="w-4 h-4 text-teal" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedSlot?.display} · {timezone}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedSlot(null)}
                          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                        >
                          Change
                        </button>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                          {/* Name */}
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              required
                              placeholder="Your name"
                              value={form.name}
                              onChange={(e) => setField("name", e.target.value)}
                            />
                          </div>

                          {/* Business type */}
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Business Type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              value={form.businessType}
                              onValueChange={(v) => setField("businessType", v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {BUSINESS_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Email */}
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              required
                              type="email"
                              placeholder="you@company.com"
                              value={form.email}
                              onChange={(e) => setField("email", e.target.value)}
                            />
                          </div>

                          {/* Phone with country code */}
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Phone Number <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex gap-2">
                              <Select
                                value={form.countryCode}
                                onValueChange={(v) => setField("countryCode", v)}
                              >
                                <SelectTrigger className="w-[90px] sm:w-[110px] flex-shrink-0 px-2">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {COUNTRY_CODES.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                      <span className="font-medium">{c.code}</span>
                                      <span className="text-muted-foreground ml-1.5 text-xs">
                                        {c.country}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                required
                                type="tel"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={(e) => setField("phone", e.target.value)}
                                className="flex-1 min-w-0"
                              />
                            </div>
                          </div>

                          {/* Website */}
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Website or Social Profile{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              required
                              placeholder="https://yoursite.com"
                              value={form.website}
                              onChange={(e) => setField("website", e.target.value)}
                            />
                          </div>

                          {/* Biggest challenge */}
                          <div>
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Biggest Operational Challenge{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              required
                              placeholder="e.g. No visibility across branches"
                              value={form.challenge}
                              onChange={(e) => setField("challenge", e.target.value)}
                            />
                          </div>

                          {/* Process to automate (optional, full width) */}
                          <div className="sm:col-span-2">
                            <Label className="text-sm font-semibold mb-1.5 block">
                              Process You Want to Automate{" "}
                              <span className="text-muted-foreground font-normal text-xs">
                                (optional)
                              </span>
                            </Label>
                            <Input
                              placeholder="e.g. Branch reporting, follow-ups, staff tracking..."
                              value={form.automateProcess}
                              onChange={(e) =>
                                setField("automateProcess", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {/* Confirm bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedSlot?.display} · {timezone}
                            </p>
                          </div>
                          <motion.button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary text-sm w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                            whileHover={!submitting ? { scale: 1.02 } : {}}
                            whileTap={!submitting ? { scale: 0.98 } : {}}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Confirming...
                              </>
                            ) : (
                              <>
                                Confirm Booking
                                <CheckCircle2 className="w-4 h-4" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BookingCalendar;
