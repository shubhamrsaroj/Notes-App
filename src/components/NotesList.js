import Note from "./Note";
import AddNote from "./AddNote";
import { FaCircle } from "react-icons/fa";

const NotesList=({notes,handleAddNote,deleteIt,greenit})=>{
    return(
        
        <div className="notes-list">
            
          {

              notes.map((note)=>(
                <Note id={note.id} notes={note.text} date={note.date} deleteIt={deleteIt} greenit={greenit} 
                />
                
              ))
              
          }  

            
          <AddNote handleAddNote={handleAddNote} />
            
        </div> 

    )
}

export default NotesList;