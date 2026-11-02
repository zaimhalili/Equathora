export const initialClasses = [
    {
        id: 'algebra-2',
        name: 'Algebra II',
        period: 'Period 2',
        code: 'ALG-284',
        isSample: true,
        students: [
            { id: 1, name: 'Joey Thoman', initials: 'JT', accuracy: 91, solved: 146, status: 'On track' },
            { id: 2, name: 'Robert Martin', initials: 'RM', accuracy: 58, solved: 82, status: 'Needs support' },
            { id: 3, name: 'Ava Chen', initials: 'AC', accuracy: 84, solved: 123, status: 'On track' },
            { id: 4, name: 'Noah Williams', initials: 'NW', accuracy: 76, solved: 109, status: 'On track' },
            { id: 5, name: 'Mia Patel', initials: 'MP', accuracy: 63, solved: 71, status: 'Needs support' },
            { id: 6, name: 'Ethan Brooks', initials: 'EB', accuracy: 88, solved: 132, status: 'On track' }
        ],
        assignments: [
            { id: 1, title: 'Linear functions · Practice', topic: 'Linear functions', due: 'Today', submitted: 18, total: 24, status: 'Active' },
            { id: 2, title: 'Systems of equations', topic: 'Systems of equations', due: 'Nov 6', submitted: 24, total: 24, status: 'Completed' },
            { id: 3, title: 'Quadratics · Check-in', topic: 'Quadratic equations', due: 'Nov 8', submitted: 11, total: 24, status: 'Active' }
        ],
        mistakes: [
            { id: 1, student: 'Robert Martin', initials: 'RM', topic: 'Distributing negative signs', detail: 'Sign error while expanding parentheses', when: '12 min ago', attempts: 4, resolved: false },
            { id: 2, student: 'Mia Patel', initials: 'MP', topic: 'Systems of equations', detail: 'Substitution step does not preserve equality', when: '38 min ago', attempts: 3, resolved: false },
            { id: 3, student: 'Noah Williams', initials: 'NW', topic: 'Linear functions', detail: 'Confusing slope with the y-intercept', when: 'Yesterday', attempts: 2, resolved: false },
            { id: 4, student: 'Ava Chen', initials: 'AC', topic: 'Exponent rules', detail: 'Adding exponents when multiplying powers', when: 'Yesterday', attempts: 2, resolved: true }
        ],
        topics: [
            { name: 'Linear functions', accuracy: 86, attempts: 128 },
            { name: 'Systems of equations', accuracy: 72, attempts: 94 },
            { name: 'Quadratic equations', accuracy: 64, attempts: 76 },
            { name: 'Exponents & radicals', accuracy: 58, attempts: 63 }
        ],
        activity: [
            { day: 'Mon', correct: 42, incorrect: 12 },
            { day: 'Tue', correct: 57, incorrect: 18 },
            { day: 'Wed', correct: 36, incorrect: 16 },
            { day: 'Thu', correct: 68, incorrect: 21 },
            { day: 'Fri', correct: 52, incorrect: 14 },
            { day: 'Sat', correct: 25, incorrect: 8 },
            { day: 'Sun', correct: 33, incorrect: 9 }
        ]
    }
];

export const dashboardSections = [
    { id: 'overview', label: 'Overview', icon: 'chart' },
    { id: 'students', label: 'Students', icon: 'users' },
    { id: 'assignments', label: 'Exercises', icon: 'assignments' },
    { id: 'mistakes', label: 'Mistakes log', icon: 'mistakes' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' }
];
