/**
 * Math Learning Path — Topic Tree Data
 *
 * Each node describes a single concept in the learning path.
 * `prerequisites` lists the ids that must all be "completed" before this
 * node becomes "available".  The first node has no prerequisites and
 * starts as "available".
 *
 * `category` groups nodes visually under a section heading.
 * `column` controls horizontal placement inside the 3-column grid:
 *   "left" | "center" | "right"
 */

import {
    FaCalculator,
    FaDivide,
    FaPercentage,
    FaBalanceScale,
    FaSuperscript,
    FaPencilAlt,
    FaEquals,
    FaNotEqual,
    FaProjectDiagram,
    FaChartLine,
    FaWaveSquare,
    FaCubes,
    FaPuzzlePiece,
    FaBolt,
    FaPowerOff,
    FaListOl,
    FaBrain,
    FaShieldAlt,
    FaDice,
    FaAtom,
} from 'react-icons/fa';

const mathPathTopics = [
    // ── FOUNDATIONS ──────────────────────────────────────────────
    {
        id: 'arithmetic',
        title: 'Arithmetic',
        category: 'Foundations',
        icon: FaCalculator,
        prerequisites: [],
        column: 'center',
        description: 'The building blocks: addition, subtraction, multiplication, division.',
    },
    {
        id: 'fractions',
        title: 'Fractions',
        category: 'Foundations',
        icon: FaDivide,
        prerequisites: ['arithmetic'],
        column: 'left',
        description: 'Operations with parts of a whole.',
    },
    {
        id: 'decimals',
        title: 'Decimals',
        category: 'Foundations',
        icon: FaPercentage,
        prerequisites: ['arithmetic'],
        column: 'right',
        description: 'Base-10 fractional notation and conversions.',
    },
    {
        id: 'ratios',
        title: 'Ratios',
        category: 'Foundations',
        icon: FaBalanceScale,
        prerequisites: ['fractions', 'decimals'],
        column: 'center',
        description: 'Comparing quantities and proportional reasoning.',
    },

    // ── CORE ALGEBRA ────────────────────────────────────────────
    {
        id: 'variables',
        title: 'Variables',
        category: 'Core Algebra',
        icon: FaSuperscript,
        prerequisites: ['ratios'],
        column: 'center',
        description: 'Symbols that represent unknown values.',
    },
    {
        id: 'expressions',
        title: 'Expressions',
        category: 'Core Algebra',
        icon: FaPencilAlt,
        prerequisites: ['variables'],
        column: 'left',
        description: 'Building and simplifying algebraic expressions.',
    },
    {
        id: 'linear-equations',
        title: 'Linear Equations',
        category: 'Core Algebra',
        icon: FaEquals,
        prerequisites: ['expressions'],
        column: 'center',
        description: 'Solving first-degree equations in one variable.',
    },
    {
        id: 'inequalities',
        title: 'Inequalities',
        category: 'Core Algebra',
        icon: FaNotEqual,
        prerequisites: ['linear-equations'],
        column: 'right',
        description: 'Equations replaced by inequality symbols.',
    },
    {
        id: 'systems-of-equations',
        title: 'Systems of Equations',
        category: 'Core Algebra',
        icon: FaProjectDiagram,
        prerequisites: ['linear-equations'],
        column: 'left',
        description: 'Solving multiple equations simultaneously.',
    },

    // ── INTERMEDIATE ────────────────────────────────────────────
    {
        id: 'functions',
        title: 'Functions',
        category: 'Intermediate',
        icon: FaChartLine,
        prerequisites: ['inequalities', 'systems-of-equations'],
        column: 'center',
        description: 'Input-output relationships and notation.',
    },
    {
        id: 'graphs',
        title: 'Graphs',
        category: 'Intermediate',
        icon: FaWaveSquare,
        prerequisites: ['functions'],
        column: 'left',
        description: 'Visualising equations on the coordinate plane.',
    },
    {
        id: 'polynomials',
        title: 'Polynomials',
        category: 'Intermediate',
        icon: FaCubes,
        prerequisites: ['functions'],
        column: 'right',
        description: 'Multi-term algebraic expressions and operations.',
    },
    {
        id: 'factoring',
        title: 'Factoring',
        category: 'Intermediate',
        icon: FaPuzzlePiece,
        prerequisites: ['polynomials'],
        column: 'center',
        description: 'Breaking expressions into multiplicative parts.',
    },

    // ── ADVANCED ────────────────────────────────────────────────
    {
        id: 'quadratics',
        title: 'Quadratics',
        category: 'Advanced',
        icon: FaBolt,
        prerequisites: ['factoring', 'graphs'],
        column: 'center',
        description: 'Second-degree equations and parabolas.',
    },
    {
        id: 'exponents-logarithms',
        title: 'Exponents & Logs',
        category: 'Advanced',
        icon: FaPowerOff,
        prerequisites: ['quadratics'],
        column: 'left',
        description: 'Powers, roots, and their inverse operations.',
    },
    {
        id: 'sequences-series',
        title: 'Sequences & Series',
        category: 'Advanced',
        icon: FaListOl,
        prerequisites: ['quadratics'],
        column: 'right',
        description: 'Patterns in numbers and summation.',
    },

    // ── LOGIC AND PROBLEM SOLVING ───────────────────────────────
    {
        id: 'logical-reasoning',
        title: 'Logical Reasoning',
        category: 'Logic & Problem Solving',
        icon: FaBrain,
        prerequisites: ['exponents-logarithms', 'sequences-series'],
        column: 'center',
        description: 'Deductive and inductive thinking.',
    },
    {
        id: 'proof-techniques',
        title: 'Proof Techniques',
        category: 'Logic & Problem Solving',
        icon: FaShieldAlt,
        prerequisites: ['logical-reasoning'],
        column: 'left',
        description: 'Direct, contradiction, and induction proofs.',
    },
    {
        id: 'combinatorics',
        title: 'Combinatorics',
        category: 'Logic & Problem Solving',
        icon: FaDice,
        prerequisites: ['logical-reasoning'],
        column: 'right',
        description: 'Counting, permutations, and combinations.',
    },
    {
        id: 'number-theory',
        title: 'Number Theory',
        category: 'Logic & Problem Solving',
        icon: FaAtom,
        prerequisites: ['proof-techniques', 'combinatorics'],
        column: 'center',
        description: 'Primes, divisibility, and modular arithmetic.',
    },
];

export default mathPathTopics;
