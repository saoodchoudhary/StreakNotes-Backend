const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileType: { type: String, enum: ['public', 'private'], default: 'public' },
    streaks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'streaks' }],
    score: { type: Number, default: 0 },
    profileImage: { type: String , default : "" },  // URL to the profile image
    profileBannerImage: { type: String , default : ""},  // URL to the profile banner image
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notes' }],
    recievedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notes' }],
    totalNotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before each save
UserSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;