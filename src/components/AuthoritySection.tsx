import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Globe, BarChart3, Zap } from "lucide-react";
import founderImage from "@/assets/founder.jpeg";

const credentials = [
  { icon: Award, text: "13+ years in technology and analytics", colorClass: "text-teal", bgClass: "bg-teal/12" },
  { icon: Globe, text: "Managed analytics across 200+ websites", colorClass: "text-health-blue", bgClass: "bg-health-blue/12" },
  { icon: BarChart3, text: "Experience with global brands including P&G", colorClass: "text-health-green", bgClass: "bg-health-green/12" },
  { icon: Zap, text: "Specialisation in automation and business systems", colorClass: "text-teal", bgClass: "bg-teal/12" },
];

const AuthoritySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl text-center mb-10 md:mb-16"
        >
          Why business owners <span className="gradient-text">trust this system</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="relative w-fit mx-auto md:mx-0">
              <motion.img
                src={founderImage}
                alt="Mohamed Riyaz - Founder of Sirah Digital"
                className="w-56 sm:w-64 h-72 sm:h-80 object-cover rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              {/* Decorative ring */}
              <motion.div
                className="absolute -inset-2 rounded-2xl border border-teal/10 pointer-events-none"
                animate={inView ? { opacity: [0, 0.5, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -right-4 glass-card p-3 !rounded-xl hidden sm:block"
              >
                <p className="font-display font-bold text-sm text-foreground">Mohamed Riyaz</p>
                <p className="text-xs text-muted-foreground">Founder, Sirah Digital</p>
              </motion.div>
            </div>
            {/* Mobile-only name tag below image */}
            <div className="mt-4 text-center sm:hidden">
              <p className="font-display font-bold text-sm text-foreground">Mohamed Riyaz</p>
              <p className="text-xs text-muted-foreground">Founder, Sirah Digital</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <div className="space-y-5">
              {credentials.map((c, i) => (
                <motion.div
                  key={c.text}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-start gap-4"
                >
                  <motion.div
                    className={`w-10 h-10 rounded-xl ${c.bgClass} flex items-center justify-center flex-shrink-0`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <c.icon className={`w-5 h-5 ${c.colorClass}`} />
                  </motion.div>
                  <p className="text-foreground font-medium pt-2">{c.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Case Study */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1, type: "spring" }}
              whileHover={{ scale: 1.01 }}
              className="mt-6 md:mt-10 glass-card border-teal/20 relative overflow-hidden"
            >
              {/* Accent bar */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal to-health-blue"
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.6 }}
                style={{ transformOrigin: "top" }}
              />
              <p className="text-xs font-semibold text-teal-text mb-2 uppercase tracking-wider">Case Study</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">Om Suba Agency</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Problem:</strong> No visibility across branches, relying on manual reports.</p>
                <p><strong className="text-foreground">System:</strong> Centralised dashboard with automated reporting.</p>
                <p><strong className="text-foreground">Result:</strong> Complete operational clarity. Branch performance visible in real-time.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;
