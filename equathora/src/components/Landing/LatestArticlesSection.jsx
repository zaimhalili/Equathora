import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { getAllBlogPosts } from '../../data/blogPosts.js';

const LatestArticlesSection = () => {
    const blogPosts = getAllBlogPosts();
    const displayedPosts = blogPosts.slice(0, 3);

    return (
        <section className="w-full bg-white relative overflow-hidden flex justify-center">
            {/* Background decorations */}
            <div className="absolute top-20 right-20 w-32 h-32 border border-gray-100 rounded-full opacity-50" />
            <div className="absolute bottom-10 left-10 w-24 h-24 border border-[var(--accent-color)]/10 rounded-full" />

            <div className="max-w-[1400px] px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-7 sm:py-14 md:py-16 lg:py-18 relative z-10">
                <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">

                    {/* Section header - Centered */}
                    <motion.div
                        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="flex flex-col text-center md:text-left">
                            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-extrabold text-[var(--secondary-color)] pb-4">
                                Latest articles
                            </h2>
                            <p className="text-sm sm:text-xl md:text-2xl max-w-3xl font-light">
                                Updates, insights, and thoughts on math learning
                            </p>
                        </div>
                        <Link
                                to={blogPosts.length > 0 ? `/blog/${blogPosts[0].slug}` : "/blogs"}
                                className="group relative text-sm sm:text-base !text-[var(--secondary-color)] font-medium transition-all flex items-center gap-2 min-w-[140px]"
                            >
                                <FaArrowRight className="text-xs sm:text-sm opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                                <span className="transition-transform duration-300">View all articles</span>
                                <FaArrowRight className="text-xs sm:text-sm opacity-100 group-hover:translate-x-4 group-hover:opacity-0 transition-all duration-300" />
                            </Link>
                    </motion.div>

                    {/* Articles grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
                        {displayedPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="group flex flex-col bg-white rounded-md border border-gray-100 overflow-hidden transition-all shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] duration-200 ease-out hover:scale-105"
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden h-44 sm:h-48">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 "
                                        />
                                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                                            <span className="px-2.5 sm:px-3 py-1 bg-[var(--accent-color)] text-white text-[10px] sm:text-xs font-semibold rounded-full">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-2.5 sm:gap-3 p-5 sm:p-6">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--mid-main-secondary)]">
                                            <span>{post.date}</span>
                                            {post.readTime && <span>· {post.readTime}</span>}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-[var(--secondary-color)] line-clamp-2 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-[var(--mid-main-secondary)] text-xs sm:text-sm line-clamp-2">
                                            {post.description}
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                                            <img
                                                src={post.author.profilePic}
                                                alt={post.author.name}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="text-xs sm:text-sm font-semibold text-[var(--secondary-color)]">{post.author.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestArticlesSection;
