const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  dateId: { type: String, required: true},
  content: { type: String, },
  voice: { type: String },  // URL to the voice recording
  image: { type: String , },  // URL to the image
  video: { type: String },  // URL to the video
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pausedUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt field before each save
NotesSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
const NotesModel = mongoose.model('notes', NotesSchema);

module.exports = NotesModel;