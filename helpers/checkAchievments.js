const checkAndUpdateAchievements = async (user) => {
  const achievements = [];

  if (user.streaks.length > 0) {
    achievements.push('First Streak');
  }
  if (user.streaks.length >= 7) {
    achievements.push('Week Streak');
  }
  if (user.streaks.length >= 30) {
    achievements.push('Month Streak');
  }
  if (user.streaks.length >= 100) {
    achievements.push('100 Days Streak');
  }
  if (user.streaks.length >= 365) {
    achievements.push('Streak Master');
  }
  if (( user.notes.sharedWith && user.notes.sharedWith.length >= 5)) {
    achievements.push('Collaborator');
  }
  if (user.notes.length >= 10) {
    achievements.push('Note Creator');
  }
  if (user.notes.length >= 50) {
    achievements.push('Note Master');
  }

  user.achievements = [...new Set(achievements)]; // Remove duplicates
  await user.save();
};


module.exports = checkAndUpdateAchievements;