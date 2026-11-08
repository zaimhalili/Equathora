export function getCurrentAccuracy(activeClass, averageAccuracy) {
    const weeklyCorrect = activeClass.activity.reduce((total, day) => total + day.correct, 0);
    const weeklyIncorrect = activeClass.activity.reduce((total, day) => total + day.incorrect, 0);
    const weeklyAttempts = weeklyCorrect + weeklyIncorrect;

    return weeklyAttempts
        ? Math.round((weeklyCorrect / weeklyAttempts) * 100)
        : (activeClass.students.length ? averageAccuracy : null);
}
