import React, { useMemo, useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';

const Premium = () => {
  const [billing, setBilling] = useState('monthly');
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const plans = useMemo(() => {
    const isAnnual = billing === 'annual';
    return [
      {
        id: 'free',
        name: 'Free',
        badge: null,
        price: '$0',
        priceNote: 'forever',
        desc: 'Start your math journey with no commitment.',
        cta: 'Start for Free',
        ctaLink: '/signup',
        accent: false,
      },
      {
        id: 'scholar',
        name: 'Scholar',
        badge: 'Most Popular',
        price: isAnnual ? '$4.99' : '$7.99',
        priceNote: isAnnual ? '/mo · billed $59.99/yr' : '/month',
        desc: 'The complete toolkit for consistent, measurable growth.',
        cta: 'Start 7-Day Free Trial',
        ctaLink: '/signup?plan=scholar',
        accent: true,
        savings: isAnnual ? 'Save 38%' : null,
        trial: true,
      },
      {
        id: 'olympiad',
        name: 'Olympiad',
        badge: null,
        price: isAnnual ? '$9.99' : '$14.99',
        priceNote: isAnnual ? '/mo · billed $119.99/yr' : '/month',
        desc: 'For competitors who refuse to plateau.',
        cta: 'Go Olympiad',
        ctaLink: '/signup?plan=olympiad',
        accent: false,
        savings: isAnnual ? 'Save 33%' : null,
      },
    ];
  }, [billing]);
  return (
    <div>
      <main className="w-full bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed min-h-screen ">
        <header>
          <Navbar></Navbar>
        </header>
        <div className='flex w-full justify-center items-center'>
          <div className='flex flex-col lg:flex-row justify-start items-center px-[4vw] xl:px-[6vw] max-w-[1500px] pt-4 lg:pt-6 gap-8'>
            <h1>Premium</h1>
            <h2>Find the ideal plan that fits your budget and goals. Make informed choices with ease.</h2>
            {/* Premium Card Section */}
            <div className="flex">
              {/* Card 1 */}
              <div className="rounded-md">

              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Premium;