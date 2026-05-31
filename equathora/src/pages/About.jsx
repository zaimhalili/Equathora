import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHeroSection from '../components/About/sections/AboutHeroSection';
import AboutIdentitySection from '../components/About/sections/AboutIdentitySection';
import AboutPlatformStrengthsSection from '../components/About/sections/AboutPlatformStrengthsSection';
import AboutMissionSection from '../components/About/sections/AboutMissionSection';
import AboutFeaturesSection from '../components/About/sections/AboutFeaturesSection';
import AboutCtaSection from '../components/About/sections/AboutCtaSection';

const About = () => {
    return (
        <div className="font-[Sansation] w-full bg-[var(--white)] relative overflow-hidden min-h-screen flex items-center justify-center flex-col">
            <Navbar />
            <main className="relative z-10 w-full flex flex-col items-center">
                <AboutHeroSection />
                <AboutIdentitySection />
                <AboutPlatformStrengthsSection />
                <AboutMissionSection />
                <AboutFeaturesSection />
                <AboutCtaSection />
            </main>
            <Footer />
            <div className='w-full bg-[var(--secondary-color)] border-t border-white/10 flex justify-center py-5 text-white/60 text-xs theme-lock'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
            </div>
        </div>
    );
};

export default About;
