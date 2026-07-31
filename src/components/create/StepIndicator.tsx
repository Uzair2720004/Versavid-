'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const SURF = "#121218";
const BORDER = "#212129";
const ACCENT = "#8A7FFF";

const steps = [
  { id: 1, label: 'Script', description: 'Topic & format' },
  { id: 2, label: 'Media & Style', description: 'Visuals & aesthetics' },
  { id: 3, label: 'Voice & Captions', description: 'Audio & subtitles' },
  { id: 4, label: 'Review', description: 'Confirm & generate' },
];

export default function StepIndicator({ current, onStepClick }: { current: number; onStepClick: (s: number) => void }) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, i) => {
        const isComplete = current > step.id;
        const isActive = current === step.id;
        const isClickable = current > step.id;
        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <button onClick={() => isClickable && onStepClick(step.id)} disabled={!isClickable} className="flex items-center gap-3 group">
              <motion.div animate={{ scale: isActive ? 1.05 : 1 }}
                className={'relative h-9 w-9 rounded-xl flex items-center justify-center text-[13px] font-semibold transition-all duration-300 ' +
                  (isComplete ? 'text-[#8A7FFF]' : isActive ? 'text-[#EEEEF3]' : 'text-[#87869A]')}
                style={{
                  background: isComplete
                    ? 'rgba(138,127,255,0.15)'
                    : isActive
                    ? SURF
                    : BORDER,
                  border: `1px solid ${isActive ? ACCENT : BORDER}`,
                }}>
                {isComplete ? <Check className="h-4 w-4" /> : step.id}
                {isActive && <motion.span layoutId="step-glow" className="absolute inset-0 rounded-xl blur-md -z-10" style={{ background: 'rgba(138,127,255,0.25)' }} />}
              </motion.div>
              <div className="hidden sm:block text-left">
                <p className={'text-[12px] font-medium transition-colors ' + (isActive || isComplete ? 'text-[#EEEEF3]' : 'text-[#87869A]')}>{step.label}</p>
                <p className="text-[10px] text-[#87869A]">{step.description}</p>
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px relative overflow-hidden hidden sm:block" style={{ background: BORDER }}>
                <motion.div initial={{ width: '0%' }} animate={{ width: isComplete ? '100%' : '0%' }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0" style={{ background: ACCENT }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
