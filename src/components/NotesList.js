import Note from "./Note";
import AddNote from "./AddNote";

const NotesList=({notes,handleAddNote,deleteIt})=>{
    return(
        
        <div className="notes-list">
            
          {

              notes.map((note)=>(
                <Note id={note.id} notes={note.text} date={note.date} deleteIt={deleteIt} />
              ))
              
          }  

            
          <AddNote handleAddNote={handleAddNote} />
            
        </div> 

    )
}

export default NotesList;