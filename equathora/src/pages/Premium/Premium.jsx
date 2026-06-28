import React, { useMemo, useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';

const Premium = ({ premium = false }) => {
  // Simple clean array to hold your specific features
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

  return (
    <div>
      <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen font-[Sansation,sans-serif]">
        <header>
          <Navbar></Navbar>
        </header>
        <div className='flex w-full justify-center items-center'>
          <div className='flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6'>
            <h1 className='text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--black)] pb-2'>Premium</h1>
            <h2 className='text-sm sm:text-xl md:text-2xl font-light text-center'>Find the ideal plan that fits your budget and goals. Make informed choices with ease.</h2>
            {/* Premium Card Section */}
            <div className="flex gap-5 pt-10 items-center lg:flex-row flex-col-reverse">
              {/* Card 1 */}
              <div className='rounded-md flex-col flex bg-[var(--main-color)] px-8 py-10 gap-8 h-fit'>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold text-[var(--secondary-color)]">Free
                  </h3>
                  <p className="text-md text-[var(--secondary-color)]/80 font-light">
                    Master your foundational math skills completely for free with unlimited access to our standard challenge sets and interactive step-by-step canvas.
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

                  <button type="button" className='bg-[var(--black)] text-[var(--white)] py-2 rounded-md text-xl hover:contrast-80 active:scale-95 transition-all duration-200'>Subscribe</button>
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
              <div className='rounded-md flex-col flex bg-gradient-to-l from-amber-500 to-amber-300 px-8 py-10 gap-10 shadow-amber-500 shadow-xl border-2 border-white'>
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
                  <ul className='list-disc'>
                    {proFeatures.map((feature, idx) => (
                      <li key={idx}>
                        <strong>{feature.bold}</strong>{feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Premium;
