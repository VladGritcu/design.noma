import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LuxuryDividerProps {
  className?: string;
  delay?: number;
}

const LuxuryDivider = ({ className = '', delay = 0.2 }: LuxuryDividerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div 
      ref={ref} 
      className={`divider-luxury-full ${className}`}
      aria-hidden="true"
    >
      <motion.div 
        className="line-main"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 0.25 } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay }}
      />
      <motion.div 
        className="center-glow"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 0.4 } : {}}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: delay + 0.4 }}
      />
    </div>
  );
};

export default LuxuryDivider;
