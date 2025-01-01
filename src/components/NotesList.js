import Note from "./Note";
import AddNote from "./AddNote";
import { FaCircle } from "react-icons/fa";

const NotesList=({notes,handleAddNote,deleteIt,greenit,redit,blueit,yellowit,backgroundColor})=>{
    return(
        
        <div className="notes-list">
            
          {

              notes.map((note)=>(
                <Note id={note.id} notes={note.text} date={note.date} deleteIt={deleteIt}
                greenit={greenit}
                redit={redit}
                blueit={blueit}
                yellowit={yellowit}
                backgroundColor={backgroundColor}  
                  
                 
                />
                
                
              ))
              
          }  

            
          <AddNote handleAddNote={handleAddNote} />
            
        </div> 

        

    )
}

export default NotesList;