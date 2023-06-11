import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { noteContext } from "../context/note/noteContext";
import NoteList from "./NoteList";

function Note() {
  const context = useContext(noteContext);
  const { notes, getAllNote, updateNote } = context;

  const navigate = useNavigate();
  const ref = useRef("");
  const refClose = useRef("");

  const [note, setnote] = useState({ id: "", etitle: "", edescription: "" });

  useEffect(() => {
    if (localStorage.getItem("token")) getAllNote();
    else navigate("/login");
    // eslint-disable-next-line
  }, []);

  const updateCurrentNote = (currnote) => {
    setnote({
      id: currnote._id,
      etitle: currnote.title,
      edescription: currnote.description,
    });
    ref.current.click();
  };

  const handelOnChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value });
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    updateNote(note.id, note.etitle, note.edescription);
    refClose.current.click();
  };

  return (
    <div className="container mt-4">
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div> */}
            <div className="modal-body">
              <form action="">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    placeholder="Title"
                    onChange={handelOnChange}
                    value={note.etitle}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    rows="5"
                    placeholder="Take a note..."
                    onChange={handelOnChange}
                    value={note.edescription}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOnClick}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {notes.map((note) => {
          return (
            <div className="col-lg-3 col-md-4 col-12" key={note._id}>
              <NoteList note={note} updateCurrentNote={updateCurrentNote} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Note;
