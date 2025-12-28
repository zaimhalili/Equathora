# Dynamic Blog System for Equathora

## Overview
This blog system allows you to create unlimited blog posts without creating new JSX files for each post.

## How It Works

### File Structure
- **`src/data/blogPosts.js`** - Contains all blog post data
- **`src/pages/BlogPost.jsx`** - Dynamic template that renders any blog post
- **`src/pages/BlogList.jsx`** - Shows all blog posts in a grid
- **`src/pages/Blog.jsx`** - Your original static blog (can be removed or kept)

### Routes
- `/blogs` - List of all blog posts
- `/blog/:slug` - Individual blog post (e.g., `/blog/what-equathora-is-fixing`)
- `/blog` - Your original static blog post

## How to Add a New Blog Post

1. Open `src/data/blogPosts.js`
2. Add a new object to the `blogPosts` array following this structure:

```javascript
{
    id: "unique-id-here",
    slug: "url-friendly-slug",
    title: "Your Blog Post Title",
    author: {
        name: "Zaim",
        username: "@Zaim",
        profilePic: "/src/assets/images/autumn.jpg"
    },
    date: "28th Dec 2025",
    readTime: "5 min read",
    category: "Updates",
    description: "A brief description for the card",
    thumbnail: "/src/assets/images/journey.jpg",
    content: [
        {
            type: "heading",
            text: "Your Heading"
        },
        {
            type: "paragraph",
            text: "Your paragraph text. You can use <strong>HTML tags</strong> for formatting."
        },
        {
            type: "divider"
        },
        {
            type: "link",
            text: "Link text",
            url: "/some-page"
        },
        {
            type: "image",
            src: "/path/to/image.jpg",
            alt: "Image description"
        }
    ]
}
```

## Content Types

- **`heading`** - Large section heading
- **`paragraph`** - Text content (supports HTML)
- **`divider`** - Horizontal line
- **`link`** - Internal or external link
- **`image`** - Image with alt text

## Example Usage

To add a new blog post about "Problem Solving Tips":

```javascript
{
    id: "problem-solving-tips",
    slug: "problem-solving-tips",
    title: "5 Tips for Better Problem Solving",
    author: {
        name: "Zaim",
        username: "@Zaim",
        profilePic: "/src/assets/images/autumn.jpg"
    },
    date: "28th Dec 2025",
    readTime: "3 min read",
    category: "Tips & Tricks",
    description: "Learn the essential techniques for approaching complex problems.",
    thumbnail: "/src/assets/images/tips.jpg",
    content: [
        {
            type: "heading",
            text: "Start with the basics"
        },
        {
            type: "paragraph",
            text: "Before diving into complex problems, make sure you understand the fundamentals."
        }
        // ... more content
    ]
}
```

The post will automatically be available at: `/blog/problem-solving-tips`

## Share Button Position Fix

The ShareButton component now supports a `popupPosition` prop:
- `"right"` (default) - Popup appears on the right
- `"left"` - Popup appears on the left
- `"center"` - Popup appears centered
- `"top"` - Popup appears above the button

Usage:
```jsx
<ShareButton 
    text="Share text"
    url={window.location.href}
    popupPosition="left"
/>
```

## Benefits

✅ No need to create new JSX files for each blog post
✅ Consistent design across all posts
✅ Easy to maintain and update
✅ SEO-friendly URLs
✅ Automatic "Other Posts" suggestions
✅ Centralized content management
