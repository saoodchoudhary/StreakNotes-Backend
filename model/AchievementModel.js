const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    stars: { type: Number, required: true },
    level: { type: String, required: true, enum: ['Bronze', 'Silver', 'Gold', 'Diamond', 'Platinum'] },
    dateAchieved: { type: Date, default: Date.now },
  });
  
    // Middleware to update the updatedAt field before each save
AchievementSchema.pre('save', function (next) {
    this.dateAchieved = Date.now();
    next();
}
);

const AchievementModel = mongoose.model('achievements', AchievementSchema);

module.exports = AchievementModel;
