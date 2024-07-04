const NotesModel = require("../model/NotesModel");
const UserModel = require("../model/UserModel");



const handleSaveNote = async (req, res) => {
    const { noteId, content , uid} = req.body;
   const user = await UserModel.findById({_id: uid});
    console.log('noteId', req.body);
    try {
        if (noteId) {
        await NotesModel.findByIdAndUpdate( noteId, { content , owner: user})    
        }
        else {
        const newNote = new NotesModel({
            content, owner: user
        });
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
