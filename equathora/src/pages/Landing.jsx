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

        document.title = 'Equathora | Learn Math Online with Step-by-Step Practice and Sigma AI';
        const metaDescription = document.querySelector('meta[name="description"]');
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');

        if (metaDescription) metaDescription.setAttribute('content', 'Learn math online with structured practice, step-by-step math help, and Sigma AI feedback for algebra, logic, and problem solving.');
        if (metaKeywords) metaKeywords.setAttribute('content', 'learn math online, math practice, step by step math help, ai math tutor, math problem solver, sigma ai, online math learning');
        if (ogTitle) ogTitle.setAttribute('content', 'Equathora | Learn Math Online with Step-by-Step Practice and Sigma AI');
        if (ogDescription) ogDescription.setAttribute('content', 'Practice math online with guided problem solving, step-by-step help, and Sigma AI feedback designed for real understanding.');
    }, [navigate]);
    return (
        <>
            {/* <FeedbackBanner /> */}
            <div className="min-h-screen bg-[var(--white)] text-[var(--secondary-color)]">
                <NavigationBar />
                <HeroSection />
                {/* <TrustedBySection /> */}
                <ExercisesSection />
                <hr className="border-[var(--mid-main-secondary)]" />
                <WhyChooseSection />
                <hr className="border-[var(--mid-main-secondary)]" />
                <HowItWorksSection />
                <hr className="border-[var(--mid-main-secondary)]" />
                <TestimonialsSection />
                <hr className="border-[var(--mid-main-secondary)]" />
                <LatestArticlesSection />
                <hr className="border-[var(--mid-main-secondary)]" />
                <CTASection />
                {/* <EquathoraBriefsSection /> */}
                <Footer />
                <div className="flex flex-col lg:flex-row items-center text-[var(--french-gray)] bg-[var(--secondary-color)] underline border-t-1 border-gray-50/20 font-light gap-1 text-[12px] py-3 justify-center font-[Sansation] theme-lock">
                    <a href="https://www.vecteezy.com/free-png/student" target="_blank" rel="noopener noreferrer" id="#freepik-link">
                        Student PNGs by Vecteezy
                    </a>
                </div>

            </div>
        </>
    );
};

export default Landing;
