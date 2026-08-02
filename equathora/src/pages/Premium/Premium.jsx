import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaAngleDown, FaQuoteLeft, FaCrown, FaExclamationTriangle, FaFlagCheckered } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSubscription } from '@/hooks/SubscriptionContext';

const Premium = () => {
  const {
    premium,
    cancelAtPeriodEnd,
    cancelAt,
    loading: subLoading
  } = useSubscription();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Array of open FAQ indices allows multiple items to remain open simultaneously
  const [openFaqIndices, setOpenFaqIndices] = useState([0]);
  const navigate = useNavigate();

  const freeFeatures = [
    { bold: "Personalized Math Study Plan", text: " - standard practice tracking" },
    { bold: "Step-by-step LaTeX Workspace", text: " - interactive scratchpad for algebraic steps" },
    // { bold: "Basic Completion Stats", text: " - track daily practice accuracy" },
    { bold: "200+ Free Foundational Problems", text: " - Algebra, Linear Equations, Polynomials & Radicals" }
  ];

  const proFeatures = [
    { bold: "Sigma AI Step Debugger", text: " - pinpoints the exact line where your algebra breaks and explains why" },
    { bold: "Interactive AI Chat (Sigma Mentor)", text: " - ask follow-up questions after a hint, like a live tutor" },
    { bold: "LaTeX PDF Export", text: " - export clean, print-ready math homework and step-by-step solutions" },
    { bold: "Unlimited Advanced & Olympiad Problem Sets", text: " - Logarithms, Complex Numbers, Sequences & Series, Combinatorics, and Determinants" }
  ];

  const faq = [
    { q: "Can I cancel my subscription anytime?", a: "Yes. Cancel your Pro membership from your account settings at any time. You keep Pro access until the end of your billing period." },
    { q: "Is my payment information secure?", a: "All payments are processed securely by Stripe — Equathora never stores or sees your credit card details." },
    { q: "Which math topics and problem types are behind the Pro wall?", a: "Free users get access to over 200 foundational practice problems covering Algebra, Polynomials, and Linear Equations. Pro unlocks all Hard and Advanced difficulty problems, plus specialized topic modules like Logarithms, Complex Numbers, Sequences & Series, Determinants, and Probability & Combinatorics." },
    { q: "How does the Sigma AI Step Debugger work?", a: "Submit your math work line by line into the LaTeX workspace. Sigma scans your steps, detects algebraic errors instantly, and explains how to correct them." },
    // { q: "What is the Mistake Vault?", a: "The Mistake Vault automatically tracks and surfaces your repeated algebraic errors, helping you target weak areas before exams." },
    { q: "Can I export my step-by-step solutions as a PDF?", a: "Yes — Pro members can export clean, formatted LaTeX PDF documents directly from the workspace for printing or homework submission." },
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleManageSubscription = async () => {
    setErrorMessage('');
    try {
      setCheckoutLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('billing-portal-session', {
        body: { returnUrl: window.location.href }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to open billing portal. Please try again.');
      }
    } catch (err) {
      console.error('Portal session error:', err);
      setErrorMessage(err.message || 'Failed to open billing portal. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (premium) {
      await handleManageSubscription();
      return;
    }

    setErrorMessage('');
    try {
      setCheckoutLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { returnUrl: window.location.href }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to initialize checkout. Please try again.');
      }
    } catch (err) {
      console.error('Checkout session error:', err);
      setErrorMessage(err.message || 'Failed to initialize checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const renderButtonText = () => {
    if (subLoading || checkoutLoading) return 'Loading...';
    if (premium) return 'Manage Subscription';
    return 'Subscribe';
  };

  const formatCancelDate = (dateVal) => {
    if (!dateVal) return null;

    let timestamp = dateVal;
    if (typeof dateVal === 'number' && dateVal < 10000000000) {
      timestamp = dateVal * 1000;
    }

    const parsedDate = new Date(timestamp);
    if (isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formattedCancelDate = formatCancelDate(cancelAt);

  return (
    <div>
      <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen font-[Sansation,sans-serif]">
        <Navbar />
        <section className='flex w-full justify-center items-center'>
          <div className='flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:py-6'>
            <h1 className='text-3xl sm:text-3xl md:text-5xl lg:text-5xl font-black leading-[1.1] text-[var(--black)] pb-2'>Premium</h1>
            <h2 className='text-sm sm:text-xl md:text-2xl font-light text-center pb-1'>Find the ideal plan that fits your budget and goals. Make informed choices with ease.</h2>

            {errorMessage && (
              <div className="w-full max-w-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50 text-[var(--secondary-color)] px-4 py-3 rounded-md text-sm text-center flex items-center justify-center gap-2">
                <FaExclamationTriangle />
                <span>We ran into an issue. Try again later.</span>
              </div>
            )}

            {/* Premium Card Section */}
            <article className="flex gap-5 pt-10 items-center lg:flex-row flex-col-reverse w-full">
              {/* Free Card */}
              <div className='rounded-md flex-col flex bg-[var(--main-color)] px-8 py-10 gap-8 h-fit lg:w-2/5 transition-all border border-[var(--secondary-color)]/10'>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between sm:flex-row flex-col-reverse w-full items-center gap-1.5">
                    <h3 className="text-2xl font-bold text-[var(--secondary-color)]">Free</h3>
                    {!premium && (
                      <div className='flex items-center gap-1 border-[var(--secondary-color)] border rounded-md px-1'>
                        <FaFlagCheckered className='inline-block' />
                        <span>Active</span>
                      </div>
                    )}
                  </div>

                  <p className="text-md text-[var(--secondary-color)]/80 font-light">
                    Master your foundational math skills completely for free with <strong>unlimited access</strong> to our standard challenge sets and <strong>interactive step-by-step canvas.</strong>
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

                  <Link to={'/login'} className='bg-[var(--black)] !text-[var(--white)] py-2 rounded-md text-xl hover:contrast-80 active:scale-95 transition-all duration-200 text-center !font-normal'>
                    Get Started
                  </Link>
                  <ul className="flex flex-col gap-2 pt-2">
                    {freeFeatures.map((feature, idx) => (
                      <li key={idx} className="text-sm">
                        <strong>{feature.bold}</strong>{feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pro Card */}
              <div className='rounded-md flex-col flex bg-gradient-to-t from-amber-600 to-amber-400 px-8 py-10 gap-10 shadow-xl lg:w-3/5 transition-all'>
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center sm:flex-row flex-col-reverse gap-1">
                    <h3 className="text-2xl font-bold text-black">Monthly
                      <span className='text-black/50 text-lg pl-3 font-normal'>billed monthly</span>
                    </h3>
                    {premium && (
                      <h3 className='bg-black/10 px-3 py-1 rounded-md text-black font-medium items-center flex gap-1.5 text-sm'>
                        {cancelAtPeriodEnd ? (
                          <>
                            <FaExclamationTriangle className='text-amber-900' />
                            <span>Cancels on {formattedCancelDate}</span>
                          </>
                        ) : (
                          <div className='rounded-md px-1 flex items-center gap-1'>
                            <FaCrown className='inline-block' />
                            <span>Active</span>
                          </div>
                        )}
                      </h3>
                    )}
                  </div>

                  {cancelAtPeriodEnd && (
                    <div className="bg-black/15 border border-black/20 text-black p-3 rounded-md text-xs sm:text-sm flex items-start gap-2">
                      <FaExclamationTriangle className="mt-0.5 shrink-0" />
                      <span>
                        Your Pro subscription is set to cancel on <strong>{formattedCancelDate}</strong>. You retain full access to all Pro features until then.
                      </span>
                    </div>
                  )}

                  <p className="text-md text-black/80 font-light">
                    An <strong>affordable</strong>, high-return investment in your math education that pays off with every problem you solve.
                    <br />Unlock full access to your <strong>24/7 AI</strong> mentor and start turning your <strong>common math mistakes</strong> into <strong>maximum exam points</strong> today.
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2 items-end">
                      <h3 className="text-2xl md:text-3xl font-medium line-through text-black/50">€24.99</h3>
                      <h3 className="text-4xl md:text-5xl text-black font-bold">€19.99
                        <span className='text-2xl text-black/80 font-medium'>/mo</span>
                      </h3>
                    </div>
                    <p className='text-md text-black/80 font-light xl:block hidden'>Prices are marked in Euros</p>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    disabled={subLoading || checkoutLoading}
                    type="button"
                    className="bg-[var(--black)] text-[var(--white)] py-2 rounded-md text-xl transition-all duration-200 hover:contrast-80 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {renderButtonText()}
                  </button>
                  <ul className="flex flex-col gap-2 pt-2 text-black">
                    {proFeatures.map((feature, idx) => (
                      <li key={idx} className="text-md">
                        <strong>{feature.bold}</strong>{feature.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            {/* Feedback OsRadar */}
            <article className='flex lg:flex-row flex-col w-full justify-between items-center gap-5 text-[var(--secondary-color)] py-24'>
              <h4 className='text-3xl md:text-4xl font-bold pb-2'>What others are <br /> saying about us?</h4>
              <div className='lg:max-w-3/5 flex flex-col gap-3 relative items-center md:items-start'>
                <FaQuoteLeft className='text-[var(--secondary-color)] absolute w-3 h-3 -left-5 hidden md:flex' />
                <p className='text-xl md:text-2xl text-center md:text-left'>
                  Equathora is an <strong>excellent tool</strong> for the “serious” math student, specifically those preparing for Math Olympiads or early undergraduate STEM courses. It removes the friction of finding quality problems and provides <strong>a superior input method</strong> compared to standard multiple-choice platforms.
                </p>
                <a href="https://www.osradar.com/equathora-math-site-review/" target='_blank' rel="noreferrer" title='Equathora Review' className='!underline !text-blue-800 active:scale-95 hover:brightness-75 text-center md:text-left text-md w-fit'>
                  Osradar - Tech Blogs
                </a>
              </div>
            </article>

            {/* FAQ Accordion */}
            <article className='flex flex-col w-full gap-4 pb-20 text-[var(--secondary-color)]'>
              <h4 className='text-3xl md:text-4xl font-bold pb-2'>Frequently asked questions</h4>
              {faq.map((item, i) => {
                const isOpen = openFaqIndices.includes(i);
                return (
                  <div key={i} className='border-b border-[var(--secondary-color)]/20'>
                    <button
                      onClick={() => toggleFaq(i)}
                      className='w-full flex justify-between items-center py-4 text-left gap-4 cursor-pointer'
                    >
                      <span className='font-semibold text-lg md:text-lg'>{item.q}</span>
                      <span className={`text-lg transition-transform duration-200 shrink-0 text-[var(--secondary-color)] ${isOpen ? 'rotate-180' : ''}`}>
                        <FaAngleDown />
                      </span>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
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