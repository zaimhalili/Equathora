import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EquathoraBriefsModal from '@/components/EquathoraBriefs/EquathoraBriefsModal.jsx';
import { subscribeToEquathoraBriefs } from '@/lib/equathoraBriefsService.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import Hero from '../components/ApplyMentor/Hero';
import WorkspacePreview from '../components/ApplyMentor/WorkspacePreview';
import HowItWorks from '../components/ApplyMentor/HowItWorks';
import FeatureShowcase from '../components/ApplyMentor/FeatureShowcase';

const ApplyMentor = () => {
    const [isBriefsModalOpen, setIsBriefsModalOpen] = useState(false);
    const { user } = useAuth() || {};

    const handleEquathoraBriefsSave = async (formData) => {
        try {
            await subscribeToEquathoraBriefs(formData);
        } catch (error) {
            console.error('Subscribe error:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen w-full bg-white text-[#2b2d42]">
            <header>
                <Navbar />
            </header>

            <main>
                <Hero onOpenBriefsModal={() => setIsBriefsModalOpen(true)} />
                <WorkspacePreview />
                <HowItWorks />
                <FeatureShowcase />
            </main>

            <Footer />
            <EquathoraBriefsModal
                isOpen={isBriefsModalOpen}
                onClose={() => setIsBriefsModalOpen(false)}
                onSave={handleEquathoraBriefsSave}
                userData={user ? { name: user.user_metadata?.full_name || '', email: user.email } : null}
            />
        </div>
    );
};

export default ApplyMentor;
