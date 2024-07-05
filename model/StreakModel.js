const mongoose = require('mongoose');

const StreakSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    streak: { type: Array, default: [] },
    restoreStreak: { type: Array, default: [] },
    lastUpdated: { type: Date, default: Date.now },
  });

 

const StreakModel = mongoose.model('streaks', StreakSchema);

module.exports = StreakModel;
