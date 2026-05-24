import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <a href="https://prebuiltui.com?utm_source=agentix">
                    <img className="h-9 w-auto" src="/assets/logo.svg" width={138} height={36} alt="logo" />
                </a>

                <div className="hidden lg:block space-x-3">
                    <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md active:scale-95">
                        Try DevLink
                    </button>
                    <button className="hover:bg-slate-300/20 transition px-6 py-2 border border-slate-400 rounded-md active:scale-95">
                        Sign in
                    </button>
                </div>
            </motion.nav>
        </>
    );
}