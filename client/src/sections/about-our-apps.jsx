import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function AboutOurApps() {
    const sectionData = [
        {
            title: "Smart Team Matching",
            description: "Find complementary teammates with skill, stack, domain and availability filters plus AI compatibility scores.",
            image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png",
            className: "py-6 md:py-4 md:px-6"
        },
        {
            title: "Idea Hub",
            description: "Share and discover vetted hackathon ideas—upvote trends and get personalized MVP roadmaps.",
            image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png",
            className: "py-6 md:py-4 md:px-6"
        },
        {
            title: "AI Judge System",
            description: "Automated RAG-powered scoring and judge-style feedback to improve innovation, feasibility and demo appeal.",
            image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png",
            className: "py-6 md:py-4 md:px-6"
        },
        {
            title: "Mentor Ecosystem",
            description: "Connect with mentors and domain channels for hands-on guidance during your hackathon.",
            image: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="44" height="44" className="text-indigo-400">
                    <path d="M3 11v2h4l7 4V7L7 11H3z" fill="currentColor" />
                    <path d="M21 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            className: "py-6 md:py-4 md:px-6"
        },
    ];
    return (
        <section className="flex flex-col items-center" id="about">
            <SectionTitle title="How DevLink helps teams" description="Discover teammates with filterable skills, tech stacks, domains, availability and experience; explore community-sourced ideas in the Idea Hub; receive AI-generated tech stacks, prioritized roadmaps and judge-style feedback powered by RAG and historical-winning intelligence." />
            <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-0 gap-6 mt-18">
                {sectionData.map((data, index) => (
                    <motion.div key={data.title} className={data.className}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <div className="h-12 w-12 p-2 bg-indigo-600/20 border border-indigo-600/30 rounded flex items-center justify-center">
                            {typeof data.image === 'string' ? (
                                <img src={data.image} alt={data.title} className="h-8 w-8 object-contain" />
                            ) : (
                                data.image
                            )}
                        </div>
                        <div className="mt-5 space-y-2">
                            <h3 className="text-base font-medium text-slate-200">{data.title}</h3>
                            <p className="text-sm text-slate-400">{data.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}