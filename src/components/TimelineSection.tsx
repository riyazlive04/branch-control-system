import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileSearch, Boxes, LayoutDashboard, Rocket } from "lucide-react";

const steps = [
  { icon: FileSearch, week: "Week 1", title: "System Blueprint", desc: "We audit your operations and design a custom system architecture.", colorClass: "text-health-blue", textClass: "text-health-blue-text", bgClass: "bg-health-blue/12" },
  { icon: Boxes, week: "Week 2", title: "Architecture & Integrations", desc: "Build the core system with your existing tools and workflows.", colorClass: "text-teal", textClass: "text-teal-text", bgClass: "bg-teal/12" },
  { icon: LayoutDashboard, week: "Week 3", title: "Dashboard & Workflows", desc: "Configure dashboards, reporting, and automation workflows.", colorClass: "text-health-green", textClass: "text-health-green-text", bgClass: "bg-health-green/12" },
  { icon: Rocket, week: "Week 4", title: "Deployment & Training", desc: "Launch across all branches with complete team training.", colorClass: "text-teal", textClass: "text-teal-text", bgClass: "bg-teal/12" },
];

const TimelineSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-display text-2xl md:text-4xl lg:text-5xl text-center mb-4"
        >
          Deploy your system in <span className="gradient-text">30 days</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-subtitle text-center mb-10 md:mb-16 max-w-xl mx-auto"
        >
          From audit to deployment in four weeks.
        </motion.p>

        <div className="relative">
          {/* Animated timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-teal/40 via-health-blue/30 to-health-green/40"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
              style={{ transformOrigin: "top" }}
            />
            {/* Flowing dot on timeline */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-teal"
              animate={inView ? { top: ["0%", "100%"] } : {}}
              transition={{ delay: 1.5, duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.week}
                initial={{ opacity: 0, y: 40, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`glass-card relative ${i % 2 === 1 ? "md:mt-16" : ""}`}
              >
                {/* Timeline connector dot */}
                <motion.div
                  className="hidden md:block absolute top-6 w-3 h-3 rounded-full bg-teal border-2 border-background"
                  style={{ [i % 2 === 0 ? 'right' : 'left']: '-1.5rem' }}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                />
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="teal-dot"
                    animate={inView ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <span className={`text-xs font-bold ${step.textClass} uppercase tracking-wider`}>{step.week}</span>
                </div>
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`w-10 h-10 rounded-xl ${step.bgClass} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <step.icon className={`w-5 h-5 ${step.colorClass}`} />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
