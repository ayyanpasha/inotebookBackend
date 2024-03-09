const express = require('express');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();

//Get All Notes using: GET "/api/note/". Login Required
router.get('/',
    fetchUser,
    async (req, res) => {
        try {
            const notes = await Note.find({ user: req.user.id });
            res.json(notes);
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
);

//Validator for Adding Note
const validateUserInput = [
    body('title').trim().isLength({ min: 3 }).withMessage("Title must be atleast 3 character"),
    body('description').trim().isLength({ min: 3 }).withMessage("Description must be atleast 5 character"),
];
//Add Notes using: POST "/api/note/". Login Required
router.post('/',
    fetchUser,
    validateUserInput,
    async (req, res) => {
        try {
            //Check for error in Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }
            const { title, description, tag } = req.body;
            //Create New Note document
            const note = new Note({
                title,
                description,
                tag,
                user: req.user.id
            });
            //Save the document
            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
);
//Update Existing Note using: PUT "/api/note/:id". Login Required
router.put('/:id',
    fetchUser,
    validateUserInput,
    async (req, res) => {
        try {
            //Check for error in Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }
            const { title, description, tag } = req.body;

            const updatedNote = {
                title,
                description,
                user: req.user.id
            };
            if (tag && tag.length > 0) {
                updatedNote.tag = tag
            }

            // Find the note to be updated
            const note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(400).send("Note not found");
            }
            //Check if it is authorized user
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Unauthorized");
            }
            res.json({ note: await Note.findByIdAndUpdate(req.params.id, { $set: updatedNote }, { new: true }) });
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
);
//Delete Existing Note using: DELETE "/api/note/:id". Login Required
router.delete('/:id',
    fetchUser,
    async (req, res) => {
        try {
            //Check for error in Validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array() });
            }

            // Find the note to be updated
            let note = await Note.findById(req.params.id);
            if (!note) {
                return res.status(400).send("Note not found");
            }
            //Check if it is authorized user
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Unauthorized");
            }
            note = await Note.findByIdAndDelete(req.params.id);
            res.json({ "Success": "Note has been deleted", note });
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
);
module.exports = router;