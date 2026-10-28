// Blog posts data - Add new posts here without creating new JSX files
import Journey from '../assets/images/journey.webp';
import Me from '../assets/images/mePr.webp';
import Sketch from '../assets/images/sketch.svg';
import Math from '../assets/images/mathfix.webp';
// Note: Add 'features.jpg' to src/assets/images/ or use a different image

export const blogPosts = [
    {
        id: "understand-math-faster-with-equathora",
        slug: "understand-math-faster-with-equathora",
        title: "Understand Math Faster with Equathora: A Better Way to Practice",
        author: {
            name: "Equathora",
            username: "@Equathora",
            profilePic: Me
        },
        date: "28th Oct 2026",
        publishedAt: "2026-10-28",
        readTime: "4 min read",
        category: "Learning",
        description: "See how Equathora helps students practice math with focused problems, step-by-step reasoning, and progress tools built for lasting understanding.",
        keywords: [
            "understand math faster",
            "math problem solving",
            "online math practice",
            "learn math effectively",
            "Equathora"
        ],
        thumbnail: "https://i.ytimg.com/vi/AqwmYAHEPeM/hqdefault.jpg",
        videoId: "AqwmYAHEPeM",
        videoTitle: "Understand Math Faster with Equathora",
        content: [
            {
                type: "paragraph",
                text: "Want to understand math faster? The answer is not always to do more exercises or memorize more formulas. A more useful approach is to practice actively: try a problem, make your reasoning visible, and learn from the steps that did and did not work. Equathora is designed around that kind of focused math practice."
            },
            {
                type: "video",
                videoId: "AqwmYAHEPeM",
                title: "Understand Math Faster with Equathora"
            },
            {
                type: "heading",
                text: "Math understanding comes from working through problems"
            },
            {
                type: "paragraph",
                text: "Watching an explanation can help introduce a concept, but understanding grows when you use it yourself. Solving a problem asks you to identify what is known, choose a strategy, test your assumptions, and explain why an answer makes sense. That active process builds a stronger foundation than recognizing a solution after someone else has already shown it."
            },
            {
                type: "paragraph",
                text: "When a solution does not work, that attempt is still useful. It can reveal a missed condition, an arithmetic slip, or a gap in understanding."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "A more focused way to practice math"
            },
            {
                type: "paragraph",
                text: "Equathora brings math and logic problems into a focused practice experience. Learners can work through challenges, organize their practice by topic and difficulty, and review explanations after solving. The aim is to make it easier to concentrate on the problem in front of you and understand the thinking behind a solution."
            },
            {
                type: "paragraph",
                text: "A productive session does not need to be long. Choose a problem that is challenging but approachable, give yourself time to think, and write down the steps you are considering. If you get stuck, revisit the conditions and try a different representation before looking at a solution. Afterward, note what helped you make progress."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Build a steady learning habit"
            },
            {
                type: "paragraph",
                text: "Progress in mathematics is rarely a straight line. Some ideas click quickly; others take repeated attempts. Consistent practice makes it easier to notice patterns in your own learning, revisit topics, and build confidence one step at a time. Equathora's progress tools, including topic and difficulty tracking, can help you see the work you have put in and decide what to practice next."
            },
            {
                type: "paragraph",
                text: "The goal is not to rush through every question. Work at a pace that lets you think clearly, and treat speed as a result of familiarity rather than a substitute for understanding. With deliberate practice, you can get better at recognizing useful strategies and explaining why they work."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Try a different approach to learning math"
            },
            {
                type: "paragraph",
                text: "If you want to improve your math problem-solving skills, start with curiosity rather than pressure. Attempt a challenge, explore the reasoning, and return regularly. Equathora is built to support that process with structured practice and feedback that keeps the focus on learning."
            },
            {
                type: "link",
                text: "Explore math practice on Equathora",
                url: "/learn"
            }
        ]
    },
    {
        id: "what-equathora-is-fixing",
        slug: "what-equathora-is-fixing",
        title: "What Equathora Is Trying to Fix in Math & Logic Learning",
        author: {
            name: "Zaim",
            username: "@Zaim",
            profilePic: Me
        },
        date: "24th Dec 2025",
        readTime: "5 min read",
        category: "Platform Updates",
        description: "Most online math platforms focus on repetition and memorization. Here's how Equathora is different.",
        thumbnail: Math,
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
                text: "The current MVP focuses on core features only. Users can solve logic and math problems organized by topic, read full solution explanations, and track progress through a simple scoring system. The Interface is intentionally <strong>clean</strong> to reduce distractions and keep attention on reasoning."
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
                text: "Join Equathora Briefs",
                url: "/equathora-briefs"
            },
            {
                type: "paragraph",
                text: "<br />This forum isn't just for updates. Feedback matters. If something feels missing, unnecessary, or poorly designed, say it. Equathora is meant to be shaped through discussion. <br /><br /><strong>The goal? <br />Not more problems. Better thinking.</strong>"
            }
        ]
    },
    // Add more blog posts here following the same structure
    {
        id: "tools-and-features-coming-to-equathora",
        slug: "tools-and-features-coming-to-equathora",
        title: "New Tools on Equathora: Leaderboards, Sketch Pad, and Full Data Export",
        author: {
            name: "Zaim",
            username: "@Zaim",
            profilePic: Me,
        },
        date: "28th Dec 2025",
        readTime: "7 min read",
        category: "Platform Updates",
        description: "From time-based leaderboards to an in-problem sketch pad and full CSV/PDF exports, here's a deeper look at new Equathora features and why they exist.",
        thumbnail: Sketch, // Change to actual features.jpg when available
        content: [
            {
                type: "heading",
                text: "Why features should support thinking, not distract from it"
            },
            {
                type: "paragraph",
                text: "Every feature added to Equathora follows one rule: it must improve how students <strong>think</strong>, not how flashy the platform looks. Many learning platforms overload users with animations, pop-ups, and artificial rewards. The result is attention fragmentation. On Equathora, new tools are designed to stay out of the way while still giving students meaningful feedback and control over their learning process."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Time-based leaderboards (and why speed is optional)"
            },
            {
                type: "paragraph",
                text: "Leaderboards on Equathora are not about raw point farming. Instead, they are structured around <strong>time taken to solve problems</strong>, but only after a correct solution is reached. This means accuracy comes first. Speed becomes relevant only when reasoning is correct."
            },
            {
                type: "paragraph",
                text: "Students will be ranked by how efficiently they solve problems within the same difficulty and topic category. This avoids unfair comparisons between beginners and advanced users. Importantly, leaderboards are <strong>opt-in</strong>. If a student prefers to focus purely on learning without any competitive element, they can ignore them completely."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Why timing matters in problem solving"
            },
            {
                type: "paragraph",
                text: "Tracking time is not about rushing. It helps students recognize when they are overthinking simple steps or getting stuck on unproductive paths. Over time, patterns emerge: faster recognition of constraints, cleaner reasoning, and more structured approaches. The leaderboard is meant to reflect <strong>clarity of thought</strong>, not stress-induced speed."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "The built-in sketch pad"
            },
            {
                type: "paragraph",
                text: "Many logic and math problems are easier to solve visually. That’s why Equathora includes a built-in <strong>sketch pad</strong>. On the problem page, you can click the button in the <strong>top-right of the navbar</strong> to activate it. Once opened, you can freely draw diagrams, tables, graphs, or Intermediate steps."
            },
            {
                type: "paragraph",
                text: "The sketch pad is intentionally lightweight. Drawings are <strong>not saved</strong>, shared, or graded. It exists purely as a thinking aid, similar to scratch paper during an exam. This keeps privacy intact and avoids turning rough thinking into something users feel pressured to perfect."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Why unsaved sketches are a deliberate choice"
            },
            {
                type: "paragraph",
                text: "Not saving sketches reduces friction. Students can experiment, cross things out, and make mistakes without worrying about how it looks later. The goal is freedom of exploration. If something works, the understanding stays with you. If it doesn’t, it disappears with the sketch."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Full data ownership: CSV and PDF exports"
            },
            {
                type: "paragraph",
                text: "On the profile page, users can export their full activity data as <strong>CSV or PDF</strong>. This includes solved problems, timestamps, scores, and progress by topic. The idea is simple: <strong>your data belongs to you.</strong>"
            },
            {
                type: "paragraph",
                text: "Students can use exports to track improvement over time, teachers can review progress offline, and advanced users can even analyze their own patterns. Nothing is locked behind opaque dashboards. Transparency is intentional."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Designed for students, teachers, and mentors"
            },
            {
                type: "paragraph",
                text: "These features are not just for individual learners. Leaderboards can highlight strong performers, sketch pads support different thinking styles, and data exports make Equathora usable in real educational settings. Teachers and mentors can review progress without needing constant live access."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Still evolving"
            },
            {
                type: "paragraph",
                text: "This is not a finished system. Features will change, improve, or even be removed if they don't genuinely help learning. Feedback is not optional here, it's essential. If something feels distracting, confusing, or unnecessary, it should be questioned."
            },
            {
                type: "divider"
            },
            {
                type: "heading",
                text: "Get early access and shape it"
            },
            {
                type: "paragraph",
                text: "Equathora is being built in public. If you want access to these features and a say in how they evolve, you can join early and be part of the discussion."
            },
            {
                type: "link",
                text: "Join Equathora Briefs",
                url: "/equathora-briefs"
            },
            {
                type: "paragraph",
                text: "<br /><strong>The aim is simple:</strong><br />Give students tools that respect their intelligence.<br />No noise. No shortcuts. Just better thinking."
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
