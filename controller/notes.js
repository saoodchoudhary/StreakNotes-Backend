const StreakUpdate = require("../helpers/streakUpdate");
const NotesModel = require("../model/NotesModel");
const StreakModel = require("../model/StreakModel");
const UserModel = require("../model/UserModel");



const handleSaveNote = async (req, res) => {
    const { noteId, content , uid} = req.body;
   const user = await UserModel.findById({_id: uid});
   

//    find user streak and update it
 const streak = await StreakUpdate(uid)
  console.log('streak', streak);


    try {
        if (noteId) {
        await NotesModel.findByIdAndUpdate( noteId, { content , owner: user}) 

        res.json({noteId});  
        }
        else {
        const newNote = new NotesModel({
            content, owner: user
        });
        
        await UserModel.findByIdAndUpdate(uid, { $push: { notes: newNote._id } }); 
        await newNote.save();
        res.json({newNote, noteId: newNote._id});
        }

    }
    catch (error) {
        console.error('Failed to save note', error);
        res.status(500).json({ error: 'Failed to save note' });
    }
}

module.exports = {
    handleSaveNote
};
