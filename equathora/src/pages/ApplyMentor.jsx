import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/ApplyMentor/Hero';
import WorkspacePreview from '../components/ApplyMentor/WorkspacePreview';
import HowItWorks from '../components/ApplyMentor/HowItWorks';
import FeatureShowcase from '../components/ApplyMentor/FeatureShowcase';
import Testimonials from '../components/ApplyMentor/Testimonials';

const ApplyMentor = () => {
    return (
        <div className="min-h-screen w-full bg-white text-[#2b2d42]">
            <header>
                <Navbar />
            </header>

            <main>
                <Hero />
                <WorkspacePreview />
                <HowItWorks />
                <FeatureShowcase />
                <Testimonials />
            </main>

            <Footer />
        </div>
    );
};

export default ApplyMentor;
