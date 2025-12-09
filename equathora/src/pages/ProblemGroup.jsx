import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { Link, useParams } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner.jsx';
import { problemGroups, getProblemsByGroup, getGroupById } from '../data/problems';
import { isProblemCompleted, getProblemScore, isFavorite, toggleFavorite } from '../lib/progressStorage';
import { FaStar, FaRegStar, FaCheckCircle, FaClock, FaArrowLeft } from 'react-icons/fa';

const ProblemGroup = () => {
  const { groupId } = useParams();
  const group = getGroupById(parseInt(groupId));
  const problems = getProblemsByGroup(parseInt(groupId));

  if (!group) {
    return (
      <>
        <FeedbackBanner />
        <main className="w-full min-h-screen bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] font-[Inter]">
          <header>
            <Navbar />
          </header>
          <div className="flex justify-center items-center pt-20">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[var(--secondary-color)] pb-4">Group Not Found</h1>
              <Link to="/learn" className="text-[var(--accent-color)] underline">
                Return to Learn Page
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const handleFavoriteToggle = (problemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(problemId);
    // Force re-render
    window.location.reload();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completedCount = problems.filter(p => isProblemCompleted(p.id)).length;
  const totalCount = problems.length;

  return (
    <>
      <FeedbackBanner />
      <main className="w-full min-h-screen bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] font-[Inter]">
        <header>
          <Navbar />
        </header>

        {/* Hero Section */}
        <div className="flex w-full justify-center">
          <div className="px-[4vw] xl:px-[6vw] pt-6 pb-8 max-w-[1500px] w-full">
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 text-[var(--accent-color)] hover:underline pb-4"
            >
              <FaArrowLeft /> Back to Learn
            </Link>

            <div className="flex flex-col gap-2 pb-4">
              <h1 className="text-4xl font-bold text-[var(--secondary-color)] font-[DynaPuff]">
                {group.name}
              </h1>
              <p className="text-lg text-gray-600">
                {group.description}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm text-gray-600">
                  Progress: {completedCount}/{totalCount} completed
                </span>
                <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problems.map((problem) => {
                const completed = isProblemCompleted(problem.id);
                const score = getProblemScore(problem.id);
                const favorite = isFavorite(problem.id);

                return (
                  <Link
                    key={problem.id}
                    to={`/problems/${groupId}/${problem.id}`}
                    className="bg-white rounded-md shadow-[0_10px_10px_rgba(141,153,174,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(141,153,174,0.7)] transition-all duration-200 p-4 flex flex-col gap-3 relative"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleFavoriteToggle(problem.id, e)}
                      className="absolute top-3 right-3 text-xl text-yellow-500 hover:scale-110 transition-transform"
                    >
                      {favorite ? <FaStar /> : <FaRegStar />}
                    </button>

                    {/* Problem Title */}
                    <h3 className="text-lg font-bold text-[var(--secondary-color)] pr-8">
                      {problem.title}
                    </h3>

                    {/* Problem Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {problem.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>

                      {problem.premium && (
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-600">
                          Premium
                        </span>
                      )}

                      {completed && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <FaCheckCircle />
                          <span>{score}%</span>
                        </div>
                      )}
                    </div>

                    {/* Topic Tag */}
                    <div className="pt-1">
                      <span className="text-xs text-gray-500">
                        {problem.topic}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <footer>
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default ProblemGroup;