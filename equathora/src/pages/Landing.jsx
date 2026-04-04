import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
// import FeedbackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import NavigationBar from '../components/Landing/NavigationBar.jsx';
import HeroSection from '../components/Landing/HeroSection.jsx';
import TrustedBySection from '../components/Landing/TrustedBySection.jsx';
import ExercisesSection from '../components/Landing/ExercisesSection.jsx';
import WhyChooseSection from '../components/Landing/WhyChooseSection.jsx';
import HowItWorksSection from '../components/Landing/HowItWorksSection.jsx';
import TestimonialsSection from '../components/Landing/TestimonialsSection.jsx';
import LatestArticlesSection from '../components/Landing/LatestArticlesSection.jsx';
import EquathoraBriefsSection from '../components/Landing/EquathoraBriefsSection.jsx';
import CTASection from '../components/Landing/CTASection.jsx';
import { color } from 'framer-motion';

const Landing = () => {
    const navigate = useNavigate();

    // Redirect logged-in users to dashboard
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/dashboard', { replace: true });
            }
        });
    }, [navigate]);
    return (
        <>
            {/* <FeedbackBanner /> */}
            <div className="min-h-screen bg-white text-[var(--secondary-color)]">
                <NavigationBar></NavigationBar>
                <HeroSection />
                {/* <TrustedBySection /> */}
                <ExercisesSection />
                <hr class="border-[var(--french-gray)]" />
                <WhyChooseSection />
                <hr class="border-[var(--french-gray)]" />
                <HowItWorksSection />
                <hr class="border-[var(--french-gray)]" />
                <TestimonialsSection />
                <hr class="border-[var(--french-gray)]" />
                <LatestArticlesSection />
                <hr class="border-[var(--french-gray)]" />
                <CTASection />
                <EquathoraBriefsSection />
                <Footer />
                <div className="flex flex-col lg:flex-row items-center text-[var(--french-gray)] bg-[var(--secondary-color)] underline border-t-1 border-gray-50/20 font-light gap-1 text-[12px] py-3 justify-center font-[Sansation]">
                    <a href="https://www.vecteezy.com/free-png/student" target="_blank" rel="noopener noreferrer" id="#freepik-link">
                        Student PNGs by Vecteezy
                    </a>
                </div>

            </div>
        </>
    );
};

export default Landing;
