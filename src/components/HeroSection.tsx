import { motion } from "framer-motion";
import { ArrowRight, Play, Check } from "lucide-react";

const BranchNode = ({ x, y, delay, label }: { x: number; y: number; delay: number; label: string }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
  >
    {/* Pulse ring */}
    <motion.circle
      cx={x} cy={y} r="22"
      fill="none"
      stroke="hsl(var(--teal))"
      strokeWidth="1.5"
      opacity="0.3"
      animate={{ r: [22, 30, 22], opacity: [0.3, 0, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: delay * 0.5 }}
    />
    <motion.circle cx={x} cy={y} r="18" fill="hsl(var(--teal))" opacity="0.15" />
    <motion.circle
      cx={x} cy={y} r="10"
      fill="hsl(var(--teal))"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: delay * 0.3 }}
    />
    {/* Animated data flow line */}
    <motion.line
      x1={x} y1={y} x2={250} y2={200}
      stroke="hsl(var(--blue))"
      strokeWidth="2"
      strokeDasharray="6 4"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1, strokeDashoffset: [0, -20] }}
      transition={{
        pathLength: { delay: delay + 0.3, duration: 0.8 },
        strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear", delay: delay + 1.1 },
      }}
    />
    <text x={x} y={y + 32} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontFamily="Inter" fontWeight="500">{label}</text>
  </motion.g>
);

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToSystem = () => {
    document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" });
  };

  const branches = [
    { x: 80, y: 80, delay: 0.5, label: "Branch 1" },
    { x: 420, y: 60, delay: 0.7, label: "Branch 2" },
    { x: 60, y: 300, delay: 0.9, label: "Branch 3" },
    { x: 440, y: 320, delay: 1.1, label: "Branch 4" },
    { x: 130, y: 180, delay: 1.3, label: "Branch 5" },
    { x: 380, y: 190, delay: 1.5, label: "Branch 6" },
  ];

  return (
    <section className="relative min-h-screen flex items-center section-padding pt-20 md:pt-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-48 md:w-72 h-48 md:h-72 rounded-full bg-teal/5 animate-float-slow" />
        <div className="absolute bottom-20 left-0 w-40 md:w-56 h-40 md:h-56 rounded-full bg-health-blue/5 animate-float-reverse" />
        <div className="absolute top-1/2 left-1/4 w-32 md:w-40 h-32 md:h-40 rounded-full bg-health-green/5 animate-float" />
      </div>

      <div className="container-narrow grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border mb-5 md:mb-8"
          >
            <span className="teal-dot w-2 h-2 animate-pulse-soft" />
            <span className="text-xs md:text-sm font-medium text-muted-foreground">Multi-Branch Business Systems</span>
          </motion.div>

          <h1 className="text-display mb-4 md:mb-6">
            Run 10 branches with the{" "}
            <span className="gradient-text">same control</span> as one.
          </h1>

          <p className="text-subtitle mb-5 md:mb-8 max-w-lg">
            Monitor performance, track revenue, and standardise operations across every branch from one centralised business system.
          </p>

          <div className="space-y-3 mb-7 md:mb-10">
            {[
              "See performance of every branch instantly",
              "Identify weak branches quickly",
              "Stop chasing managers for reports",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-health-green/15 flex items-center justify-center"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <Check className="w-3 h-3 text-health-green-text" />
                </motion.div>
                <span className="text-sm font-medium text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={scrollToForm}
              className="btn-primary w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Free Consultation <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={scrollToSystem}
              className="btn-secondary w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" /> See How It Works
            </motion.button>
          </div>
        </motion.div>

        {/* Right - System Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="glass-card p-4">
            <svg viewBox="0 0 500 400" className="w-full h-auto">
              {/* Rotating outer ring */}
              <motion.circle
                cx="250" cy="200" r="160"
                fill="none"
                stroke="hsl(var(--teal))"
                strokeWidth="0.5"
                strokeDasharray="8 12"
                opacity="0.2"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 200px" }}
              />
              <motion.circle
                cx="250" cy="200" r="120"
                fill="none"
                stroke="hsl(var(--blue))"
                strokeWidth="0.5"
                strokeDasharray="4 8"
                opacity="0.15"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "250px 200px" }}
              />

              {/* Central Dashboard */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              >
                {/* Glow behind dashboard */}
                <motion.circle
                  cx="250" cy="200" r="50"
                  fill="hsl(var(--teal))"
                  opacity="0.06"
                  animate={{ r: [50, 60, 50], opacity: [0.06, 0.1, 0.06] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <rect x="190" y="155" width="120" height="90" rx="12" fill="hsl(var(--navy))" />
                <text x="250" y="195" textAnchor="middle" fill="white" fontSize="12" fontFamily="Plus Jakarta Sans" fontWeight="700">Dashboard</text>
                {/* Animated mini bars */}
                <motion.rect
                  x="210" y="210" width="25" rx="3"
                  fill="hsl(var(--teal))" opacity="0.8"
                  animate={{ height: [12, 18, 12] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.rect
                  x="240" y="215" width="25" rx="3"
                  fill="hsl(var(--green))" opacity="0.6"
                  animate={{ height: [8, 14, 8] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.rect
                  x="270" y="208" width="15" rx="3"
                  fill="hsl(var(--blue))" opacity="0.6"
                  animate={{ height: [16, 22, 16] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </motion.g>

              {branches.map((b) => (
                <BranchNode key={b.label} {...b} />
              ))}
            </svg>
          </div>

          {/* Floating metric cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="absolute -bottom-4 -left-4 glass-card p-3 !rounded-xl animate-float-slow"
          >
            <div className="text-xs text-muted-foreground mb-1">Total Revenue</div>
            <div className="font-display font-bold text-lg text-foreground">₹4.2 Cr</div>
            <div className="text-xs text-health-green-text font-semibold">↑ 18% this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            className="absolute -top-4 -right-4 glass-card p-3 !rounded-xl animate-float-reverse"
          >
            <div className="text-xs text-muted-foreground mb-1">Active Branches</div>
            <div className="font-display font-bold text-lg text-foreground">8 / 8</div>
            <div className="text-xs text-health-green-text font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-health-green animate-pulse-soft" />
              All performing
            </div>
          </motion.div>

          {/* New floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="absolute top-1/2 -right-8 glass-card p-2.5 !rounded-xl animate-float"
          >
            <div className="text-xs text-muted-foreground mb-0.5">Staff Online</div>
            <div className="font-display font-bold text-sm text-foreground">42 / 48</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
