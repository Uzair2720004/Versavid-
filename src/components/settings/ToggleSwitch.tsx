'use client';
import { motion } from 'framer-motion';

export default function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange?: () => void }) {
  return (
    <button onClick={onChange} className={'relative h-6 w-11 rounded-full transition-colors duration-300 ' + (enabled ? 'bg-cyan-400' : 'bg-white/10')}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md ' + (enabled ? 'right-0.5' : 'left-0.5')} />
    </button>
  );
}
