import { useState } from "react";
import { noteContext } from "./noteContext";

export const NoteState = (props) =>{

    const host="http://localhost:4000"

    const [notes, setnotes] = useState([])

    // To Create New Note
    const addNote = async(title,description)=>{
    const response = await fetch(`${host}/api/note/createNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-header": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description}), // body data type must match "Content-Type" header
    });

    const json = await response.json(); // parses JSON response into native JavaScript objects
    setnotes(notes.concat(json));

    }

    // TO Get All Note
    const getAllNote = async()=>{
      const response = await fetch(`${host}/api/note/getAllNote`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("token"),
        }
            });
  
      const json = await response.json(); // parses JSON response into native JavaScript objects

      setnotes(json.notes);
    }

    // TO Delete Note
    const deleteNote = async(id)=>{
      const response = await fetch(`${host}/api/note/deleteNote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("token"),
        }
            });
  
      const json = await response.json(); // parses JSON response into native JavaScript objects
      console.log(json);

      const newNote = notes.filter((note)=>{
          return note._id !== id
      })
      setnotes(newNote);
    }

    // To Update Note
    const updateNote = async(id,title,description)=>{
      
      const response = await fetch(`${host}/api/note/updateNote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description}), // body data type must match "Content-Type" header
      });
      
      // eslint-disable-next-line
      const json = await response.json(); // parses JSON response into native JavaScript objects

      const newNote =  JSON.parse(JSON.stringify(notes));
        
      console.log(notes);
      for (let i = 0; i < newNote.length; i++) {
        const element = newNote[i];
        if(element._id===id){
          element.title = title
          element.description = description
        } 
      }

      console.log(newNote);
      setnotes(newNote)
    }

    return(
        <noteContext.Provider value={{notes,addNote,getAllNote, deleteNote, updateNote}}>
            {props.children}
        </noteContext.Provider>
    )
}