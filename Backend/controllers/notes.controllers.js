import NotesData from "../models/notes.model.js";

export const getAllNotesData = async (req, res) => {
  try {
    await NotesData.find().then((result) => {
      res.status(201).send({
        message: "Getting All Notes Data",
        success: true,
        notesData: result,
      });
    });
  } catch (error) {
    res.status(501).send({
      message: "Something went worong in Get notes Api",
      success: false,
      error,
    });
  }
};

export const addNewNotesData = async (req, res) => {
  try {
    const Note = new NotesData({
      title: req.body.title,
      content: req.body.content,
      pinned: req.body.pinned,
      color: req.body.color,
      tags: req.body.tags,
    });
    await Note.save().then((result) => {
      res.status(201).send({
        message: "New Notes Added",
        success: true,
        Note,
      });
    });
  } catch (error) {
    res.status(501).send({
      message: "Something went worong in Add notes Api",
      success: false,
      error,
    });
  }
};

export const deleteNote = async (req, res) => {
  await NotesData.findByIdAndDelete({ _id: req.params._id })
    .exec()
    .then((result) => {
      res.status(201).send({
        message: "Note Delete successfully",
        result,
      });
    })
    .catch((error) => {
      res.status(501).send({
        message: "Something went worong in Delete notes Api",
        success: false,
        error,
      });
    });
};

export const updateNoteData = async (req, res) => {
  try {
    console.log(req.params._id);
    // const dID={
    //     _id: new mongoose.ObjectId(req.params._id)
    // }
    await NotesData.findByIdAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          pinned: req.body.pinned,
          color: req.body.color,
          tags: req.body.tags,
        },
      }
    ).then((result) => {
      res.status(201).send({
        message: "Note Data Updated",
        success: true,
        result,
      });
    });
  } catch (error) {
    res.status(501).send({
      message: "Something went worong in update notes Api",
      success: false,
      error,
    });
  }
};
