import React, { useContext, useState } from "react";
import { noteContext } from "../context/note/noteContext";
import "./css/AddNote.css";

function AddNote() {

  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setnote] = useState({ title: "", description: "" });

  const handelOnChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value });
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description);
    setnote({
      title: "",
      description: "",
    });
  };

  return (
    <div className="container">
      <div className="mt-4 addNoteContainer">
        <form action="">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              placeholder="Title"
              value={note.title}
              onChange={handelOnChange}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="5"
              placeholder="Take a note..."
              value={note.description}
              onChange={handelOnChange}
            ></textarea>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOnClick}
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNote;
