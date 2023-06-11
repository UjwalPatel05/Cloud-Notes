import React, { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import { noteContext } from "../context/note/noteContext";

function NoteList(props) {
  
  const context = useContext(noteContext);
  const {deleteNote} = context
  const {updateCurrentNote,note} = props
   
  return (
    <div>
      <div className="card mt-2" style={{Width:"18rem"}}>
        <div className="card-body">
          <h6 className="card-title">{note.title}</h6>
          <p className="card-text">
            {note.description}
          </p>
          <EmailIcon style={{color:"lightseagreen", cursor:"pointer"}} onClick={()=>{updateCurrentNote(note)}}/>
          <DeleteIcon style={{color:"#ef5c42", cursor:"pointer"}} className="me-1" onClick={()=>{deleteNote(note._id)}}/>
        </div>
      </div>
    </div>
  );
}

export default NoteList;
