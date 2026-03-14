import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, CalendarCheck } from "lucide-react";

const GuaranteeCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="container-narrow px-5 md:px-8 pb-8 md:pb-12">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <div className="rounded-xl border border-teal/20 bg-teal/[0.04] backdrop-blur-sm px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4.5 h-4.5 text-teal" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm mb-1">
                  Patient Journey Optimization Guarantee
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If the system does not improve patient follow-up efficiency within the first 30 days, we will continue optimizing the workflow at no additional cost.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Limited Audit Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, type: "spring", stiffness: 120 }}
        >
          <div className="rounded-xl border border-teal/15 bg-background backdrop-blur-sm px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CalendarCheck className="w-4.5 h-4.5 text-teal" />
              </div>
              <div>
                <h4 className="font-display font-bold text-foreground text-sm mb-1">
                  Limited Weekly System Audits
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  To ensure high-quality system design and implementation, we only conduct 10 clinic system audits per week. This allows us to properly analyse each clinic's workflow, patient journey, and automation opportunities.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Micro-scarcity line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground italic"
        >
          Limited audit slots available each week.
        </motion.p>
      </div>
    </div>
  );
};

export default GuaranteeCard;
