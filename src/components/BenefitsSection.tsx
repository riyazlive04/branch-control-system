import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Target, Cog, Smile, Brain } from "lucide-react";

const benefits = [
  { icon: Eye, title: "Instant Branch Visibility", desc: "See what's happening in every branch, right now.", colorClass: "text-health-blue", bgClass: "bg-health-blue/12" },
  { icon: Target, title: "Identify Weak Branches", desc: "Spot underperformers before they cost you money.", colorClass: "text-teal", bgClass: "bg-teal/12" },
  { icon: Cog, title: "Standardised Operations", desc: "Every branch runs the same proven playbook.", colorClass: "text-health-green", bgClass: "bg-health-green/12" },
  { icon: Smile, title: "Better Customer Experience", desc: "Consistent quality across all locations.", colorClass: "text-health-blue", bgClass: "bg-health-blue/12" },
  { icon: Brain, title: "Reduced Management Stress", desc: "The system manages - you lead.", colorClass: "text-teal", bgClass: "bg-teal/12" },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="container-narrow">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl text-center mb-4"
        >
          What changes when your business runs on a <span className="gradient-text">system</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-subtitle text-center mb-10 md:mb-16 max-w-xl mx-auto"
        >
          From firefighting to strategic leadership.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 100 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card group hover:border-teal/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover glow */}
              <motion.div
                className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${b.bgClass} blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
              />
              <motion.div
                className={`w-12 h-12 rounded-xl ${b.bgClass} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <b.icon className={`w-6 h-6 ${b.colorClass}`} />
              </motion.div>
              <h3 className="font-display font-bold text-foreground mb-2 relative z-10">{b.title}</h3>
              <p className="text-sm text-muted-foreground relative z-10">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
