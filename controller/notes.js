const { default: mongoose } = require("mongoose");
const StreakUpdate = require("../helpers/streakUpdate");
const NotesModel = require("../model/NotesModel");
const StreakModel = require("../model/StreakModel");
const UserModel = require("../model/UserModel");



const handleSaveNote = async (req, res) => {
    const { noteId, content, dateId, uid } = req.body;
    const user = await UserModel.findById({ _id: uid });


    //    find user streak and update it
    const streak = await StreakUpdate(uid, dateId)
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

const handleSendNotes = async (req, res) => {
    const { noteId, userIds } = req.body;

  if (!noteId || !Array.isArray(userIds)) {
    return res.status(400).send({ error: 'Invalid input data' });
  }

  try {
    const note = await NotesModel.findById(noteId).select('sharedWith');

    if (!note) {
      return res.status(404).send({ error: 'Note not found' });
    }

    // Add userIds to the sharedWith field if they are not already present
    userIds.forEach(async (userId) => {
      if (!note.sharedWith.includes(userId)) {
        note.sharedWith.push(userId);
      }
    });

    await note.save();
    
    res.status(200).send({ message: 'Note shared successfully', note });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while sharing the note' });
  }
};

module.exports = {
    handleSaveNote,
    handleNotesList,
    handleSendNotes
};
