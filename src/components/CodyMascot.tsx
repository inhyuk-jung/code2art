'use client';

import { motion } from 'framer-motion';
import { Bot, Lightbulb, PenTool } from 'lucide-react';

interface CodyMascotProps {
    status: 'idle' | 'analyzing' | 'success' | 'error';
}

export default function CodyMascot({ status }: CodyMascotProps) {
    return (
        <div className="flex flex-col items-center justify-center p-6neo-box-sm bg-accent aspect-square max-w-[200px] mx-auto rounded-full overflow-visible relative border-4 border-black neo-box">

            {status === 'analyzing' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm z-10 whitespace-nowrap"
                >
                    Hmm... Let's see...
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-black rotate-45" />
                </motion.div>
            )}

            {status === 'success' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-12 bg-white px-4 py-2 border-2 border-black rounded-xl font-bold text-sm z-10 whitespace-nowrap"
                >
                    Magnificent! ✨
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-black rotate-45" />
                </motion.div>
            )}

            <motion.div
                animate={
                    status === 'analyzing'
                        ? { y: [0, -10, 0], rotate: [0, -5, 5, 0] }
                        : status === 'success'
                            ? { y: [0, -20, 0], scale: [1, 1.1, 1] }
                            : { y: [0, 5, 0] }
                }
                transition={{
                    repeat: Infinity,
                    duration: status === 'idle' ? 3 : 1,
                    ease: "easeInOut"
                }}
                className="text-foreground"
            >
                {status === 'idle' && <Bot size={64} strokeWidth={1.5} />}
                {status === 'analyzing' && <Lightbulb size={64} strokeWidth={1.5} className="text-yellow-500 animate-pulse" />}
                {status === 'success' && <PenTool size={64} strokeWidth={1.5} className="text-secondary" />}
            </motion.div>
        </div>
    );
}
