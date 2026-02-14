import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatProps {
  end: number;
  suffix?: string;
  label: string;
}

const AnimatedNumber = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.ceil(end / 60);
    const interval = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [started, end]);

  return (
    <div ref={ref} className="font-heading text-4xl md:text-5xl text-primary font-bold">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const stats: StatProps[] = [
  { end: 5000, suffix: "+", label: "Happy Clients" },
  { end: 8, suffix: "+", label: "Years Experience" },
  { end: 3, suffix: "", label: "Expert Barbers" },
  { end: 50, suffix: "+", label: "Services Offered" },
];

const StatsCounter = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <AnimatedNumber end={stat.end} suffix={stat.suffix} />
              <p className="text-secondary-foreground/50 text-sm mt-2 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
