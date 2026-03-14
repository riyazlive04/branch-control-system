import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Shield, CheckCircle2, Clock, Sparkles } from "lucide-react";

const offerItems = [
  "Branch system blueprint",
  "Automation opportunities",
  "Recommended architecture",
  "Expansion readiness insights",
];

const ConsultationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", industry: "", branches: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="consultation" ref={ref} className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-display text-2xl md:text-4xl lg:text-5xl mb-4">
            Free Multi-Branch <span className="gradient-text">System Consultation</span>
          </h2>
          <p className="text-subtitle max-w-xl mx-auto">
            Get a personalised system blueprint for your business - no obligation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* What you receive */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-4 md:mb-6">What you receive:</h3>
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {offerItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={inView ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  </motion.div>
                  <span className="text-foreground font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="glass-card border-accent/20 mb-4 md:mb-6"
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Our honest promise:</strong> If your business does not need a system, we will tell you honestly.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Clock className="w-4 h-4" />
              <p>Due to custom implementation, we onboard a limited number of businesses each month.</p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" }}
                className="glass-card text-center py-16"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-6 h-6 text-teal mx-auto mb-2" />
                  <h3 className="font-display font-bold text-2xl text-foreground mb-2">Thank you!</h3>
                  <p className="text-muted-foreground">We'll reach out within 24 hours to schedule your consultation.</p>
                </motion.div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card space-y-4 relative overflow-hidden">
                {/* Subtle gradient border animation */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ padding: "1px" }}
                >
                  <motion.div
                    className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-teal/20 via-health-blue/20 to-health-green/20"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                </motion.div>

                {[
                  { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 " },
                  { key: "email", label: "Email Address", type: "email", placeholder: "you@company.com" },
                ].map((field, i) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="relative z-10"
                  >
                    <label className="block text-sm font-semibold text-foreground mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className="relative z-10"
                >
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Industry</label>
                  <select
                    required
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  >
                    <option value="">Select your industry</option>
                    <option>Coaching Institute</option>
                    <option>Retail Chain</option>
                    <option>Salon / Beauty</option>
                    <option>Clinic / Healthcare</option>
                    <option>Agency</option>
                    <option>Training Institute</option>
                    <option>Other</option>
                  </select>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9 }}
                  className="relative z-10"
                >
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Number of Branches</label>
                  <select
                    required
                    value={form.branches}
                    onChange={(e) => setForm({ ...form, branches: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  >
                    <option value="">Select</option>
                    <option>2-3 branches</option>
                    <option>4-7 branches</option>
                    <option>8-15 branches</option>
                    <option>15+ branches</option>
                  </select>
                </motion.div>
                <motion.button
                  type="submit"
                  className="btn-primary w-full mt-2 relative z-10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;
