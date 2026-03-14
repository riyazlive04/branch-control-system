import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding section-alt relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-teal/5"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-health-blue/5"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="container-narrow text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl mb-5 md:mb-6">
            Turn your multi-branch business into a{" "}
            <span className="gradient-text">centralised operating system</span>
          </h2>
          <motion.button
            onClick={() => document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-5 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: [
              "0 4px 20px hsl(174, 62%, 42%, 0.2)",
              "0 8px 40px hsl(174, 62%, 42%, 0.35)",
              "0 4px 20px hsl(174, 62%, 42%, 0.2)",
            ]}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Book Free Consultation <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
