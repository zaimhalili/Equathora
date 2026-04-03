import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ─── tiny helpers ─────────────────────────────────────── */
const Check = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity=".25" />
        <path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Dash = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
        <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeOpacity=".18" />
        <path d="M5 8h6" stroke="currentColor" strokeOpacity=".4" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const Star = ({ filled }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill={filled ? '#D70427' : 'none'} stroke={filled ? '#D70427' : '#ccc'} strokeWidth="1.2">
        <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.77l-3.09 1.74.59-3.44L2 4.635l3.455-.505z" />
    </svg>
);

/* ─── feature matrix ───────────────────────────────────── */
const FEATURES = [
    { label: 'Core problem library access', free: true, scholar: true, olympiad: true },
    { label: 'Daily challenge (3/day)', free: true, scholar: true, olympiad: true },
    { label: 'XP & achievement badges', free: true, scholar: true, olympiad: true },
    { label: 'Global leaderboard', free: true, scholar: true, olympiad: true },
    { label: 'Basic progress dashboard', free: true, scholar: true, olympiad: true },
    { label: 'Unlimited problem attempts', free: false, scholar: true, olympiad: true },
    { label: 'Advanced mastery analytics', free: false, scholar: true, olympiad: true },
    { label: 'Full step-by-step solutions', free: false, scholar: true, olympiad: true },
    { label: 'Priority hints & review tools', free: false, scholar: true, olympiad: true },
    { label: 'Streak shield (1× / month)', free: false, scholar: true, olympiad: true },
    { label: 'Olympiad track problems (AMC+)', free: false, scholar: false, olympiad: true },
    { label: 'Premium contest prep content', free: false, scholar: false, olympiad: true },
    { label: 'Early access to new features', free: false, scholar: false, olympiad: true },
    { label: 'Priority mentor ecosystem access', free: false, scholar: false, olympiad: true },
    { label: 'Exclusive Olympiad badge tier', free: false, scholar: false, olympiad: true },
];

const TESTIMONIALS = [
    { name: 'Aisha M.', role: 'AMC 12 qualifier', text: 'Equathora\'s Olympiad track is the only thing that pushed my score above 100. The problem quality is unmatched.', stars: 5 },
    { name: 'Lucas T.', role: 'Pre-calculus student', text: 'Scholar plan paid for itself in the first week. The mastery analytics showed exactly where my gaps were.', stars: 5 },
    { name: 'Priya K.', role: 'Self-learner', text: 'I tried Brilliant and Khan — Equathora is where I actually improved. Daily challenges keep me accountable.', stars: 4 },
];

/* ─── main component ───────────────────────────────────── */
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

    const s = {
        /* ── page ── */
        page: {
            fontFamily: "'Sansation', sans-serif",
            width: '100%',
            minHeight: '100vh',
            background: 'var(--main-color)',
            color: 'var(--secondary-color)',
            overflowX: 'hidden',
        },

        /* ── hero ── */
        hero: {
            maxWidth: 900,
            margin: '0 auto',
            padding: '72px 24px 0',
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity .55s ease, transform .55s ease',
        },
        eyebrow: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#D70427',
            marginBottom: 20,
        },
        eyebrowDot: {
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#D70427',
            display: 'inline-block',
        },
        heroH1: {
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            margin: '0 0 20px',
        },
        heroSub: {
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--secondary-color)',
            opacity: 0.65,
            maxWidth: 560,
            margin: '0 auto 40px',
            lineHeight: 1.6,
        },

        /* ── billing toggle ── */
        toggleWrap: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
        },
        toggleTrack: {
            display: 'flex',
            borderRadius: 999,
            border: '1.5px solid rgba(43,45,66,.18)',
            background: 'rgba(43,45,66,.04)',
            padding: 3,
            gap: 2,
        },
        toggleBtn: (active) => ({
            padding: '8px 22px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Sansation', sans-serif",
            border: 'none',
            cursor: 'pointer',
            transition: 'all .22s ease',
            background: active ? 'var(--secondary-color)' : 'transparent',
            color: active ? 'white' : 'var(--secondary-color)',
        }),
        savingsPill: {
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(215,4,39,.1)',
            color: '#D70427',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.05em',
            padding: '4px 10px',
            borderRadius: 999,
        },

        /* ── cards grid ── */
        grid: {
            maxWidth: 1080,
            margin: '52px auto 0',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
            alignItems: 'start',
        },

        /* ── card ── */
        card: (plan, hovered) => {
            const isHovered = hovered === plan.id;
            const isAccent = plan.accent;
            return {
                borderRadius: 20,
                padding: '28px 28px 32px',
                border: isAccent ? '2px solid #D70427' : '1.5px solid rgba(43,45,66,.14)',
                background: isAccent
                    ? 'white'
                    : isHovered ? 'white' : 'rgba(255,255,255,.6)',
                boxShadow: isAccent
                    ? '0 20px 60px rgba(215,4,39,.13), 0 4px 16px rgba(215,4,39,.06)'
                    : isHovered
                        ? '0 14px 40px rgba(43,45,66,.1)'
                        : '0 2px 8px rgba(43,45,66,.04)',
                transform: isAccent ? 'translateY(-8px)' : isHovered ? 'translateY(-3px)' : 'translateY(0)',
                transition: 'all .28s cubic-bezier(.34,1.3,.64,1)',
                position: 'relative',
                backdropFilter: 'blur(8px)',
            };
        },

        cardBadge: (accent) => ({
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            background: accent ? '#D70427' : 'var(--secondary-color)',
            color: 'white',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
        }),

        planName: { fontSize: 22, fontWeight: 800, margin: 0 },
        planDesc: { fontSize: 13.5, opacity: .65, marginTop: 6, lineHeight: 1.5 },

        price: {
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            margin: '20px 0 2px',
            lineHeight: 1,
        },
        priceNote: { fontSize: 12.5, opacity: .55, marginBottom: 20 },

        divider: {
            height: 1,
            background: 'rgba(43,45,66,.1)',
            margin: '20px 0',
        },

        featureList: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
        },
        featureItem: (active, accent) => ({
            display: 'flex',
            alignItems: 'flex-start',
            gap: 9,
            fontSize: 13.5,
            color: active
                ? (accent ? 'var(--secondary-color)' : 'var(--secondary-color)')
                : 'rgba(43,45,66,.35)',
        }),

        cta: (plan) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: 24,
            padding: '13px 0',
            borderRadius: 14,
            fontFamily: "'Sansation', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all .2s ease',
            background: plan.accent
                ? '#D70427'
                : 'var(--secondary-color)',
            color: 'white',
            letterSpacing: '0.02em',
        }),

        savingsTag: {
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(215,4,39,.08)',
            color: '#D70427',
            padding: '3px 9px',
            borderRadius: 999,
            marginLeft: 8,
        },

        trialNote: {
            textAlign: 'center',
            fontSize: 12,
            opacity: .5,
            marginTop: 9,
        },

        /* ── comparison table ── */
        section: {
            maxWidth: 1080,
            margin: '72px auto 0',
            padding: '0 24px',
        },

        sectionLabel: {
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#D70427',
            marginBottom: 10,
        },
        sectionH2: {
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 32px',
        },

        tableWrap: {
            borderRadius: 20,
            border: '1.5px solid rgba(43,45,66,.12)',
            overflow: 'hidden',
            background: 'white',
        },
        tableHead: {
            display: 'grid',
            gridTemplateColumns: '1fr repeat(3, 120px)',
            background: 'rgba(43,45,66,.03)',
            borderBottom: '1.5px solid rgba(43,45,66,.1)',
            padding: '14px 24px',
        },
        tableHeadCell: (accent) => ({
            fontSize: 13,
            fontWeight: 800,
            textAlign: 'center',
            color: accent ? '#D70427' : 'var(--secondary-color)',
        }),
        tableRow: (i) => ({
            display: 'grid',
            gridTemplateColumns: '1fr repeat(3, 120px)',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(43,45,66,.06)',
            background: i % 2 === 0 ? 'white' : 'rgba(43,45,66,.015)',
            alignItems: 'center',
        }),
        tableCell: { fontSize: 13.5 },
        tableCellCenter: { display: 'flex', justifyContent: 'center' },

        /* ── testimonials ── */
        testimonialGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
        },
        testimonialCard: {
            borderRadius: 18,
            border: '1.5px solid rgba(43,45,66,.12)',
            background: 'white',
            padding: '24px 24px 20px',
        },
        testimonialText: {
            fontSize: 14.5,
            lineHeight: 1.65,
            opacity: .78,
            marginBottom: 18,
            fontStyle: 'italic',
        },
        testimonialName: { fontSize: 14, fontWeight: 800, margin: 0 },
        testimonialRole: { fontSize: 12, opacity: .5, marginTop: 2 },

        /* ── faq ── */
        faqItem: {
            borderBottom: '1px solid rgba(43,45,66,.1)',
            padding: '18px 0',
        },
        faqQ: { fontSize: 15, fontWeight: 700, marginBottom: 8 },
        faqA: { fontSize: 14, opacity: .65, lineHeight: 1.6 },

        /* ── bottom cta ── */
        bottomCta: {
            maxWidth: 1080,
            margin: '72px auto 80px',
            padding: '0 24px',
        },
        bottomCtaInner: {
            borderRadius: 24,
            background: 'var(--secondary-color)',
            color: 'white',
            padding: '52px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
            position: 'relative',
            overflow: 'hidden',
        },
        bottomCtaH2: {
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            margin: 0,
        },
        bottomCtaSub: { opacity: .65, fontSize: 16, maxWidth: 480, margin: 0 },
        bottomCtaBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#D70427',
            color: 'white',
            textDecoration: 'none',
            padding: '14px 36px',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.02em',
            transition: 'all .2s ease',
        },

        /* ── decorative blob ── */
        blob: (color, top, left, size) => ({
            position: 'absolute',
            top, left,
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            filter: 'blur(70px)',
            pointerEvents: 'none',
            opacity: .35,
        }),
    };

    const planFeatures = {
        free: [
            'Access to 100+ curated problems',
            'Daily challenge (3 problems/day)',
            'XP system & 30+ achievement badges',
            'Global leaderboard ranking',
            'Basic progress dashboard',
        ],
        scholar: [
            'Everything in Free',
            'Unlimited daily problem attempts',
            'Advanced mastery & gap analytics',
            'Full step-by-step solution walkthroughs',
            'Priority hints & topic review tools',
            'Monthly streak shield',
        ],
        olympiad: [
            'Everything in Scholar',
            'AMC / AIME / Olympiad track',
            'Premium contest prep problem sets',
            'Early access to new features',
            'Priority mentor ecosystem access',
            'Exclusive Olympiad badge tier',
        ],
    };

    const faqs = [
        { q: 'Is the Scholar trial truly free?', a: 'Yes — no charge for 7 days. Cancel any time before the trial ends and you\'ll never be billed.' },
        { q: 'Can I switch plans later?', a: 'Absolutely. You can upgrade, downgrade, or cancel from your account settings at any time. Billing is prorated.' },
        { q: 'Do you offer student or educator discounts?', a: 'We offer a 40% discount for verified students and educators. Submit verification through your account settings.' },
        { q: 'What payment methods are accepted?', a: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe billing portal.' },
        { q: 'What happens to my data if I downgrade?', a: 'Your progress, XP, and badges are always preserved. Only access to premium features changes.' },
    ];

    return (
        <div style={s.page}>
            <Navbar />

            <main>
                {/* ── HERO ── */}
                <div style={s.hero} ref={heroRef}>
                    <div style={s.eyebrow}>
                        <span style={s.eyebrowDot} />
                        Pricing
                        <span style={s.eyebrowDot} />
                    </div>
                    <h1 style={s.heroH1}>
                        Invest in your<br />
                        <span style={{ color: '#D70427' }}>math career.</span>
                    </h1>
                    <p style={s.heroSub}>
                        Equathora is built for serious learners — from daily practice to full Olympiad prep.
                        Pick the plan that matches your ambition.
                    </p>

                    {/* billing toggle */}
                    <div style={s.toggleWrap}>
                        <div style={s.toggleTrack}>
                            <button style={s.toggleBtn(billing === 'monthly')} onClick={() => setBilling('monthly')}>Monthly</button>
                            <button style={s.toggleBtn(billing === 'annual')} onClick={() => setBilling('annual')}>
                                Annual
                                {billing === 'annual' && <span style={{ ...s.savingsTag, marginLeft: 8 }}>Best value</span>}
                            </button>
                        </div>
                        {billing === 'annual' && (
                            <span style={s.savingsPill}>🎉 Up to 38% off</span>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                        <span style={{ fontSize: 12.5, opacity: .55 }}>✓ 7-day free trial on Scholar</span>
                        <span style={{ fontSize: 12.5, opacity: .55 }}>✓ Cancel anytime</span>
                        <span style={{ fontSize: 12.5, opacity: .55 }}>✓ 40% student/educator discount</span>
                    </div>
                </div>

                {/* ── PLAN CARDS ── */}
                <div style={s.grid}>
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            style={s.card(plan, hoveredPlan)}
                            onMouseEnter={() => setHoveredPlan(plan.id)}
                            onMouseLeave={() => setHoveredPlan(null)}
                        >
                            {plan.badge && <div style={s.cardBadge(plan.accent)}>{plan.badge}</div>}

                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                <div>
                                    <h2 style={s.planName}>{plan.name}</h2>
                                    <p style={s.planDesc}>{plan.desc}</p>
                                </div>
                                {plan.savings && billing === 'annual' && (
                                    <span style={{ ...s.savingsTag, marginLeft: 0, flexShrink: 0, fontSize: 11 }}>{plan.savings}</span>
                                )}
                            </div>

                            <div>
                                <p style={s.price}>{plan.price}</p>
                                <p style={s.priceNote}>{plan.priceNote}</p>
                            </div>

                            <div style={s.divider} />

                            <ul style={s.featureList}>
                                {planFeatures[plan.id].map((f) => (
                                    <li key={f} style={s.featureItem(true, plan.accent)}>
                                        <span style={{ color: plan.accent ? '#D70427' : 'var(--secondary-color)', marginTop: 1 }}>
                                            <Check />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link to={plan.ctaLink} style={s.cta(plan)}>
                                {plan.cta}
                            </Link>
                            {plan.trial && (
                                <p style={s.trialNote}>No credit card required for trial</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── COMPARISON TABLE ── */}
                <div style={s.section}>
                    <div style={{ marginBottom: 40, marginTop: 80 }}>
                        <p style={s.sectionLabel}>Compare plans</p>
                        <h2 style={s.sectionH2}>Everything, side by side</h2>
                    </div>

                    <div style={s.tableWrap}>
                        <div style={s.tableHead}>
                            <div style={{ fontSize: 13, fontWeight: 700, opacity: .5 }}>Feature</div>
                            {['Free', 'Scholar', 'Olympiad'].map((name, i) => (
                                <div key={name} style={s.tableHeadCell(i === 1)}>{name}</div>
                            ))}
                        </div>
                        {FEATURES.map((row, i) => (
                            <div key={row.label} style={s.tableRow(i)}>
                                <div style={s.tableCell}>{row.label}</div>
                                {[row.free, row.scholar, row.olympiad].map((val, j) => (
                                    <div key={j} style={s.tableCellCenter}>
                                        {val
                                            ? <span style={{ color: j === 1 ? '#D70427' : 'var(--secondary-color)' }}><Check /></span>
                                            : <span style={{ color: 'rgba(43,45,66,.25)' }}><Dash /></span>
                                        }
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── TESTIMONIALS ── */}
                <div style={{ ...s.section, marginTop: 80 }}>
                    <p style={s.sectionLabel}>What learners say</p>
                    <h2 style={{ ...s.sectionH2, marginBottom: 32 }}>Real students, real results</h2>

                    <div style={s.testimonialGrid}>
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} style={s.testimonialCard}>
                                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                                    {[1, 2, 3, 4, 5].map(n => <Star key={n} filled={n <= t.stars} />)}
                                </div>
                                <p style={s.testimonialText}>"{t.text}"</p>
                                <p style={s.testimonialName}>{t.name}</p>
                                <p style={s.testimonialRole}>{t.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── FAQ ── */}
                <div style={{ ...s.section, marginTop: 80 }}>
                    <p style={s.sectionLabel}>FAQ</p>
                    <h2 style={{ ...s.sectionH2, marginBottom: 8 }}>Common questions</h2>
                    <div>
                        {faqs.map((f, i) => (
                            <FaqItem key={i} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>

                {/* ── BILLING PORTAL ── */}
                <div style={{ ...s.section, marginTop: 56 }}>
                    <div style={{
                        borderRadius: 20,
                        border: '1.5px solid rgba(43,45,66,.12)',
                        background: 'white',
                        padding: '28px 32px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 20,
                    }}>
                        <div>
                            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800 }}>Manage your subscription</h3>
                            <p style={{ margin: 0, fontSize: 14, opacity: .6 }}>Update payment details, download invoices, or change your plan anytime.</p>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button
                                style={{
                                    background: 'var(--secondary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 12,
                                    padding: '11px 22px',
                                    fontSize: 14,
                                    fontWeight: 700,
                                    fontFamily: "'Sansation', sans-serif",
                                    cursor: 'pointer',
                                }}
                            >
                                Open Billing Portal
                            </button>
                            <Link
                                to="/helpCenter"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    border: '1.5px solid rgba(43,45,66,.18)',
                                    borderRadius: 12,
                                    padding: '11px 22px',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    color: 'var(--secondary-color)',
                                }}
                            >
                                Billing Help
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM CTA ── */}
                <div style={s.bottomCta}>
                    <div style={s.bottomCtaInner}>
                        {/* decorative blobs */}
                        <div style={s.blob('rgba(215,4,39,.6)', '-40px', '-40px', '200px')} />
                        <div style={s.blob('rgba(215,4,39,.4)', 'auto', 'auto', '180px')} />

                        <h2 style={s.bottomCtaH2}>Stop practicing in the dark.</h2>
                        <p style={s.bottomCtaSub}>
                            Join thousands of students who found exactly where they were getting stuck — and fixed it.
                        </p>
                        <Link to="/signup?plan=scholar" style={s.bottomCtaBtn}>
                            Try Scholar Free for 7 Days →
                        </Link>
                        <p style={{ margin: 0, fontSize: 12, opacity: .45 }}>No credit card required. Cancel anytime.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

/* ── accordion FAQ item ── */
const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            style={{
                borderBottom: '1px solid rgba(43,45,66,.1)',
                padding: '18px 0',
                cursor: 'pointer',
            }}
            onClick={() => setOpen(!open)}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
            }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{q}</span>
                <span style={{
                    fontSize: 20,
                    fontWeight: 300,
                    color: '#D70427',
                    transform: open ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform .2s ease',
                    flexShrink: 0,
                    lineHeight: 1,
                }}>+</span>
            </div>
            <div style={{
                overflow: 'hidden',
                maxHeight: open ? 200 : 0,
                transition: 'max-height .3s ease',
            }}>
                <p style={{ margin: '12px 0 0', fontSize: 14, opacity: .65, lineHeight: 1.65 }}>{a}</p>
            </div>
        </div>
    );
};

export default Premium;