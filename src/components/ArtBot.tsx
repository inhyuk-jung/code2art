'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '@/context/LocaleContext';

interface ArtBotProps {
    phase: 0 | 1 | 2; // 0 = confirming, 1 = painting, 2 = writing
}

// Floating sparkle
const Sparkle = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
    <motion.text
        x={x} y={y}
        fontSize="10" textAnchor="middle"
        initial={{ opacity: 0, scale: 0, y }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: y - 18 }}
        transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 1.5 }}
    >✦</motion.text>
);

// Phase 1: Robot choosing a palette (Drawing in progress)
function PaintingBot() {
    return (
        <svg viewBox="0 0 160 200" width="160" height="200">
            {/* Body */}
            <rect x="45" y="105" width="70" height="60" rx="12" fill="#FFD6CC" stroke="#333" strokeWidth="2.5" />
            {/* Belly screen */}
            <rect x="58" y="116" width="44" height="30" rx="6" fill="#fff" stroke="#ccc" strokeWidth="1.5" />
            {/* Paint strokes on screen */}
            <motion.path d="M64 131 Q80 122 96 131" stroke="#E63946" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.path d="M64 136 Q80 127 96 136" stroke="#457B9D" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }} />
            <motion.path d="M64 141 Q80 132 96 141" stroke="#F4D03F" strokeWidth="3" fill="none" strokeLinecap="round"
                animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }} />

            {/* Left arm (holding palette) */}
            <motion.g
                animate={{ rotate: [-8, 6, -8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "45px 117px" }}
            >
                <rect x="20" y="110" width="28" height="14" rx="7" fill="#FFD6CC" stroke="#333" strokeWidth="2" />
                {/* Palette */}
                <ellipse cx="16" cy="130" rx="14" ry="10" fill="#fff" stroke="#333" strokeWidth="1.5" />
                <circle cx="12" cy="128" r="3" fill="#E63946" />
                <circle cx="20" cy="126" r="3" fill="#F4D03F" />
                <circle cx="16" cy="134" r="3" fill="#457B9D" />
                <circle cx="23" cy="132" r="2.5" fill="#85C1AE" />
            </motion.g>

            {/* Right arm (holding brush, painting) */}
            <motion.g
                animate={{ rotate: [0, -25, 0, -25, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "115px 117px" }}
            >
                <rect x="112" y="110" width="28" height="14" rx="7" fill="#FFD6CC" stroke="#333" strokeWidth="2" />
                {/* Brush */}
                <line x1="138" y1="120" x2="152" y2="145" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx="154" cy="148" rx="4" ry="6" fill="#E63946" />
            </motion.g>

            {/* Head */}
            <motion.g animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: "80px", originY: "100px" }}>
                <rect x="40" y="42" width="80" height="65" rx="18" fill="#FFB5A7" stroke="#333" strokeWidth="2.5" />
                {/* Eyes */}
                <motion.ellipse cx="65" cy="70" rx="11" ry="11" fill="white" stroke="#333" strokeWidth="2" />
                <motion.ellipse cx="95" cy="70" rx="11" ry="11" fill="white" stroke="#333" strokeWidth="2" />
                <motion.circle cx="65" cy="70" r="6" fill="#333"
                    animate={{ scaleY: [1, 0.15, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
                <motion.circle cx="95" cy="70" r="6" fill="#333"
                    animate={{ scaleY: [1, 0.15, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
                {/* Blush */}
                <ellipse cx="55" cy="82" rx="8" ry="5" fill="#FFB5A7" opacity="0.7" />
                <ellipse cx="105" cy="82" rx="8" ry="5" fill="#FFB5A7" opacity="0.7" />
                {/* Smile */}
                <path d="M68 88 Q80 96 92 88" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Antenna */}
                <line x1="80" y1="42" x2="80" y2="25" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle cx="80" cy="20" r="7" fill="#FFD6CC" stroke="#333" strokeWidth="2"
                    animate={{ fill: ["#FFD6CC", "#E63946", "#F4D03F", "#457B9D", "#FFD6CC"] }}
                    transition={{ duration: 2, repeat: Infinity }} />
            </motion.g>

            {/* Sparkles */}
            <Sparkle x={28} y={60} delay={0} />
            <Sparkle x={132} y={80} delay={0.7} />
            <Sparkle x={80} y={12} delay={1.4} />

            {/* Legs */}
            <rect x="55" y="163" width="18" height="22" rx="7" fill="#FFD6CC" stroke="#333" strokeWidth="2" />
            <rect x="87" y="163" width="18" height="22" rx="7" fill="#FFD6CC" stroke="#333" strokeWidth="2" />
        </svg>
    );
}

// Phase 0: Robot thinking/choosing (Style Confirmation)
function ThinkingBot() {
    return (
        <svg viewBox="0 0 160 200" width="160" height="200">
            {/* Body */}
            <rect x="45" y="105" width="70" height="60" rx="12" fill="#E8F8F5" stroke="#333" strokeWidth="2.5" />
            {/* Thinking gears icon on belly */}
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ originX: "80px", originY: "135px" }}>
                <path d="M72 135 L88 135 M80 127 L80 143 M74 129 L86 141 M74 141 L86 129" stroke="#1ABC9C" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>

            {/* Arms - one touching chin */}
            <rect x="18" y="112" width="28" height="14" rx="7" fill="#E8F8F5" stroke="#333" strokeWidth="2" />
            <motion.g
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <rect x="112" y="110" width="14" height="28" rx="7" fill="#E8F8F5" stroke="#333" strokeWidth="2" />
            </motion.g>

            {/* Head */}
            <motion.g animate={{ y: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: "80px", originY: "100px" }}>
                <rect x="40" y="42" width="80" height="65" rx="18" fill="#D1F2EB" stroke="#333" strokeWidth="2.5" />
                {/* Eyes - looking up/sideways */}
                <ellipse cx="65" cy="65" rx="11" ry="11" fill="white" stroke="#333" strokeWidth="2" />
                <ellipse cx="95" cy="65" rx="11" ry="11" fill="white" stroke="#333" strokeWidth="2" />
                <motion.circle cx="70" cy="60" r="5" fill="#333"
                    animate={{ x: [-2, 2, -2], y: [-1, 1, -1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                <motion.circle cx="100" cy="60" r="5" fill="#333"
                    animate={{ x: [-2, 2, -2], y: [-1, 1, -1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                {/* Smile - thinking line */}
                <line x1="70" y1="88" x2="90" y2="88" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                {/* Antenna */}
                <line x1="80" y1="42" x2="80" y2="25" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle cx="80" cy="20" r="7" fill="#1ABC9C" stroke="#333" strokeWidth="2"
                    animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
            </motion.g>

            {/* Sparkles */}
            <Sparkle x={35} y={50} delay={0.2} />
            <Sparkle x={125} y={40} delay={1.1} />

            {/* Legs */}
            <rect x="55" y="163" width="18" height="22" rx="7" fill="#E8F8F5" stroke="#333" strokeWidth="2" />
            <rect x="87" y="163" width="18" height="22" rx="7" fill="#E8F8F5" stroke="#333" strokeWidth="2" />
        </svg>
    );
}

// Phase 2: Robot writing docent text (Docent creation in progress)
function WritingBot() {
    return (
        <svg viewBox="0 0 160 200" width="160" height="200">
            {/* Body */}
            <rect x="45" y="105" width="70" height="60" rx="12" fill="#D6EAF8" stroke="#333" strokeWidth="2.5" />
            {/* Notepad on belly */}
            <rect x="56" y="114" width="48" height="36" rx="5" fill="#fff" stroke="#aaa" strokeWidth="1.5" />
            {/* Writing lines animate */}
            {[0, 1, 2, 3].map((i) => (
                <motion.line
                    key={i}
                    x1="62" y1={122 + i * 7} x2="98" y2={122 + i * 7}
                    stroke="#85C1AE" strokeWidth="2" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1], opacity: [0, 1] }}
                    transition={{ duration: 0.8, delay: i * 0.4, repeat: Infinity, repeatDelay: 1.5 }}
                />
            ))}

            {/* Left arm (resting) */}
            <rect x="18" y="112" width="28" height="14" rx="7" fill="#D6EAF8" stroke="#333" strokeWidth="2" />

            {/* Right arm (writing) */}
            <motion.g
                animate={{ rotate: [0, -20, 5, -20, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "115px 117px" }}
            >
                <rect x="112" y="110" width="28" height="14" rx="7" fill="#D6EAF8" stroke="#333" strokeWidth="2" />
                {/* Pen */}
                <line x1="138" y1="118" x2="150" y2="140" stroke="#555" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="150,140 154,143 148,144" fill="#333" />
            </motion.g>

            {/* Head */}
            <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: "80px", originY: "100px" }}>
                <rect x="40" y="42" width="80" height="65" rx="18" fill="#A9D6F5" stroke="#333" strokeWidth="2.5" />
                {/* Eyes — focused / squinting */}
                <ellipse cx="65" cy="70" rx="11" ry="8" fill="white" stroke="#333" strokeWidth="2" />
                <ellipse cx="95" cy="70" rx="11" ry="8" fill="white" stroke="#333" strokeWidth="2" />
                <motion.ellipse cx="65" cy="70" rx="6" ry="5" fill="#333"
                    animate={{ rx: [6, 4, 6], x: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <motion.ellipse cx="95" cy="70" rx="6" ry="5" fill="#333"
                    animate={{ rx: [6, 4, 6], x: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                {/* Thinking eyebrows */}
                <path d="M57 60 Q65 56 73 60" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M87 60 Q95 56 103 60" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Blush */}
                <ellipse cx="55" cy="82" rx="8" ry="5" fill="#A9D6F5" opacity="0.6" />
                <ellipse cx="105" cy="82" rx="8" ry="5" fill="#A9D6F5" opacity="0.6" />
                {/* Determined smile */}
                <path d="M70 88 Q80 93 90 88" stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Antenna */}
                <line x1="80" y1="42" x2="80" y2="25" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
                <motion.circle cx="80" cy="20" r="7" fill="#A9D6F5" stroke="#333" strokeWidth="2"
                    animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                {/* Thought bubbles */}
                <motion.text x="115" y="52" fontSize="9" animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>💭</motion.text>
            </motion.g>

            {/* Sparkles */}
            <Sparkle x={30} y={55} delay={0.3} />
            <Sparkle x={130} y={65} delay={1.1} />

            {/* Legs */}
            <motion.rect x="55" y="163" width="18" height="22" rx="7" fill="#D6EAF8" stroke="#333" strokeWidth="2"
                animate={{ y: [163, 160, 163] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
            <motion.rect x="87" y="163" width="18" height="22" rx="7" fill="#D6EAF8" stroke="#333" strokeWidth="2"
                animate={{ y: [163, 166, 163] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} />
        </svg>
    );
}

export default function ArtBot({ phase }: ArtBotProps) {
    const { t } = useLocale();

    const phaseInfo = [
        { num: 1, label: t('bot.phase1.label'), sub: t('bot.phase1.sub') },
        { num: 2, label: t('bot.phase2.label'), sub: t('bot.phase2.sub') },
        { num: 3, label: t('bot.phase3.label'), sub: t('bot.phase3.sub') },
    ];

    // phase: 0 = thinking/style confirm, 1 = painting, 2 = writing docent
    const currentStep = phase + 1;
    const info = phaseInfo[currentStep - 1];

    return (
        <div className="flex flex-col items-center gap-2 py-4">
            {/* Robot */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={phase}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.4 }}
                >
                    {phase === 0 ? <ThinkingBot /> : phase === 1 ? <PaintingBot /> : <WritingBot />}
                </motion.div>
            </AnimatePresence>

            {/* Step indicators */}
            <div className="flex items-center gap-3 mt-1">
                {phaseInfo.map((s) => (
                    <div key={s.num} className="flex items-center gap-1.5">
                        <motion.div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                ${currentStep > s.num ? 'bg-primary border-primary text-white'
                                    : currentStep === s.num ? 'border-secondary bg-secondary text-white'
                                        : 'border-gray-200 text-gray-300'}`}
                            animate={currentStep === s.num ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        >
                            {currentStep > s.num ? '✓' : s.num}
                        </motion.div>
                        <span className={`text-xs font-medium hidden sm:inline ${currentStep === s.num ? 'text-secondary font-bold' : currentStep > s.num ? 'text-gray-400' : 'text-gray-200'}`}>
                            {s.label}
                        </span>
                        {s.num < 3 && <div className="w-4 h-px bg-gray-200" />}
                    </div>
                ))}
            </div>

            {/* Status message */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={info.sub}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-gray-500 font-medium text-center mt-1"
                >
                    {info.sub}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}
