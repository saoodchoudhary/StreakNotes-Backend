const AchievementModel = require("../model/AchievementModel");
const UserModel = require("../model/UserModel");

const checkAchievements = async (userId) => {
    const user = await UserModel.findById(userId).populate('notes streaks');
  
    const noteCount = user.notes.length;
    const longestStreak = Math.max(...user.streaks.map(streak => streak.count));
  
    const achievements = [];
  
    // Checking note count achievements
    if (noteCount >= 10) achievements.push({ stars: 1, level: 'Bronze' });
    if (noteCount >= 25) achievements.push({ stars: 2, level: 'Silver' });
    if (noteCount >= 50) achievements.push({ stars: 3, level: 'Gold' });
    if (noteCount >= 100) achievements.push({ stars: 4, level: 'Diamond' });
    if (noteCount >= 200) achievements.push({ stars: 5, level: 'Platinum' });

  
    // Checking streak achievements
    if (longestStreak >= 7) achievements.push({ stars: 1, level: 'Bronze' });
    if (longestStreak >= 30) achievements.push({ stars: 2, level: 'Silver' });
    if (longestStreak >= 100) achievements.push({ stars: 3, level: 'Gold' });
    if (longestStreak >= 200) achievements.push({ stars: 4, level: 'Diamond' });
    if (longestStreak >= 365) achievements.push({ stars: 5, level: 'Platinum' });
  
    for (const ach of achievements) {
      const achievement = new AchievementModel(ach);
      console.log(achievement);
      await achievement.save();
      user.achievements.push(achievement);
    }
  
    await user.save();
  };
  

  module.exports = checkAchievements;