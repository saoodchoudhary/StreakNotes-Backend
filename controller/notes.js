const StreakUpdate = require("../helpers/streakUpdate");
const NotesModel = require("../model/NotesModel");
const StreakModel = require("../model/StreakModel");
const UserModel = require("../model/UserModel");



const handleSaveNote = async (req, res) => {
    const { noteId, content, dateId, uid } = req.body;
    const user = await UserModel.findById({ _id: uid });


    //    find user streak and update it
    const streak = await StreakUpdate(uid)
    console.log('streak', streak);


    try {
        if (noteId) {
            await NotesModel.findByIdAndUpdate(noteId, { content, owner: user })

            res.json({ noteId });
        }

        else {
            const newNote = new NotesModel({
                dateId, content, owner: user
            });

            await UserModel.findByIdAndUpdate(uid, { $push: { notes: newNote._id } });
            await newNote.save();
            res.json({ newNote, noteId: newNote._id });
        }

    }
    catch (error) {
        console.error('Failed to save note', error);
        res.status(500).json({ error: 'Failed to save note' });
    }
}


const handleNotesList = async (req, res) => {
    const { uid, dateId } = req.body;
    try {
        // fetch notes for the user and today's date
        const user = await UserModel.findById(uid).populate('notes');
        const notes = await NotesModel.find({ owner: user, dateId });
        console.log('user', notes);
        res.json(notes);
    } catch (error) {
        console.error('Failed to fetch notes', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
};

module.exports = {
    handleSaveNote,
    handleNotesList
};
