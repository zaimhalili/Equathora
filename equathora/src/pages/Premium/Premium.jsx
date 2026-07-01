import React, { useMemo, useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaAngleDown, FaQuoteLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Premium = ({ premium = false }) => {
  const freeFeatures = [
    { bold: "Daily Math Challenges", text: " (standard problems)" },
    { bold: "Step-by-step LaTeX workspace", text: "" },
    { bold: "Basic completion stats", text: "" },
    { bold: "~250 curated foundational problems", text: "" },
    { bold: "\"Correct / Incorrect\" answer feedback", text: "" }
  ];
  const proFeatures = [
    { bold: "Sigma AI Step Debugger", text: " - pinpoints the exact line where your algebra breaks and explains why" },
    { bold: "Mistake Vault", text: " - tracks your errors over time and surfaces your most common slip-ups" },
    { bold: "Advanced Problem Sets", text: " - Bayes' Theorem, Combinatorics, Olympiad-style riddles, Number Theory" },
    { bold: "LaTeX PDF Export", text: " - download your solved steps as a clean, print-ready PDF" },
    { bold: "Interactive AI Chat (Sigma Mentor)", text: " - ask follow-up questions after a hint, like a live tutor" }
  ];
  const faq = [
    { q: "Can I cancel my subscription anytime?", a: "Yes. Cancel from your account settings at any time. You keep Pro access until the end of your billing period." },
    { q: "Is my payment information secure?", a: "All payments are processed by Stripe - Equathora never sees or stores your card details." },
    { q: "What problem types are behind the Pro wall?", a: "Advanced Combinatorics, Bayes' Theorem, Number Theory, and Olympiad-style Logic Riddles are exclusively available to Pro members." },
    { q: "How does the Sigma AI Mentor work?", a: "Submit your math steps on the workspace and Sigma scans them line by line, pinpointing exactly where your algebra breaks and explaining why." },
    { q: "What is the Mistake Vault?", a: "The Mistake Vault logs every error you make over time and surfaces your most repeated slip-ups, so you can focus your practice where it actually matters." },
    { q: "Can I export my work as a PDF?", a: "Yes - Pro members can download their completed step-by-step solutions as a clean, print-ready PDF directly from the workspace." },
  ]


  return (
    <div>
      <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen font-[Sansation,sans-serif]">
        <Navbar />
        <section className='flex w-full justify-center items-center'>
          <div className='flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:py-6'>
            <h1 className='text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--black)] pb-2'>Premium</h1>
            <h2 className='text-sm sm:text-xl md:text-2xl font-light text-center'>Find the ideal plan that fits your budget and goals. Make informed choices with ease.</h2>
            {/* Premium Card Section */}
            <article className="flex gap-5 pt-10 items-center lg:flex-row flex-col-reverse">
              {/* Card 1 */}
              <div className='rounded-md flex-col flex bg-[var(--main-color)] px-8 py-10 gap-8 h-fit lg:w-2/5'>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-[var(--secondary-color)]">Free
                  </h3>
                  <p className="text-md text-[var(--secondary-color)]/80 font-light">
                    Master your foundational math skills completely for free with <strong>unlimited access</strong> to our standard challenge sets and <strong>interactive step-by-step canva.</strong>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2 items-end">
                      <h3 className="text-4xl md:text-5xl text-[var(--secondary-color)] font-bold">€0.00
                        <span className='text-2xl text-[var(--secondary-color)]/80 font-medium'>/mo</span>
                      </h3>
                    </div>
                  </div>

                  <Link to={'/login'} className='bg-[var(--black)] !text-[var(--white)] py-2 rounded-md text-xl hover:contrast-80 active:scale-95 transition-all duration-200 text-center !font-normal'>Get Started</Link>
                  <ul>
                    {freeFeatures.map((feature, idx) => (
                      <li key={idx}>
                        <strong>{feature.bold}</strong>{feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2 */}
              <div className='rounded-md flex-col flex bg-gradient-to-t from-amber-600 to-amber-400 px-8 py-10 gap-10 shadow-xl border-2 lg:w-3/5'>
                <div className="flex flex-col gap-5">
                  <h3 className="text-2xl font-bold text-black">Monthly
                    <span className='text-black/50 text-lg pl-3 font-normal'>billed monthly</span>
                  </h3>
                  <p className="text-md text-black/80 font-light">
                    An <strong>affordable</strong>, high-return investment in your math education that pays off with every problem you solve.
                    <br />Unlock full access to your <strong>24/7 AI</strong> mentor and start turning your <strong>common math mistakes</strong> into <strong> maximum exam points
                    </strong> today.
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2 items-end">
                      <h3 className="text-2xl md:text-3xl font-medium line-through text-black/50">€19.99</h3>
                      <h3 className="text-4xl md:text-5xl text-black font-bold">€14.99
                        <span className='text-2xl text-black/80 font-medium'>/mo</span>
                      </h3>
                    </div>
                    <p className='text-md text-black/80 font-light xl:block hidden'>Prices are marked in Euros</p>
                  </div>

                  <button type="button" className='bg-[var(--black)] text-[var(--white)] py-2 rounded-md text-xl hover:contrast-80 active:scale-95 transition-all duration-200'>Subscribe</button>
                  <ul className=''>
                    {proFeatures.map((feature, idx) => (
                      <li key={idx}>
                        <strong>{feature.bold}</strong>{feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            {/* Feedback OsRadar */}
            <article className='flex lg:flex-row flex-col w-full justify-between items-center gap-5 text-[var(--secondary-color)] py-30'>
              <h4 className='text-3xl md:text-4xl font-bold pb-2'>What others are <br /> saying about us?</h4>
              <div className='lg:max-w-3/5 flex flex-col gap-3 relative items-center md:items-start'>
                <FaQuoteLeft className='text-[var(--secondary-color)] absolute w-3 h-3 -left-5 hidden md:flex' />
                <p className='text-xl md:text-2xl text-center md:text-left'>
                  Equathora is an <strong>excellent tool</strong> for the “serious” math student, specifically those preparing for Math Olympiads or early undergraduate STEM courses. It removes the friction of finding quality problems and provides <strong>a superior input method</strong> compared to standard multiple-choice platforms.
                </p>
                <a href="https://www.osradar.com/equathora-math-site-review/" target='_blank' title='Equathora Review' className='!underline !text-[var(--rare-blue)] active:scale-95 hover:brightness-75 text-center md:text-left text-md w-fit'>
                  Osradar - Tech Blogs
                </a>
              </div>

            </article>

            {/* FAQ */}
            <article className='flex flex-col w-full gap-4 pb-20 text-[var(--secondary-color)]'>
              <h4 className='text-3xl md:text-4xl font-bold pb-2'>Frequently asked questions</h4>
              {faq.map((item, i) => {
                const [open, setOpen] = useState(i === 0);
                return (
                  <div key={i} className='border-b border-[var(--secondary-color)]/20'>
                    <button onClick={() => setOpen(o => !o)} className='w-full flex justify-between items-center py-4 text-left gap-4 cursor-pointer'>
                      <span className='font-semibold text-lg md:text-lg'>{item.q}</span>
                      <span className={`text-lg transition-transform duration-200 shrink-0 text-[var(--secondary-color)] ${open ? 'rotate-180' : ''}`}>
                        <FaAngleDown></FaAngleDown>
                      </span>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                      <p className='text-md md:text-lg opacity-90 leading-relaxed'>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </article>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default Premium;
