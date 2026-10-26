import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import NavigationBar from '@/components/Landing/NavigationBar';
import Footer from '../components/Footer';
import AboutHeroSection from '../components/About/sections/AboutHeroSection';
import AboutIdentitySection from '../components/About/sections/AboutIdentitySection';
import AboutPlatformStrengthsSection from '../components/About/sections/AboutPlatformStrengthsSection';
import AboutMissionSection from '../components/About/sections/AboutMissionSection';
import AboutFeaturesSection from '../components/About/sections/AboutFeaturesSection';
import AboutCtaSection from '../components/About/sections/AboutCtaSection';
import { useAuth } from '@/hooks/useAuth';
import AboutMainSection from '@/components/About/sections/AboutMainSection';

const About = () => {
    const { user } = useAuth();

    useEffect(() => {
        document.title = 'About Equathora | Learn Math Online with Guided Practice and Sigma AI';
        const metaDescription = document.querySelector('meta[name="description"]');
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');

        if (metaDescription) metaDescription.setAttribute('content', 'Discover how Equathora helps students learn math online with step-by-step guidance, structured practice, and Sigma AI support.');
        if (metaKeywords) metaKeywords.setAttribute('content', 'about equathora, learn math online, step by step math help, ai math tutor, math practice platform, sigma ai');
        if (ogTitle) ogTitle.setAttribute('content', 'About Equathora | Learn Math Online with Guided Practice and Sigma AI');
        if (ogDescription) ogDescription.setAttribute('content', 'Equathora combines structured math practice with step-by-step guidance and Sigma AI support to help learners build confidence.');
    }, []);

    return (
        <div className=" w-full bg-(--white) relative overflow-hidden min-h-screen flex items-center justify-center flex-col">
            {/* Conditional Navigation */}
            {user ? <Navbar /> : <NavigationBar />}

            <main className="relative z-10 w-full flex flex-col items-center">
                <AboutMainSection />
                {/* <AboutHeroSection /> */}
                <AboutIdentitySection />
                {/* <AboutPlatformStrengthsSection /> */}
                <AboutMissionSection />
                <AboutFeaturesSection />
                <AboutCtaSec    tion />
            </main>
            <Footer />
            <div className='w-full bg-(--secondary-color) border-t border-white/10 flex justify-center py-5 text-white/60 text-xs theme-lock'>
                <a href="https://storyset.com/education" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>
                    Education illustrations by Storyset
                </a>
                <a href="https://www.vecteezy.com/free-png/male-teacher" target="_blank" rel="noopener noreferrer" className='hover:text-white/80 transition-colors no-underline'>Male Teacher PNGs by Vecteezy</a>
            </div>
        </div>
    );
};

export default About;