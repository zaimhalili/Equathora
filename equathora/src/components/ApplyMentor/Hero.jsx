import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const MotionDiv = motion.div;

const Hero = ({ onOpenBriefsModal }) => (
    <section className="flex w-full justify-center pb-8 pt-12 text-center sm:pb-10 sm:pt-16">
        <MotionDiv
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex w-full max-w-[1500px] flex-col items-center gap-4 px-[4vw] xl:px-[6vw]"
        >
            <span className="rounded-full border border-(--accent-color)/20 bg-(--accent-color)/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--dark-accent-color)">
                Equathora mentor network
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[#202231] sm:text-4xl md:text-5xl">
                Make every learning moment count.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Help shape a more thoughtful way to learn math. Share your teaching perspective and help us build tools that make student progress easier to understand.
            </p>
            <button
                type="button"
                onClick={onOpenBriefsModal}
                className="mt-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-(--dark-accent-color) px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--accent-color) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
            >
                Join the conversation
                <FaArrowRight aria-hidden="true" className="text-xs" />
            </button>
            <p className="text-xs text-slate-500">A quick, no-pressure way to stay in the loop.</p>
        </MotionDiv>
    </section>
);

export default Hero;
