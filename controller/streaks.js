const StreakModel = require("../model/StreakModel");


const handleGetStreakAndRestoreDates = async (req, res) => {
    const {userId} = req.body;
    console.log(req.body);

    try{
        const userStreaks = await StreakModel.findOne({userId});
        if (!userStreaks){
            return res.status(400).json({message: "user does not exist"});
        }

        const streakDates = userStreaks.streak;
        const streakRestoreDates = userStreaks.restoreStreak;
        res.status(200).json({streakDates, streakRestoreDates});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {
    handleGetStreakAndRestoreDates
};