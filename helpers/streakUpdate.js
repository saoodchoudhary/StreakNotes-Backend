const StreakModel = require("../model/StreakModel");
const UserModel = require("../model/UserModel");

// Update streak endpoint
const StreakUpdate = async (uid, dateId) => {
  
    try {
        const streak = await StreakModel.findOne({userId: uid});
  

      if (!streak) {
        const newStreak = new StreakModel({userId: uid});
        await UserModel.findByIdAndUpdate(uid, { $push: { streaks: newStreak._id } });

        newStreak.streak.push(dateId);
        await newStreak.save();
        return { message: 'Streak created' };
      }else{

      const now = new Date();
      const lastUpdated = new Date(streak.lastUpdated);
      const diffTime = Math.abs(now - lastUpdated);
      const diffHours = diffTime / (1000 * 60 * 60);
      
      if (diffHours >= 48) {
        streak.streakCount = 0;
        streak.lastUpdated = now;
        await streak.save();
        return { message: 'Streak reset due to inactivity', streak };
      }
      
      if (diffHours >= 24) {
        streak.streakCount += 1;
        streak.lastUpdated = now;
        streak.streakDates.push(dateId);
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
  