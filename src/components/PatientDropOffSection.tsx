import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, TrendingDown, UserX, Bell, Bot } from "lucide-react";

const journeySteps = [
  { label: "Consultation", pct: 100 },
  { label: "Follow-Up", pct: 68 },
  { label: "Treatment", pct: 42 },
  { label: "Recovery", pct: 28 },
];

const analysisPoints = [
  { icon: UserX, text: "Where patients drop off in the treatment journey" },
  { icon: Bell, text: "Which follow-ups are missed" },
  { icon: Bot, text: "How automation can recover those patients" },
];

const PatientDropOffSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/8 text-destructive text-xs font-semibold mb-4">
            <TrendingDown className="w-3.5 h-3.5" />
            Patient Retention Insight
          </div>
          <h2 className="text-display text-2xl md:text-4xl lg:text-5xl mb-4">
            Where Are Your Patients <span className="gradient-text">Dropping Off?</span>
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Many clinics lose 30–50% of patients after the first consultation due to inconsistent follow-ups and manual processes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Funnel Journey Diagram */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Patient Journey Funnel</h3>
            
            <div className="flex items-end justify-between gap-2 mb-4 h-40">
              {journeySteps.map((step, i) => (
                <div key={step.label} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="text-xs font-bold text-foreground"
                  >
                    {step.pct}%
                  </motion.span>
                  <motion.div
                    className={`w-full rounded-t-lg ${i <= 1 ? "bg-teal" : "bg-destructive/40"} relative overflow-hidden`}
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${(step.pct / 100) * 120}px` } : {}}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: "easeOut" }}
                  >
                    {i >= 2 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-destructive/20 to-transparent"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{step.label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between px-4 mt-2">
              {["-32%", "-26%", "-14%"].map((drop, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -5 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-[10px] font-bold text-destructive/70"
                >
                  {drop} ↓
                </motion.span>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 italic">
              Typical retention without structured follow-up systems
            </p>
          </motion.div>

          {/* Analysis Points */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              As part of the Clinic System Blueprint, we analyse:
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              This insight helps clinics identify hidden revenue loss and engagement gaps.
            </p>
            <div className="space-y-4 mb-8">
              {analysisPoints.map((point, i) => (
                <motion.div
                  key={point.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-4.5 h-4.5 text-teal" />
                  </div>
                  <span className="text-foreground font-medium text-sm">{point.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary text-sm w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Discover Where Your Patients Drop Off <ArrowRight className="w-4 h-4" />
            </motion.button>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Included in the free Clinic System Blueprint consultation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PatientDropOffSection;
