import { useRef, useState } from 'react';
import { useMotionValue, useSpring, motion } from 'framer-motion';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedImage({ rotateAmplitude = 3, }) {
    const ref = useRef(null);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);

    const [lastY, setLastY] = useState(0);

    function handleMouse(e) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        setLastY(offsetY);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <motion.figure ref={ref} className="relative w-full h-full [perspective:800px] mt-16 max-w-4xl mx-auto flex flex-col items-center justify-center" onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <motion.div className="relative [transform-style:preserve-3d] w-full max-w-4xl" style={{ rotateX, rotateY }} >
                <div className="bg-slate-950/95 border border-slate-700 rounded-[22px] shadow-[0_40px_120px_rgba(15,23,42,0.45)] overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 border-b border-slate-700">
                        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        <div className="ml-auto text-xs uppercase tracking-[0.2em] text-slate-500">
                            devlink / roadmap
                        </div>
                    </div>
                    <div className="p-6 text-slate-200 font-mono text-sm leading-6 space-y-2">
                        <div className="overflow-hidden">
                            <div className="terminal-line" style={{ animation: 'typing 1.5s steps(40,end) 0.25s forwards', width: 0 }}>
                                const idea = {'{'}
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="terminal-line" style={{ animation: 'typing 1.5s steps(40,end) 0.4s forwards', width: 0 }}>
                                &nbsp;&nbsp;title: 'Smart Campus Assistant',
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="terminal-line" style={{ animation: 'typing 1.5s steps(40,end) 0.55s forwards', width: 0 }}>
                                &nbsp;&nbsp;domain: 'AI/ML',
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="terminal-line" style={{ animation: 'typing 1.5s steps(40,end) 0.7s forwards', width: 0 }}>
                                &nbsp;&nbsp;stack: ['React', 'Node.js', 'TensorFlow'],
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="terminal-line" style={{ animation: 'typing 1.5s steps(40,end) 0.85s forwards', width: 0 }}>
                                &nbsp;&nbsp;roadmap: 'MVP -> Prototype -> Pitch',
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="terminal-line" style={{ animation: 'typing 1.5s steps(40,end) 1s forwards', width: 0 }}>
                                {'}'};
                                <span className="inline-block ml-2 animate-blink">|</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.figure>
    );
}