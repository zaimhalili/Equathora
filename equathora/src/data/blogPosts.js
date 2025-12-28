// Blog posts data - Add new posts here without creating new JSX files
export const blogPosts = [
    {
        id: "what-equathora-is-fixing",
        slug: "what-equathora-is-fixing",
        title: "What Equathora Is Trying to Fix in Math & Logic Learning",
        author: {
            name: "Zaim",
            username: "@Zaim",
            profilePic: "/src/assets/images/autumn.jpg"
        },
        date: "20th Aug 2025",
        readTime: "5 min read",
        category: "Platform Updates",
        description: "Most online math platforms focus on repetition and memorization. Here's how Equathora is different.",
        thumbnail: "/src/assets/images/journey.jpg",
        content: [
            {
                type: "heading",
                text: "Why most math practice fails"
            },
            {
                type: "paragraph",
                text: "Most online math platforms focus on repetition and memorization. Students learn to recognize patterns instead of developing real problem-solving and <strong>logical reasoning skills.</strong> When problems change format, performance drops. A lot of math practice today turns into repetition. You learn how to recognize a template, apply a formula, and move on. It works for tests, but it rarely teaches you how to think when the problem doesn't look familiar."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "The idea behind Equathora"
            },
            {
                type: "paragraph",
                text: "Equathora is a problem-solving platform built around logic and mathematical reasoning. Instead of template-based exercises, problems require step-by-step thinking and allow <strong>multiple</strong> valid solution paths. The focus is on understanding, not speed."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "What the Equathora MVP includes"
            },
            {
                type: "paragraph",
                text: "The current MVP focuses on core features only. Users can solve logic and math problems organized by topic, read full solution explanations, and track progress through a simple scoring system. The interface is intentionally <strong>clean</strong> to reduce distractions and keep attention on reasoning."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Planned features and roadmap"
            },
            {
                type: "paragraph",
                text: "Future updates will introduce partial-credit solutions, mentor and teacher monitoring, and light gamification through <strong>achievements</strong> and <strong>timers.</strong> Most content will remain free, while advanced guidance and feedback will be unlocked through a token-based system."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Get involved"
            },
            {
                type: "paragraph",
                text: "If you're interested in improving logical thinking and math problem-solving skills, you can follow development updates and <strong>early access</strong> here:"
            },
            {
                type: "link",
                text: "Join the Equathora waitlist",
                url: "/waitlist"
            },
            {
                type: "paragraph",
                text: "<br /><br />This forum isn't just for updates. Feedback matters. If something feels missing, unnecessary, or poorly designed, say it. Equathora is meant to be shaped through discussion. <br /><br /><strong>The goal? <br />Not more problems. Better thinking.</strong>"
            }
        ]
    },
    // Add more blog posts here following the same structure
    {
        id: "welcome-to-equathora",
        slug: "welcome-to-equathora",
        title: "Welcome to Equathora: The Future of Logic Learning",
        author: {
            name: "Zaim",
            username: "@Zaim",
            profilePic: "/src/assets/images/autumn.jpg"
        },
        date: "15th Aug 2025",
        readTime: "3 min read",
        category: "Introduction",
        description: "Learn about our mission to transform how students approach mathematical and logical thinking.",
        thumbnail: "/src/assets/images/journey.jpg",
        content: [
            {
                type: "heading",
                text: "A New Approach to Learning"
            },
            {
                type: "paragraph",
                text: "Welcome to Equathora! We're building something different in the world of math education. This is just a placeholder post to show how the dynamic blog system works."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "What Makes Us Different"
            },
            {
                type: "paragraph",
                text: "Unlike traditional platforms, we focus on deep understanding rather than superficial pattern matching."
            }
        ]
    }
];

// Helper function to get a blog post by slug
export const getBlogPostBySlug = (slug) => {
    return blogPosts.find(post => post.slug === slug);
};

// Helper function to get all blog posts
export const getAllBlogPosts = () => {
    return blogPosts;
};
