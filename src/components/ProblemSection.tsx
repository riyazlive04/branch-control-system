import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, FileSpreadsheet, Phone, FileText, AlertTriangle } from "lucide-react";

const chaosItems = [
  { icon: MessageSquare, label: "WhatsApp Reports", rotation: -12, x: -40, y: -20 },
  { icon: FileSpreadsheet, label: "Excel Tracking", rotation: 8, x: 60, y: 30 },
  { icon: Phone, label: "Phone Follow-ups", rotation: -5, x: -30, y: 60 },
  { icon: FileText, label: "Manual Reports", rotation: 15, x: 50, y: -40 },
];

const ProblemSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-display text-2xl md:text-4xl lg:text-5xl mb-4">
            Why multi-branch businesses become{" "}
            <span className="gradient-text">chaotic</span>
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Most businesses rely on Excel, WhatsApp, and manual reports. This works for one branch - but breaks down at three.
          </p>
        </motion.div>

        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center mb-10 md:mb-16">
          {/* Central chaos indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute z-10 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </motion.div>
            {/* Expanding warning rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-destructive/30"
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-destructive/20"
              animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          {chaosItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={inView ? {
                opacity: 1,
                scale: 1,
                x: item.x * (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2.5),
                y: item.y * (typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2),
                rotate: item.rotation,
              } : {}}
              transition={{ delay: 0.3 + i * 0.2, duration: 0.8, type: "spring" }}
              className="absolute glass-card p-3 md:p-5 flex flex-col items-center gap-1.5"
            >
              <motion.div
                animate={inView ? {
                  y: [0, -3, 3, -2, 0],
                  rotate: [0, 2, -2, 1, 0],
                } : {}}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: 1.5 + i * 0.3 }}
              >
                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-destructive" />
              </motion.div>
              <span className="text-xs md:text-sm font-semibold text-foreground whitespace-nowrap">{item.label}</span>
            </motion.div>
          ))}

          {/* Animated disconnection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {[0, 1, 2, 3].map((i) => (
              <motion.line
                key={i}
                x1="50%" y1="50%"
                x2={`${30 + i * 15}%`} y2={`${20 + i * 20}%`}
                stroke="hsl(var(--destructive))"
                strokeWidth="1"
                strokeDasharray="4 6"
                opacity="0.2"
                initial={{ pathLength: 0 }}
                animate={inView ? {
                  pathLength: [0, 1],
                  strokeDashoffset: [0, -20],
                } : {}}
                transition={{
                  pathLength: { delay: 0.5 + i * 0.2, duration: 0.8 },
                  strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear", delay: 1.3 + i * 0.2 },
                }}
              />
            ))}
          </svg>
        </div>

        {/* Pattern Interrupt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center p-6 md:p-12 rounded-2xl border-2 border-accent/30 bg-accent/5 relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <p className="font-display font-bold text-xl md:text-2xl lg:text-3xl text-foreground mb-4 relative">
            WAIT - If you run multiple branches, this might be{" "}
            <span className="gradient-text">costing you money</span> right now.
          </p>
          <motion.button
            onClick={() => document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary relative w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Check Your Branch System
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
