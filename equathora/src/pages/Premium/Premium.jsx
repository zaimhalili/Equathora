import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import NavigationBar from '@/components/Landing/NavigationBar';
import Footer from '@/components/Footer';
import {
  FaAngleDown,
  FaQuoteLeft,
  FaCrown,
  FaExclamationTriangle,
  FaFlagCheckered,
  FaCheck,
  FaBookOpen,
  FaChartLine,
  FaFilePdf,
  FaRobot,
  FaUsers,
  FaClipboardList,
  FaUserGraduate,
  FaBrain,
  FaUserShield
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSubscription } from '@/hooks/SubscriptionContext';
import { useAuth } from '@/hooks/useAuth';

const Premium = () => {
  const { user } = useAuth();

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
    { icon: FaCheck, bold: "Personalized Math Study Plan", text: " - standard practice tracking" },
    { icon: FaBookOpen, bold: "Step-by-step LaTeX Workspace", text: " - interactive scratchpad for algebraic steps" },
    { icon: FaChartLine, bold: "Basic Completion Stats", text: " - track daily practice accuracy" },
    { icon: FaUserGraduate, bold: "200+ Free Foundational Problems", text: " - Algebra, Linear Equations, Polynomials & Radicals" }
  ];

  const proFeatures = [
    { icon: FaCheck, bold: "Personalized Math Study Plan", text: " - standard practice tracking" },
    { icon: FaBookOpen, bold: "Step-by-step LaTeX Workspace", text: " - interactive scratchpad for algebraic steps" },
    { icon: FaChartLine, bold: "Basic Completion Stats", text: " - track daily practice accuracy" },
    { icon: FaBrain, bold: "Sigma AI Step Debugger", text: " - pinpoints the exact line where your algebra breaks and explains why" },
    { icon: FaRobot, bold: "Interactive AI Chat (Sigma Mentor)", text: " - ask follow-up questions after a hint, like a live tutor" },
    { icon: FaFilePdf, bold: "LaTeX PDF Export", text: " - export clean, print-ready math homework and step-by-step solutions" },
    { icon: FaClipboardList, bold: "Unlimited Advanced & Olympiad Problem Sets", text: " - Logarithms, Complex Numbers, Sequences & Series, Combinatorics, and Determinants" }
  ];

  const institutionalFeatures = [
    { icon: FaUsers, bold: "Classroom performance dashboards", text: " - monitor each student’s progress, streaks, and completion in one place" },
    { icon: FaClipboardList, bold: "Assignment and homework workflows", text: " - assign practice sets and track who has completed them" },
    { icon: FaChartLine, bold: "Teacher progress insights", text: " - identify gaps, high performers, and students needing support" },
    { icon: FaUsers, bold: "Cohort and class reporting", text: " - review performance trends across classes, teams, and programs" },
    { icon: FaBrain, bold: "AI-powered study guidance", text: " - support learners with step-by-step explanations and feedback" },
    { icon: FaUserGraduate, bold: "School and academy access", text: " - built for classrooms, tutoring centers, and institutional programs" },
    { icon: FaCheck, bold: "Premium learning experience", text: " - keep the full Pro toolkit available for students and educators alike" }
  ];

  const faq = [
    { q: "Can I cancel my subscription anytime?", a: "Yes. Cancel your Pro membership from your account settings at any time. You keep Pro access until the end of your billing period." },
    { q: "Is my payment information secure?", a: "All payments are processed securely by Stripe - Equathora never stores or sees your credit card details." },
    { q: "Which math topics and problem types are behind the Pro wall?", a: "Free users get access to over 200 foundational practice problems covering Algebra, Polynomials, and Linear Equations. Pro unlocks all Hard and Advanced difficulty problems, plus specialized topic modules like Logarithms, Complex Numbers, Sequences & Series, Determinants, and Probability & Combinatorics." },
    { q: "How does the Sigma AI Step Debugger work?", a: "Submit your math work line by line into the LaTeX workspace. Sigma scans your steps, detects algebraic errors instantly, and explains how to correct them." },
    // { q: "What is the Mistake Vault?", a: "The Mistake Vault automatically tracks and surfaces your repeated algebraic errors, helping you target weak areas before exams." },
    { q: "Can I export my step-by-step solutions as a PDF?", a: "Yes - Pro members can export clean, formatted LaTeX PDF documents directly from the workspace for printing or homework submission." },
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
    return 'Get Pro - 20% off';
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
      <main className="w-full bg-[var(--main-color)] bg-fixed min-h-screen ">
        {user ? <Navbar /> :
          (<>
            <NavigationBar />
            <div className='flex pb-10 md:pb-12' />
          </>)}
        <section className='flex w-full justify-center items-center'>
          <div className='flex flex-col justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] py-4 lg:py-6'>
            <h1 className='text-3xl sm:text-3xl md:text-3xl font-medium leading-[1.1] text-[var(--black)] pb-2 text-center '>Turn your common math mistakes<br /> into maximum exam points today.</h1>
            <h2 className='text-sm sm:text-lg text-center pb-1'>Find the ideal plan that fits your budget and goals.</h2>

            {errorMessage && (
              <div className="w-full max-w-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/50 text-[var(--secondary-color)] px-4 py-3 rounded-md text-sm text-center flex items-center justify-center gap-2">
                <FaExclamationTriangle />
                <span>We ran into an issue. Try again later.</span>
              </div>
            )}

            {/* Cards' Section */}
            <article className="flex gap-5 pt-10 items-center w-full flex-wrap justify-center lg:px-20">
              {/* Free Card */}
              <div className='rounded-3xl flex-col flex bg-[var(--white)] sm:min-w-70 p-1 h-fit lg:max-w-1/3 min-w-60 flex-1 transition-all border border-[var(--secondary-color)]/10 border-t-2'>
                <div className="flex justify-between w-full items-center gap-1.5 p-4">
                  <h3 className="text-2xl font-bold text-[var(--secondary-color)]">Free</h3>
                  {!premium && (
                    <div className='flex items-center gap-1 border-[var(--secondary-color)] border rounded-md px-1'>
                      <FaFlagCheckered className='inline-block' />
                      <span>Active</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 bg-[var(--main-color)]/90 p-4 rounded-2xl">
                  <div className="flex gap-2 flex-col">
                    <h3 className="text-2xl md:text-3xl text-[var(--secondary-color)] font-bold flex items-end">€0
                      <span className='text-sm text-[var(--secondary-color)]/50 font-normal'>/month</span>
                    </h3>
                    <p className='text-sm text-[var(--secondary-color)]/50 font-normal'>No credit card required</p>
                  </div>


                  <ul className="flex flex-col gap-3 pt-2 h-90 text-[var(--secondary-color)]">
                    {freeFeatures.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li key={idx} className="flex items-center gap-2 text-sm font-normal text-[var(--secondary-color)]/80">
                          <Icon className=" h-3 w-3 shrink-0 text-[var(--secondary-color)]/50" />
                          <span>
                            <strong>{feature.bold}</strong>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <Link to={'/login'} className='!text-[var(--secondary-color)]/70 hover:!text-[var(--secondary-color)] bg-[var(--main-color)] brightness-95 hover:brightness-90 py-2 rounded-xl text-xl active:scale-95 transition-all duration-200 text-center !font-normal border-[var(--white)] border-2'>
                    Get started for free
                  </Link>
                </div>
              </div>

              {/* Pro Card */}
              <div className='rounded-3xl flex-col flex bg-gradient-to-b from-amber-600 to-amber-400 shadow-2xl lg:max-w-1/3 min-w-60 w-full transition-all p-1 flex-1 relative border border-[var(--secondary-color)]/10 border-t-2'>
                {/* Label */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex w-fit rounded-2xl border-2 px-3 py-1 border-black bg-amber-500 text-black text-xs font-medium whitespace-nowrap gap-1 items-center z-40">
                  <FaUserShield />
                  Most common
                </div>
                <div className="flex flex-col gap-5 p-4">
                  <div className="flex justify-between items-center sm:flex-row flex-col-reverse gap-1.5">
                    <h3 className="text-2xl font-bold text-[var(--main-color)]">Premium
                    </h3>
                    {premium && (
                      <h3 className='bg-black/10 px-3 py-1 rounded-md text-[var(--secondary-color)] font-medium items-center flex gap-1.5 text-sm'>
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
                </div>
                <div className="flex flex-col gap-5 bg-[var(--main-color)]/90 rounded-2xl p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-end">
                      <h3 className="text-xl font-medium line-through text-[var(--secondary-color)]/50">€24.99</h3>
                      <h3 className="text-2xl md:text-3xl text-[var(--secondary-color)] font-bold">€19.99
                        <span className='text-sm text-[var(--secondary-color)]/50 font-normal'>/month</span>
                      </h3>
                    </div>
                    <p className='text-sm text-[var(--secondary-color)]/50 font-normal'>Billed €19.99 monthly. Cancel anytime</p>
                  </div>


                  <ul className="flex flex-col gap-2 pt-2 h-90 lg:h-100 text-[var(--secondary-color)]">
                    {proFeatures.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li key={idx} className="flex items-center gap-2 text-sm font-normal text-[var(--secondary-color)]/80">
                          <Icon className="h-3 w-3 shrink-0 text-amber-500" />
                          <span>
                            <strong>{feature.bold}</strong>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={handleUpgrade}
                    disabled={subLoading || checkoutLoading}
                    type="button"
                    className="bg-amber-600 text-white py-2 rounded-xl text-xl transition-all duration-200 hover:contrast-80 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {renderButtonText()}
                  </button>
                </div>
              </div>

              {/* Institutional Card */}
              <div className='rounded-3xl flex-col flex bg-gradient-to-b from-[var(--dark-accent-color)] to-[var(--accent-color)] shadow-xl lg:max-w-1/3 min-w-60 w-full transition-all p-1 flex-1 border border-[var(--secondary-color)]/10 border-t-2'>
                <div className="flex flex-col gap-5 p-4">
                  <div className="flex justify-between items-center sm:flex-row flex-col-reverse gap-1.5">
                    <h3 className="text-2xl font-bold text-white">Schools & Institutions
                    </h3>
                    {premium && (
                      <h3 className='bg-black/10 px-3 py-1 rounded-md text-[var(--secondary-color)] font-medium items-center flex gap-1.5 text-sm'>
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
                </div>
                <div className="flex flex-col gap-5 bg-[var(--main-color)]/90 rounded-2xl p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-end">
                      <h3 className="text-2xl md:text-3xl text-[var(--secondary-color)] font-bold">€X
                        <span className='text-sm text-[var(--secondary-color)]/50 font-normal'>/month</span>
                      </h3>
                    </div>
                    <p className='text-sm text-[var(--secondary-color)]/50 font-normal'>Custom pricing for schools and academies</p>
                  </div>


                  <ul className="flex flex-col gap-2 pt-2 h-90 text-[var(--secondary-color)]">
                    {institutionalFeatures.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li key={idx} className="flex items-center gap-2 text-sm font-normal text-[var(--secondary-color)]/80">
                          <Icon className="h-3 w-3 shrink-0 text-[var(--accent-color)]" />
                          <span>
                            <strong>{feature.bold}</strong>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <a
                    href='mailto:equathora@gmail.com'
                    className="bg-[var(--dark-accent-color)] !text-white py-2 rounded-xl text-xl transition-all duration-200 hover:contrast-80 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center !font-normal"
                  >
                    Contact me
                  </a>
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
            <article className='flex flex-col w-full gap-2 pb-20 text-[var(--secondary-color)]'>
              <h4 className='text-3xl md:text-4xl font-bold pb-6'>Frequently asked questions</h4>
              {faq.map((item, i) => {
                const isOpen = openFaqIndices.includes(i);
                return (
                  <div key={i} className='bg-[var(--white)] rounded-2xl px-3'>
                    <button
                      onClick={() => toggleFaq(i)}
                      className='w-full flex justify-between items-center py-3 text-left gap-3 cursor-pointer'
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