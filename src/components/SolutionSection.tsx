import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart3, Users, FileText, BookOpen, ListChecks, MessageCircle } from "lucide-react";

const modules = [
  { icon: BarChart3, label: "Performance Dashboard", delay: 0.3, colorClass: "text-health-blue" },
  { icon: Users, label: "Staff Management", delay: 0.5, colorClass: "text-teal" },
  { icon: FileText, label: "Reporting", delay: 0.7, colorClass: "text-health-green" },
  { icon: BookOpen, label: "SOP Management", delay: 0.9, colorClass: "text-health-blue" },
  { icon: ListChecks, label: "Task Management", delay: 1.1, colorClass: "text-teal" },
  { icon: MessageCircle, label: "Communication Hub", delay: 1.3, colorClass: "text-health-green" },
];

const SolutionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="solution" ref={ref} className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-display text-2xl md:text-4xl lg:text-5xl mb-4">
            Introducing the Multi-Branch{" "}
            <span className="gradient-text">Business Operating System</span>
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            A centralised system that connects every branch into one command centre.
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <div className="relative mb-10 md:mb-16">
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, type: "spring" }}
              className="glass-card text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-3 relative">
                <BarChart3 className="w-8 h-8 text-teal" />
                {/* Pulse ring around central icon */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-teal/30"
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <p className="font-display font-bold text-foreground">Central System</p>
              <p className="text-xs text-muted-foreground">All branches connected</p>
            </motion.div>
          </div>

          {/* Animated connecting lines from center to modules */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {modules.map((_, i) => {
              const cols = typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 3;
              const col = i % cols;
              const row = Math.floor(i / cols);
              const xPct = (col + 0.5) / cols * 100;
              const yStart = 35;
              const yEnd = 55 + row * 25;
              return (
                <motion.line
                  key={i}
                  x1="50%" y1={`${yStart}%`}
                  x2={`${xPct}%`} y2={`${yEnd}%`}
                  stroke="hsl(var(--teal))"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  opacity="0.15"
                  initial={{ pathLength: 0 }}
                  animate={inView ? {
                    pathLength: 1,
                    strokeDashoffset: [0, -20],
                  } : {}}
                  transition={{
                    pathLength: { delay: 0.3 + i * 0.1, duration: 0.6 },
                    strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear", delay: 0.9 + i * 0.1 },
                  }}
                />
              );
            })}
          </svg>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: mod.delay, duration: 0.5, type: "spring" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card text-center group hover:border-teal/30 transition-all duration-300"
              >
                <motion.div
                  animate={inView ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
                >
                  <mod.icon className={`w-6 h-6 ${mod.colorClass} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                </motion.div>
                <p className="text-sm font-semibold text-foreground">{mod.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
