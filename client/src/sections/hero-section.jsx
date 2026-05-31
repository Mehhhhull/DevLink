import { ArrowRight } from "lucide-react";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import TiltedImage from "../components/tilt-image";

export default function HeroSection() {
    return (
        <section className="flex flex-col items-center -mt-18">
            <motion.svg className="absolute -z-10 w-full -mt-40 md:mt-0" width="1440" height="676" viewBox="0 0 1440 676" fill="none" xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5}}
            >
                <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#a)" />
                <defs>
                    <radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
                        <stop offset=".63" stopColor="#372AAC" stopOpacity="0" />
                        <stop offset="1" stopColor="#372AAC" />
                    </radialGradient>
                </defs>
            </motion.svg>
            <motion.a className="flex items-center mt-48 gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="size-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Find the right hackathon co-founder</span>
            </motion.a>
            <motion.h1 className="text-center text-4xl sm:text-5xl md:text-6xl leading-tight sm:leading-[58px] md:leading-[64px] mt-4 font-semibold max-w-3xl"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                Build balanced teams, pitch stronger ideas, and launch better projects
            </motion.h1>
            <motion.p className="text-center text-sm sm:text-base max-w-2xl mt-3"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                DevLink helps hackathon teams discover compatible teammates, validate ideas, and shape winning MVPs with AI-powered matchmaking, idea roadmaps, and judge-aware feedback.
            </motion.p>
            <motion.div className="flex items-center gap-4 mt-8"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white active:scale-95 rounded-lg px-7 h-11">
                    Explore DevLink
                    <ArrowRight className="size-5" />
                </button>
                    <a href="https://github.com/Mehhhhull" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 border border-slate-400 active:scale-95 hover:bg-white/10 transition rounded-lg px-6 h-11 text-slate-100">
                        <Github className="w-4 h-4" />
                        <span className="font-medium">Follow on GitHub</span>
                    </a>
            </motion.div>
            <TiltedImage />
        </section>
    );
}