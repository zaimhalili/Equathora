import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const MotionDiv = motion.div;

const FinalCallToAction = ({ onOpenBriefsModal }) => (
    <section className="flex w-full justify-center py-12 sm:py-16">
        <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="flex w-full max-w-[1500px] flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-[4vw] py-9 text-center xl:px-[6vw] sm:py-12"
        >
            <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-(--dark-accent-color)">Built with educators</span>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-[#202231] sm:text-3xl">Your experience can help shape what comes next.</h2>
            <p className="max-w-xl text-sm leading-6 text-slate-600">Join Equathora Briefs to hear what we’re building and share the ideas that matter to your learners.</p>
            <button
                type="button"
                onClick={onOpenBriefsModal}
                className="mt-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-(--dark-accent-color) px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--accent-color) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
            >
                Join Equathora Briefs
                <FaArrowRight aria-hidden="true" className="text-xs" />
            </button>
        </MotionDiv>
    </section>
);

export default FinalCallToAction;