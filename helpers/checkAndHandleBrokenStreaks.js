const cron = require('node-cron');
const StreakModel = require('../model/StreakModel');
const NotesModel = require('../model/NotesModel');
const UserModel = require('../model/UserModel');

const checkAndHandleBrokenStreaks = async () => {
    try {
        const streaks = await StreakModel.find({});
        const now = new Date();

        for (const streak of streaks) {
            const lastUpdated = new Date(streak.lastUpdated);
            const diffTime = Math.abs(now - lastUpdated);
            const diffHours = diffTime / (1000 * 60 );

            if (diffHours >= 1) {
                streak.streakCount = 0;
                streak.lastUpdated = now;
                await streak.save();
                await sendNotesBackToOwner(streak.userId);
            }
        }

        console.log('Checked and handled broken streaks');
    } catch (error) {
        console.error('Error checking and handling broken streaks:', error);
    }
};

const sendNotesBackToOwner = async (userId) => {
    try {
        const userRecievingNotes = await UserModel.findById(userId).populate('notes');

        for( const note of userRecievingNotes.notes){
            for (const sharedWith of note.sharedWith) {
            const receivedUser = await UserModel.findById(sharedWith);
            console.log('receivedUser.recievedNotes', receivedUser.recievedNotes);
            // check if note is already shared with user
            if(receivedUser.recievedNotes.includes(note._id)){
                console.log('Note already shared with user');
                continue;
            }
            receivedUser.recievedNotes.push(note._id);
            await receivedUser.save();
        }
        }
        // console.log(`Notes sent back to owner for user ${userId}`);
    } catch (error) {
        console.error(`Error sending notes back to owner for user ${userId}:`, error);
    }
};

// Schedule the cron job to run every hour
cron.schedule('* * * * *', checkAndHandleBrokenStreaks);

// Export the function to manually trigger if needed
module.exports = { checkAndHandleBrokenStreaks };
