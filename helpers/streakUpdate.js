const StreakModel = require("../model/StreakModel");
const UserModel = require("../model/UserModel");
const checkAndUpdateAchievements = require("./checkAchievments");

// Update streak endpoint
const StreakUpdate = async (uid, dateId) => {
    const user = await UserModel.findById(uid);
  
    try {
        const streak = await StreakModel.findOne({userId: uid});
  

      if (!streak) {
        const newStreak = new StreakModel({userId: uid});
        await UserModel.findByIdAndUpdate(uid, { $push: { streaks: newStreak._id } });
        // update Score

        user.score += 2;
        await user.save();

        newStreak.streak.push(dateId);
        await newStreak.save();
        return { message: 'Streak created' };
      }else{

      const now = new Date();
      const lastUpdated = new Date(streak.lastUpdated);
      const diffTime = Math.abs(now - lastUpdated);
      const diffHours = diffTime / (1000 * 60);
      console.log('diffHours', diffHours);  
      
      if (diffHours >= 2) {
        streak.streakCount = 0;
        streak.lastUpdated = now;
        await streak.save();
        return { message: 'Streak reset due to inactivity', streak };
      }
      
      if (diffHours >= 1) {
        
        streak.streakCount += 1;
        streak.maxStreak = Math.max(streak.maxStreak, streak.streakCount);
        user.score += 2;
        await user.save();
        streak.lastUpdated = now;
        streak.streak.push(dateId);

        await checkAndUpdateAchievements(user);
        await streak.save();
       return { message: 'Streak updated' };
      } else {
      return { message: 'Streak can only be updated once per day' };
      }
      }
  
     
    } catch (error) {
      return { message: 'Server error', error };
    }
  };

module.exports = StreakUpdate;
  