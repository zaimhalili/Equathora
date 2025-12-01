import React from 'react';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import Footer from '../components/Footer.jsx';
import NavigationBar from '../components/Landing/NavigationBar.jsx';
import HeroSection from '../components/Landing/HeroSection.jsx';
import FeaturesSection from '../components/Landing/FeaturesSection.jsx';
import WhyChooseSection from '../components/Landing/WhyChooseSection.jsx';
import HowItWorksSection from '../components/Landing/HowItWorksSection.jsx';
import TestimonialsSection from '../components/Landing/TestimonialsSection.jsx';
import CTASection from '../components/Landing/CTASection.jsx';

const Landing = () => {
    return (
        <>
            <FeedbackBanner />
            <div className="min-h-screen bg-white text-[var(--secondary-color)]">
                <NavigationBar />
                <HeroSection />
                <FeaturesSection />
                <WhyChooseSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <CTASection />
                <Footer />
            </div>
        </>
    );
};

export default Landing;
