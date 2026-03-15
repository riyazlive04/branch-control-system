import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Map, RefreshCw, Settings, Gift, ArrowRight } from "lucide-react";

const blueprintItems = [
  {
    icon: Map,
    title: "Patient Lifecycle Mapping",
    desc: "A structured visualization of your clinic's patient journey from consultation to recovery.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: RefreshCw,
    title: "Follow-Up Automation Strategy",
    desc: "Identify automation opportunities that improve patient engagement and treatment adherence.",
    color: "text-health-blue",
    bg: "bg-health-blue/10",
  },
  {
    icon: Settings,
    title: "Clinic Workflow Improvement Plan",
    desc: "Recommendations to streamline clinic operations and reduce administrative overhead.",
    color: "text-health-green",
    bg: "bg-health-green/10",
  },
];

const BlueprintSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-display text-2xl md:text-4xl lg:text-5xl mb-4">
            What You Get In The Free <span className="gradient-text">Clinic Blueprint</span>
          </h2>
          <p className="text-subtitle max-w-xl mx-auto">
            Actionable insights you can use immediately - delivered after your consultation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {blueprintItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card group hover:border-teal/25 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2 text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bonus Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="glass-card border-health-green/25 bg-health-green/[0.04] relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-health-green/12 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-health-green" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-health-green/15 text-health-green mb-2">
                Bonus
              </div>
              <h3 className="font-display font-bold text-foreground mb-1.5 text-sm">
                Doctor & Staff Workflow Optimization
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We analyse how doctors and staff currently manage consultations, follow-ups, and patient tracking. You receive a workflow optimization plan designed to reduce administrative workload and improve operational efficiency.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subtle note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-6 italic"
        >
          You receive this blueprint after the consultation - even if you choose not to proceed with implementation.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={() => document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary text-sm w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Book Your Free Blueprint Session <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlueprintSection;
