import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import NavigationBar from '../components/Landing/NavigationBar.jsx';
import HeroSection from '../components/Landing/HeroSection.jsx';
import TrustedBySection from '../components/Landing/TrustedBySection.jsx';
import FeaturesSection from '../components/Landing/FeaturesSection.jsx';
import WhyChooseSection from '../components/Landing/WhyChooseSection.jsx';
import HowItWorksSection from '../components/Landing/HowItWorksSection.jsx';
import TestimonialsSection from '../components/Landing/TestimonialsSection.jsx';
import LatestArticlesSection from '../components/Landing/LatestArticlesSection.jsx';
import WaitlistSection from '../components/Landing/WaitlistSection.jsx';
import CTASection from '../components/Landing/CTASection.jsx';

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
                <TrustedBySection />
                <FeaturesSection />
                <WhyChooseSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <LatestArticlesSection />
                <CTASection />
                <WaitlistSection />
                <Footer />
                <a href="https://www.vecteezy.com/free-png/student">Student PNGs by Vecteezy</a>
                <a href="https://www.vecteezy.com/free-photos/paper">Paper Stock photos by Vecteezy</a>
            </div>
        </>
    );
};

export default Landing;
