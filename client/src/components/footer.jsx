import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-400 mt-40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">
                <div className="sm:col-span-2 lg:col-span-1">
                    <a href="https://prebuiltui.com?utm_source=agentix">
                        <img className="h-9 w-auto" src="/assets/logo.svg" width={138} height={36} alt="logo" />
                    </a>
                    <p className="text-sm/7 mt-6">DevLink helps hackathon teams discover the right people, refine winning ideas, and deliver judge-ready MVPs faster.</p>
                </div>
                <div className="flex flex-col lg:items-start lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-white">Product</h2>
                        <a className="hover:text-slate-500 transition" href="#creations">Team Match</a>
                        <a className="hover:text-slate-500 transition" href="#about">Idea Hub</a>
                        <a className="hover:text-slate-500 transition" href="#testimonials">Judge Score</a>
                        <a className="hover:text-slate-500 transition" href="#contact">Feature Request</a>
                    </div>
                </div>
                <div className="flex flex-col lg:items-start lg:justify-center">
                    <div className="flex flex-col text-sm space-y-2.5">
                        <h2 className="font-semibold mb-5 text-white">Connect</h2>
                        <a className="hover:text-slate-500 transition" href="mailto:hello@devlink.com">hello@devlink.com</a>
                        <a className="hover:text-slate-500 transition" href="https://instagram.com/devlink" target="_blank" rel="noreferrer">Instagram</a>
                        <a className="hover:text-slate-500 transition" href="https://x.com/devlink" target="_blank" rel="noreferrer">X</a>
                        <a className="hover:text-slate-500 transition" href="https://www.linkedin.com/company/devlink" target="_blank" rel="noreferrer">LinkedIn</a>
                    </div>
                </div>
                <div>
                    <h2 className="font-semibold text-white mb-5">Launch notes</h2>
                    <div className="text-sm space-y-6 max-w-sm">
                        <p>Weekly team-building playbooks, idea prompts, and judge-prep tips to keep your next project sharp.</p>
                        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900">
                            <input className="outline-none w-full max-w-64 py-2 rounded px-2 bg-transparent" type="email" placeholder="Enter your email" />
                            <button className="bg-indigo-600 px-4 py-2 text-white rounded-full">Join</button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center border-t mt-6 border-slate-700 text-slate-500">
                Designed for hackathon teams, built to help you pitch stronger and ship smarter.
            </p>
        </motion.footer>
    );
};