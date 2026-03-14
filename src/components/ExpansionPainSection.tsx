import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check, Clock, BarChart3, Settings, AlertTriangle } from "lucide-react";

const ExpansionPainSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const manualItems = [
    { icon: Clock, text: "Delayed reports from branch managers" },
    { icon: AlertTriangle, text: "Inconsistent processes across branches" },
    { icon: X, text: "Owner chasing managers for updates" },
  ];
  const systemItems = [
    { icon: BarChart3, text: "Real-time dashboard with live data" },
    { icon: Settings, text: "Automated reporting across branches" },
    { icon: Check, text: "Standardised operations everywhere" },
  ];

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <div className="container-narrow">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl text-center mb-10 md:mb-16"
        >
          Why scaling branches becomes <span className="gradient-text">painful</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
            className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Animated red pulse background */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 rounded-full bg-destructive/5"
              animate={inView ? { scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="flex items-center gap-3 mb-6 relative">
              <motion.div
                className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center"
                animate={inView ? { rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <X className="w-5 h-5 text-destructive" />
              </motion.div>
              <h3 className="font-display font-bold text-lg text-foreground">Manual Operations</h3>
            </div>
            <div className="space-y-4 relative">
              {manualItems.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    animate={inView ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <item.icon className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
            className="rounded-2xl border border-health-green/20 bg-health-green/5 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Animated green glow background */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 rounded-full bg-health-green/5"
              animate={inView ? { scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="flex items-center gap-3 mb-6 relative">
              <motion.div
                className="w-10 h-10 rounded-full bg-health-green/10 flex items-center justify-center"
                animate={inView ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Check className="w-5 h-5 text-health-green" />
              </motion.div>
              <h3 className="font-display font-bold text-lg text-foreground">System-Driven Operations</h3>
            </div>
            <div className="space-y-4 relative">
              {systemItems.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.15 }}
                  className="flex items-start gap-3"
                >
                  <item.icon className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Animated arrow between cards */}
        <motion.div
          className="hidden md:flex justify-center my-[-20px] relative z-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-background border-2 border-teal flex items-center justify-center shadow-lg"
            animate={inView ? { x: [0, 5, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-teal font-bold text-lg">→</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpansionPainSection;
