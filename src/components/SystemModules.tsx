import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { BarChart3, Users, FileText, BookOpen, ListChecks, UserCheck } from "lucide-react";

const modules = [
  {
    icon: BarChart3,
    title: "Branch Performance Dashboard",
    desc: "Track revenue, footfall, and KPIs for every branch in real-time.",
    colorClass: "text-health-blue",
    textClass: "text-health-blue-text",
    bgClass: "bg-health-blue/12",
    metrics: [
      { label: "Revenue", value: "₹18.2L", change: "+12%" },
      { label: "Footfall", value: "1,240", change: "+8%" },
    ],
  },
  {
    icon: Users,
    title: "Staff Management",
    desc: "Track attendance, performance, and roles across all branches.",
    colorClass: "text-teal",
    textClass: "text-teal-text",
    bgClass: "bg-teal/12",
    metrics: [
      { label: "Staff", value: "86", change: "Active" },
      { label: "Attendance", value: "94%", change: "This week" },
    ],
  },
  {
    icon: FileText,
    title: "Automated Reporting",
    desc: "Reports generated automatically. No chasing branch managers.",
    colorClass: "text-health-green",
    textClass: "text-health-green-text",
    bgClass: "bg-health-green/12",
    metrics: [
      { label: "Reports", value: "24", change: "This month" },
      { label: "Saved", value: "40 hrs", change: "Per month" },
    ],
  },
  {
    icon: BookOpen,
    title: "SOP Management",
    desc: "Standardise operations. Every branch follows the same playbook.",
    colorClass: "text-health-blue",
    textClass: "text-health-blue-text",
    bgClass: "bg-health-blue/12",
    metrics: [
      { label: "SOPs", value: "32", change: "Active" },
      { label: "Compliance", value: "97%", change: "Avg" },
    ],
  },
  {
    icon: ListChecks,
    title: "Task Management",
    desc: "Assign and track tasks across branches with deadlines and accountability.",
    colorClass: "text-teal",
    textClass: "text-teal-text",
    bgClass: "bg-teal/12",
    metrics: [
      { label: "Tasks", value: "156", change: "Completed" },
      { label: "On-time", value: "91%", change: "Rate" },
    ],
  },
  {
    icon: UserCheck,
    title: "Customer Tracking",
    desc: "Track customer visits, retention, and satisfaction branch-wise.",
    colorClass: "text-health-green",
    textClass: "text-health-green-text",
    bgClass: "bg-health-green/12",
    metrics: [
      { label: "Customers", value: "3.2K", change: "Active" },
      { label: "Retention", value: "78%", change: "+5%" },
    ],
  },
];

const SystemModules = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [touchIdx, setTouchIdx] = useState<number | null>(null);

  const activeIdx = hoveredIdx ?? touchIdx;

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="container-narrow">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-display text-2xl md:text-4xl lg:text-5xl text-center mb-4"
        >
          System <span className="gradient-text">Modules</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-subtitle text-center mb-10 md:mb-16 max-w-xl mx-auto"
        >
          Every module designed to eliminate operational chaos.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 100 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onTouchStart={() => setTouchIdx(touchIdx === i ? null : i)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card relative group cursor-pointer hover:border-teal/30 transition-all duration-300 overflow-hidden"
            >
              {/* Background glow on hover/tap */}
              <motion.div
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${mod.bgClass} blur-2xl`}
                animate={activeIdx === i ? { opacity: 0.6, scale: 1.2 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                animate={activeIdx === i ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <mod.icon className={`w-7 h-7 md:w-8 md:h-8 ${mod.colorClass} mb-3 md:mb-4`} />
              </motion.div>
              <h3 className="font-display font-bold text-foreground mb-1.5 md:mb-2 text-sm md:text-base relative z-10">{mod.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 relative z-10">{mod.desc}</p>

              {/* Mini metrics — tap on mobile, hover on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={activeIdx === i ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 md:gap-3 relative z-10 overflow-hidden"
              >
                {mod.metrics.map((m, mi) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={activeIdx === i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: mi * 0.1, duration: 0.2 }}
                    className={`flex-1 ${mod.bgClass} rounded-lg p-2 md:p-3`}
                  >
                    <div className="text-[10px] md:text-xs text-muted-foreground">{m.label}</div>
                    <div className="font-display font-bold text-foreground text-xs md:text-sm">{m.value}</div>
                    <div className={`text-[10px] md:text-xs ${mod.textClass} font-medium`}>{m.change}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile tap hint */}
              {touchIdx === null && (
                <p className="text-[10px] text-muted-foreground/50 mt-2 relative z-10 md:hidden">Tap to see metrics</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemModules;
