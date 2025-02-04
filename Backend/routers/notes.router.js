import { addNewNotesData, deleteNote, getAllNotesData, updateNoteData } from "../controllers/notes.controllers.js"
import express from "express";
const router = express.Router()

router.get('/allNotes', getAllNotesData)
router.post('/notes', addNewNotesData)
router.delete('/deleteNote/:_id', deleteNote)
router.put('/updateNotes/:_id', updateNoteData)

export default router;