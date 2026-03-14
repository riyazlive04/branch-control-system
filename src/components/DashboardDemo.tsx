import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const revenueData = [
  { name: "Branch 1", value: 18, fill: "hsl(217, 80%, 56%)" },
  { name: "Branch 2", value: 14, fill: "hsl(174, 62%, 42%)" },
  { name: "Branch 3", value: 22, fill: "hsl(160, 55%, 42%)" },
  { name: "Branch 4", value: 9, fill: "hsl(0, 72%, 51%)" },
  { name: "Branch 5", value: 16, fill: "hsl(217, 80%, 56%)" },
  { name: "Branch 6", value: 20, fill: "hsl(174, 62%, 42%)" },
];

const rankings = [
  { branch: "Branch 3", score: 94, top: true },
  { branch: "Branch 6", score: 88, top: true },
  { branch: "Branch 1", score: 82, top: false },
  { branch: "Branch 5", score: 76, top: false },
  { branch: "Branch 2", score: 71, top: false },
  { branch: "Branch 4", score: 52, top: false },
];

const getBarColor = (score: number) => {
  if (score >= 80) return "hsl(160, 55%, 42%)";
  if (score >= 60) return "hsl(217, 80%, 56%)";
  return "hsl(0, 72%, 51%)";
};

const DashboardDemo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-padding section-alt overflow-hidden">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-display text-2xl md:text-4xl lg:text-5xl mb-4">
            One dashboard. <span className="gradient-text">Complete visibility.</span>
          </h2>
          <p className="text-subtitle max-w-xl mx-auto">
            See every branch's performance at a glance. Identify winners and fix underperformers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 5 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="glass-card !p-0 overflow-hidden relative"
          style={{ perspective: "1000px" }}
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent z-20 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={inView ? { x: "100%" } : {}}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
          />

          {/* Dashboard Header */}
          <div className="bg-navy p-4 md:p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-teal font-semibold">Sirah Digital OS</p>
              <p className="text-xs text-primary-foreground/60">Multi-Branch Dashboard</p>
            </div>
            <div className="flex gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-health-blue/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-health-green/60"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-teal"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </div>
          </div>

          <div className="p-4 md:p-8 grid md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <p className="font-display font-bold text-sm text-foreground mb-3 md:mb-4">Branch Revenue (₹ Lakhs)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={revenueData} barCategoryGap="20%">
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 14%, 40%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 14%, 40%)" }} axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500} animationBegin={800}>
                    {revenueData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Rankings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <p className="font-display font-bold text-sm text-foreground mb-4">Performance Rankings</p>
              <div className="space-y-3">
                {rankings.map((r, i) => (
                  <motion.div
                    key={r.branch}
                    initial={{ opacity: 0, x: 15 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{r.branch}</span>
                        <motion.span
                          className="font-bold"
                          style={{ color: getBarColor(r.score) }}
                          initial={{ opacity: 0 }}
                          animate={inView ? { opacity: 1 } : {}}
                          transition={{ delay: 0.9 + i * 0.1 }}
                        >
                          {r.score}
                        </motion.span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${r.score}%` } : {}}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getBarColor(r.score) }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Live indicator */}
          <motion.div
            className="absolute top-4 right-16 md:top-6 md:right-6 flex items-center gap-1.5 z-10"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-health-green"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] text-primary-foreground/50 font-medium">LIVE</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardDemo;
