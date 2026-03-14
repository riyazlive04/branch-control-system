import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp } from "lucide-react";

const maxBarHeight = 160; // px

const bars = [
  { label: "Month 1", pct: 30, color: "hsl(217, 80%, 56%)" },
  { label: "Month 2", pct: 50, color: "hsl(217, 80%, 56%)" },
  { label: "Month 3", pct: 65, color: "hsl(174, 62%, 42%)" },
  { label: "Month 4", pct: 75, color: "hsl(174, 62%, 42%)" },
  { label: "Month 5", pct: 85, color: "hsl(160, 55%, 42%)" },
  { label: "Month 6", pct: 100, color: "hsl(160, 55%, 42%)" },
];

const ROISection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // SVG line chart points
  const chartWidth = 500;
  const chartHeight = 140;
  const points = bars.map((b, i) => ({
    x: 40 + i * ((chartWidth - 80) / (bars.length - 1)),
    y: chartHeight - 20 - (b.pct / 100) * (chartHeight - 40),
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - 20} L ${points[0].x} ${chartHeight - 20} Z`;

  return (
    <section ref={ref} className="section-padding">
      <div className="container-narrow text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <motion.div
            className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-health-green/12 flex items-center justify-center mx-auto mb-4 md:mb-6"
            animate={inView ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-health-green-text" />
          </motion.div>
          <h2 className="text-display text-xl sm:text-2xl md:text-4xl lg:text-5xl mb-4">
            If one branch improves revenue by just <span className="gradient-text">10%</span>,
            <br className="hidden md:block" /> the system pays for itself.
          </h2>
          <p className="text-subtitle max-w-xl mx-auto mb-8 md:mb-12">
            Most businesses see results within the first month of deployment.
          </p>
        </motion.div>

        {/* Animated growth chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="glass-card max-w-2xl mx-auto relative overflow-hidden"
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10"
            initial={{ x: "-100%" }}
            animate={inView ? { x: "100%" } : {}}
            transition={{ delay: 2.5, duration: 1.5 }}
          />

          {/* Animated SVG line chart */}
          <div className="mb-6">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Grid lines */}
              {[0, 1, 2, 3].map((i) => {
                const y = 20 + i * ((chartHeight - 40) / 3);
                return (
                  <line
                    key={i}
                    x1="40" y1={y}
                    x2={chartWidth - 40} y2={y}
                    stroke="hsl(210, 18%, 89%)"
                    strokeWidth="0.5"
                  />
                );
              })}

              {/* Animated area fill */}
              <motion.path
                d={areaPath}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.3 } : {}}
                transition={{ delay: 1.2, duration: 1 }}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(174, 62%, 42%)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="hsl(174, 62%, 42%)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(217, 80%, 56%)" />
                  <stop offset="50%" stopColor="hsl(174, 62%, 42%)" />
                  <stop offset="100%" stopColor="hsl(160, 55%, 42%)" />
                </linearGradient>
              </defs>

              {/* Animated line */}
              <motion.path
                d={linePath}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
              />

              {/* Data points */}
              {points.map((p, i) => (
                <motion.g key={i}>
                  {/* Pulse ring */}
                  <motion.circle
                    cx={p.x} cy={p.y} r="8"
                    fill="none"
                    stroke={bars[i].color}
                    strokeWidth="1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? {
                      opacity: [0, 0.4, 0],
                      scale: [0.5, 1.5, 0.5],
                    } : {}}
                    transition={{
                      delay: 0.8 + i * 0.2,
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  {/* Dot */}
                  <motion.circle
                    cx={p.x} cy={p.y} r="4"
                    fill="white"
                    stroke={bars[i].color}
                    strokeWidth="2.5"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.2, type: "spring" }}
                  />
                  {/* Value label */}
                  <motion.text
                    x={p.x} y={p.y - 12}
                    textAnchor="middle"
                    fill="hsl(215, 28%, 11%)"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans"
                    initial={{ opacity: 0, y: p.y - 5 }}
                    animate={inView ? { opacity: 1, y: p.y - 12 } : {}}
                    transition={{ delay: 1 + i * 0.2 }}
                  >
                    +{bars[i].pct}%
                  </motion.text>
                </motion.g>
              ))}

              {/* Month labels */}
              {points.map((p, i) => (
                <text
                  key={`label-${i}`}
                  x={p.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill="hsl(215, 14%, 46%)"
                  fontSize="9"
                  fontFamily="Inter"
                >
                  {bars[i].label}
                </text>
              ))}
            </svg>
          </div>

          {/* Bar chart below */}
          <div className="flex items-end justify-center gap-2 md:gap-5" style={{ height: `${maxBarHeight + 30}px` }}>
            {bars.map((bar, i) => (
              <div key={bar.label} className="flex flex-col items-center gap-1 md:gap-2 flex-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={inView ? { height: `${(bar.pct / 100) * maxBarHeight}px` } : {}}
                  transition={{ delay: 0.5 + i * 0.15, duration: 1, ease: "easeOut" }}
                  className="w-full max-w-[28px] md:max-w-[36px] rounded-t-lg relative overflow-hidden"
                  style={{ backgroundColor: bar.color }}
                >
                  {/* Internal shimmer on each bar */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/25 to-transparent"
                    initial={{ y: "100%" }}
                    animate={inView ? { y: "-100%" } : {}}
                    transition={{ delay: 1.2 + i * 0.15, duration: 0.8 }}
                  />
                </motion.div>
                <span className="text-[10px] md:text-xs text-muted-foreground font-medium">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border flex justify-between text-xs md:text-sm">
            <span className="text-muted-foreground">Before system</span>
            <motion.span
              className="font-display font-bold text-teal-text flex items-center gap-1"
              animate={inView ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📈
              </motion.span>
              After system →
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ROISection;
