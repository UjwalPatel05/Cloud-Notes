const express = require('express');
const authUser = require('../middleware/authUser');
const Note = require('../models/Note');
const Router = express.Router()


// Route 1: Get All Notes
// Path: /api/note/getAllNote

Router.get("/getAllNote", authUser, async(req, res) => {
    try {
        const _id = req._id
        const notes = await Note.find({ user: _id })
        res.send({ notes: notes })
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }
})


// Route 2: Create Note
// Path: /api/note/createNote

Router.post("/createNote", authUser, async(req, res) => {
    try {
        const { title, description } = req.body
        const _id = req._id
        const note = new Note({ title, description, user: _id })
        const saved_note = await note.save();
        res.send(saved_note)
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })

    }
})


// Route 3: Delete Note
// Path: /api/note/deleteNote/:id

Router.delete("/deleteNote/:id", authUser, async(req, res) => {
    try {
        const _id = req.params.id
        const note = await Note.findByIdAndDelete({ _id })
        res.send({ note: note })
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }
})


// Route 4: Update Note
// Path: /api/note/updateNote

Router.put("/updateNote/:id", authUser, async(req, res) => {
    try {
        const _id = req.params.id
        const note = await Note.findByIdAndUpdate(_id, { $set: req.body }, { new: true })
        res.send({ note: note })
    } catch (error) {
        return res.status(500).send({ default_error: error, error_message: "Internal Server Error...!!!", error: 1 })
    }
})


module.exports = Router