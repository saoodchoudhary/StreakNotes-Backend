const checkAndUpdateAchievements = async (user) => {
  // console.log('user', user);
  const streaksNotesPop = await user.populate('streaks notes');
  // console.log('userPop', streaksNotesPop);

  const achievements = [];

  if (streaksNotesPop.streaks[0].maxStreak > 0) {
    achievements.push('First Streak');
  }
  if (streaksNotesPop.streaks[0].maxStreak >= 7) {
    achievements.push('Week Streak');
  }
  if (streaksNotesPop.streaks[0].maxStreak >= 30) {
    achievements.push('Month Streak');
  }
  if (streaksNotesPop.streaks[0].maxStreak >= 100) {
    achievements.push('100 Days Streak');
  }
  if (streaksNotesPop.streaks[0].maxStreak >= 365) {
    achievements.push('Streak Master');
  }
  for (const note of streaksNotesPop.notes) {
    if (note.sharedWith.length >= 5) {
      achievements.push('Collaborator');
    }
  }
  if (streaksNotesPop.notes.length >= 10) {
    achievements.push('Note Creator');
  }
  if (streaksNotesPop.notes.length >= 50) {
    achievements.push('Note Master');
  }

  user.achievements = [...new Set(achievements)]; // Remove duplicates
  await user.save();
};


module.exports = checkAndUpdateAchievements;