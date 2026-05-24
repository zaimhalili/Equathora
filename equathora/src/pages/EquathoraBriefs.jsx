import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';
import EquathoraBriefsModal from '@/components/EquathoraBriefs/EquathoraBriefsModal.jsx';
import { subscribeToEquathoraBriefs } from '@/lib/equathoraBriefsService.js';
import { useAuth } from '@/hooks/useAuth.js';
import CommunityBro from '../assets/images/communityBro.svg';
import Mail from '../assets/images/Mail-amico.svg';
import { FaDiscord, FaMailBulk, FaBookmark } from 'react-icons/fa';


const EquathoraBriefsPage = () => {
    const [isBriefsModalOpen, setIsBriefsModalOpen] = useState(false);
    const { user } = useAuth() || {};

    const handleEquathoraBriefsSave = async (formData) => {
        try {
            await subscribeToEquathoraBriefs(formData);
        } catch (err) {
            console.error('Subscribe error:', err);
            throw err;
        }
    };

    return (
        <>
            <Navbar />
            <main className='w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen'>
                <div className='flex w-full justify-center items-center pb-20'>
                    <div className='flex flex-col justify-start items-center lg:items-start px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-20 gap-14'>
                        {/* Hero Section */}
                        <section className='w-full flex flex-col items-center gap-6'>
                            <div className='flex flex-col items-center'>
                                <FaMailBulk className='text-5xl' />
                                <h1 className='text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--secondary-color)] pb-2'>Join {' '}
                                    <span className="text-[var(--accent-color)] relative inline-block">
                                        Equathora Briefs
                                        <motion.svg
                                            className="absolute -bottom-2 left-0 w-full"
                                            viewBox="0 0 200 8"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.8, duration: 0.8 }}
                                        >
                                            <motion.path
                                                d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                                fill="none"
                                                stroke="var(--accent-color)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ delay: 0.8, duration: 0.8 }}
                                            />
                                        </motion.svg>
                                    </span></h1>
                                <h3 className='text-sm sm:text-xl md:text-2xl font-light'>Get <strong> weekly math practice</strong>, learning tips, and Equathora <strong>updates</strong> made for students.</h3>
                            </div>

                            <button type='button' className='py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold text-white rounded-md transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] w-1/5' onClick={() => setIsBriefsModalOpen(true)}>Get weekly updates</button>
                        </section>

                        <section className='bg-[var(--main-color)] w-full flex gap-10 p-10 rounded-md shadow-[0_0_25px_rgba(141,153,174,0.7)]'>
                            <div className='flex flex-col lg:w-2/3 '>
                                <FaBookmark className='text-3xl' />
                                <h2 className='text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] py-2'>Get Equathora Briefs for {' '}
                                    <span className="text-[var(--secondary-color)] relative inline-block">
                                        math challenges
                                        <motion.svg
                                            className="absolute -bottom-2 left-0 w-full"
                                            viewBox="0 0 200 8"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ delay: 0.8, duration: 0.8 }}
                                        >
                                            <motion.path
                                                d="M0 4 Q50 0 100 4 Q150 8 200 4"
                                                fill="none"
                                                stroke="var(--secondary-color)"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ delay: 0.8, duration: 0.8 }}
                                            />
                                        </motion.svg>
                                    </span>, insights, and updates.</h2>
                                <p className='text-sm sm:text-xl md:text-2xl max-w-3xl font-light'>Equathora Briefs delivers weekly math and logic practice, study tips, and platform news to help you learn faster. Expect concise explanations, new problem highlights, and <strong>announcements</strong>  that keep your progress on track. <br />
                                    <br />Each issue is crafted for <strong> students and mentors</strong>, with clear guidance, fresh challenge picks, and updates on Equathora <strong>features</strong> and <strong>community events</strong>.
                                </p>
                            </div>
                            <div className='w-1/3 flex justify-center'>
                                <img src={Mail} alt="Mail" className='w-72' />
                            </div>
                        </section>

                        {/* Join our community/discord */}
                        <section className='w-full flex flex-col items-center gap-6'>
                            <img src={CommunityBro} alt="Community" className='w-50' />
                            <h2 className='text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-2 relative z-10'>Join the Equathora Discord community
                                <FaDiscord className='text-[var(--dark-accent-color)] absolute -right-20  -bottom-5 -rotate-30 text-9xl -z-10' />
                            </h2>
                            <p className='text-sm sm:text-xl md:text-2xl max-w-3xl text-center font-light'>We share solutions, announcements, and <strong> friendly discussion</strong>, plus direct feedback channels for new Equathora features. Meet learners, mentors, and challenge creators who keep math <strong>fun and consistent.</strong> </p>
                            <a href='https://discord.gg/s6tNSbyhB7' target='_blank' rel="noopener noreferrer" className='py-2 md:py-3 bg-[linear-gradient(360deg,var(--accent-color),var(--dark-accent-color))] font-bold !text-white flex justify-center rounded-md transition-all duration-300 cursor-pointer active:scale-95 hover:!bg-[linear-gradient(360deg,var(--dark-accent-color),var(--dark-accent-color))] w-1/5'>Join Equathora Discord</a>
                        </section>
                    </div>
                </div>
            </main>


            <EquathoraBriefsModal
                isOpen={isBriefsModalOpen}
                onClose={() => setIsBriefsModalOpen(false)}
                onSave={handleEquathoraBriefsSave}
                userData={user ? { name: user.user_metadata?.full_name || '', email: user.email } : null}
            />
            <Footer />
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-5 text-white/60 text-xs theme-lock'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-5 text-white/60 text-xs theme-lock'>
                <a href="https://storyset.com/communication" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Communication illustrations by Storyset
                </a>
            </div>
        </>
    );
};

export default EquathoraBriefsPage;
