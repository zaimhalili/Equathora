import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const Hero = ({ onOpenBriefsModal }) => (
    <section className="flex w-full justify-center pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
        <MotionDiv
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex w-full max-w-[1500px] flex-col items-center gap-3 px-[4vw] xl:px-[6vw]"
        >
            <h1 className="max-w-[760px] text-[32px] font-medium leading-[1.12] tracking-tight text-[#171717] sm:text-[40px]">
                Help shape the future of math learning
            </h1>
            <p className="max-w-[490px] text-[14px] leading-[1.45] text-[#666] sm:text-[15px]">
                Share your teaching experience and help us build clearer, more supportive ways for students to learn math.
            </p>
            <button
                type="button"
                onClick={onOpenBriefsModal}
                className="mt-2 inline-flex min-h-8 items-center justify-center rounded-full bg-[#171717] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-(--dark-accent-color) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color)"
            >
                Get involved
            </button>
        </MotionDiv>
    </section>
);

export default Hero;
