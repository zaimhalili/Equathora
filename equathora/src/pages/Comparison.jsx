import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowRight, FaCheck, FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import NavigationBar from '../components/Landing/NavigationBar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import ProblemPreview from '../assets/images/problemSC.png';
import Aashrun from '../assets/images/aashrun.jpg';
import Sanya from '../assets/images/sanya.jpg';
import Rudransh from '../assets/images/rudransh.jpg';
import Sigma from '../assets/logo/TransparentSymbol.png';

const comparisons = {
    'khan-academy': {
        name: 'Khan Academy',
        title: 'Equathora vs Khan Academy',
        description: 'Compare Equathora and Khan Academy for structured math practice, guided problem solving, and feedback that helps you understand each step.',
        intro: 'Khan Academy is a broad, trusted learning library. Equathora is built around a narrower loop: choose a challenge, work through it, review your reasoning, and return tomorrow.',
        source: 'https://www.khanacademy.org/',
        sourceLabel: 'Khan Academy',
        questions: [
            ['Is Equathora free like Khan Academy?', 'Equathora offers free math practice, with additional features available through its Premium plan. Khan Academy provides a broad free education library supported by donations.'],
            ['Which platform is better for practicing math?', 'That depends on your goal. Khan Academy is a strong choice for lessons and broad course coverage. Equathora is designed for learners who want a focused, repeatable problem-solving practice loop.'],
            ['Does Equathora replace Khan Academy?', 'No. They serve different learning rhythms. Equathora can complement video lessons with deliberate practice and step-by-step work.']
        ]
    },
    brilliant: {
        name: 'Brilliant',
        title: 'Equathora vs Brilliant',
        description: 'See how Equathora compares with Brilliant for math practice, problem difficulty, step-by-step work, and building a consistent learning habit.',
        intro: 'Brilliant is known for interactive lessons and guided discovery. Equathora puts more of the focus on solving a curated problem, showing your work, and learning from the attempt.',
        source: 'https://brilliant.org/',
        sourceLabel: 'Brilliant',
        questions: [
            ['How is Equathora different from Brilliant?', 'Brilliant emphasizes interactive courses and conceptual discovery. Equathora centers on a practice-first workflow with written work, problem progression, and feedback on the solving process.'],
            ['Is Equathora good for advanced learners?', 'Equathora includes difficulty levels through advanced problems. The best fit depends on your current goals, topic coverage, and preference for practice or interactive lessons.'],
            ['Can I use Equathora and Brilliant together?', 'Yes. Brilliant can help you explore a concept, while Equathora gives you a place to practice applying it consistently.']
        ]
    },
    ixl: {
        name: 'IXL',
        title: 'Equathora vs IXL',
        description: 'Compare Equathora and IXL for math practice, feedback, progress tracking, and a focused learning experience.',
        intro: 'IXL offers extensive skills practice and progress analytics. Equathora keeps the experience more open-ended, with a workspace designed for reasoning, reflection, and steady problem-solving practice.',
        source: 'https://www.ixl.com/',
        sourceLabel: 'IXL',
        questions: [
            ['What is the main difference between Equathora and IXL?', 'IXL is organized around a large skills library and detailed practice analytics. Equathora is organized around problems, written reasoning, and a learning journey that encourages consistency.'],
            ['Does Equathora have adaptive practice?', 'Equathora recommends problems based on your journey and activity. Its experience is designed to support deliberate practice rather than replace a full school curriculum.'],
            ['Which platform is better for independent learners?', 'Both can support independent learning. Equathora is a good fit if you want a calm, focused workspace for solving problems and reviewing progress.']
        ]
    }
};

const features = [
    ['Focused math problem practice', 'A practice-first experience centered on solving and reviewing problems.', 'Broad math and subject library', 'Interactive course lessons', 'Skills-based practice library'],
    ['Step-by-step written work', 'Write your reasoning in a workspace instead of only selecting an answer.', 'Guided hints and explanations', 'Guided interactive prompts', 'Answer feedback and skill practice'],
    ['Progress and consistency', 'Streaks, achievements, journey progress, and personal statistics.', 'Course progress and mastery', 'Daily learning paths', 'Progress analytics and SmartScore'],
    ['AI-supported feedback', 'Sigma AI support is available for eligible Equathora plans.', 'Khanmigo is a separate AI experience', 'AI features vary by plan and region', 'AI-powered recommendations and explanations'],
    ['Best fit', 'Learners who want structured problem solving and a repeatable habit.', 'Learners who want a broad free learning library.', 'Learners who enjoy interactive, discovery-based lessons.', 'Learners who want extensive skills practice and analytics.']
];

const testimonials = [
    { image: Aashrun, name: 'Aashrun Gautam', role: 'Founder of SleepLeads', quote: 'It is actually well-designed. And it lets you practice math chapter by chapter, with a huge database of questions.', link: 'https://www.linkedin.com/posts/aashrun-gautam-72572a1a5_equathora-master-math-through-practice-activity-7423286785453174785-mgSJ' },
    { image: Sanya, name: 'Sanya Lumagbas', role: 'High School STEM Teacher', quote: 'Equathora made teaching math so much easier. Students build confidence through leveled questions from Easy all the way up to Hard.', link: 'https://www.linkedin.com/in/snylumagbas/' },
    { image: Rudransh, name: 'Rudransh Shukla', role: 'Co-Founder and CEO of OpennMind', quote: 'Equathora is a very well-built platform that makes math practice feel simple, engaging, and easy to follow.', link: 'https://www.linkedin.com/in/rudransh-shukla-669865248/' }
];

function Comparison() {
    const { competitor = 'khan-academy' } = useParams();
    const comparison = comparisons[competitor] || comparisons['khan-academy'];
    const { user } = useAuth();

    useEffect(() => {
        document.title = `${comparison.title} | Equathora`;
        const description = document.querySelector('meta[name="description"]');
        const keywords = document.querySelector('meta[name="keywords"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (description) description.setAttribute('content', comparison.description);
        if (keywords) keywords.setAttribute('content', `${comparison.name} alternative, Equathora vs ${comparison.name}, math practice, learn math online`);
        if (ogTitle) ogTitle.setAttribute('content', `${comparison.title} | Equathora`);
        if (ogDescription) ogDescription.setAttribute('content', comparison.description);
    }, [comparison]);

    return (
        <div className="w-full bg-[var(--white)] bg-fixed min-h-screen">
            {user ? <Navbar /> : <NavigationBar />}
            <div className='flex w-full justify-center items-center'>
                <main className="flex flex-col px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-20 gap-12">
                    <section className="flex flex-col gap-6 justify-center items-center">
                        <div className="flex gap-2 items-center text-[var(--secondary-color)]/70 text-md font-medium">
                            <img src={Sigma} alt="Equathora Logo" className='w-12 h-12' loading='lazy'/>
                            vs
                            <img src={Sigma} alt="Equathora Logo" className='w-12 h-12' loading='lazy'/>
                        </div>
                        <h1 className='text-4xl text-center font-medium'>{comparison.title}</h1>
                        <p className="text-md text-[var(--secondary-color)]/70 max-w-2xl">{comparison.intro}</p>
                    </section>

                    <section className="comparison-section" aria-labelledby="feature-comparison-title">
                        <div className="comparison-shell">
                            <div className="section-heading">
                                <p className="text-4xl font-medium">Feature comparison</p>
                                <h2 id="feature-comparison-title">Choose the learning loop that fits you</h2>
                                <p>Each platform does something useful. The difference is how much of your time is spent watching, exploring, or solving.</p>
                            </div>
                            <div className="bg-[var(--main-color)] p-6">
                                <div className="bg-[var(--white)] rounded-2xl" role="table" aria-label={`Equathora compared with ${comparison.name}`}>
                                    <div className="flex justify-around text-xl" role="row">
                                        <div role="py-3">What matters</div>
                                        <div role="py-3">{comparison.name}</div>
                                        <div role="py-3">Equathora</div>
                                    </div>
                                    {features.map(([feature, equathora, khan, brilliant, ixl]) => {
                                        const competitorText = comparison.name === 'Khan Academy' ? khan : comparison.name === 'Brilliant' ? brilliant : ixl;
                                        return <div className="border border-[var(--main-color)] flex justify-around" role="row" key={feature}>
                                            <div role="p-6 max-w-1/3 flex-1" className="feature-name">{feature}</div>
                                            <div role="p-6 max-w-1/3 flex-1">{competitorText}</div>
                                            <div role="p-6 max-w-1/3 flex-1"><FaCheck aria-hidden="true" />{equathora}</div>
                                        </div>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="comparison-section comparison-testimonials" aria-labelledby="testimonials-title">
                        <div className="comparison-shell">
                            <div className="section-heading"><p className="comparison-eyebrow">From Equathora learners</p><h2 id="testimonials-title">Real people, real feedback</h2><p>These testimonials are published with the speaker's name and a public reference. No anonymous claims, no invented scores.</p></div>
                            <div className="testimonial-list">
                                {testimonials.map((testimonial) => <a className="testimonial-card" href={testimonial.link} target="_blank" rel="noopener noreferrer" key={testimonial.name}>
                                    <img src={testimonial.image} alt={testimonial.name} loading="lazy" />
                                    <div><p className="testimonial-quote">{testimonial.quote}</p><p className="testimonial-name">{testimonial.name}</p><p className="testimonial-role">{testimonial.role} <FaExternalLinkAlt aria-hidden="true" /></p></div>
                                </a>)}
                            </div>
                        </div>
                    </section>

                    <section className="comparison-section comparison-faq" aria-labelledby="faq-title">
                        <div className="comparison-shell comparison-faq-shell">
                            <div className="section-heading"><p className="comparison-eyebrow">Frequently asked questions</p><h2 id="faq-title">Still deciding?</h2></div>
                            <div className="faq-list">
                                {comparison.questions.map(([question, answer]) => <details key={question}><summary>{question}<FaChevronDown aria-hidden="true" /></summary><p>{answer}</p></details>)}
                            </div>
                        </div>
                    </section>

                    <section className="comparison-cta">
                        <div className="comparison-shell comparison-cta-content"><div><h2>Make practice feel more intentional.</h2><p>Start with one problem and build from there.</p></div><Link to="/signup" className="comparison-primary-button">Get started <FaArrowRight aria-hidden="true" /></Link></div>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default Comparison;