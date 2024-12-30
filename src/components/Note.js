import {MdDeleteForever} from 'react-icons/md';
import { FaCircle } from "react-icons/fa";

 
const Note=({id,notes,date,deleteIt,greenit,redit,backgroundColour})=>{
    return(
        
        <div className="note">
            <span>{notes}</span>
            <div className="note-footer">
             <span>{date}</span>
             <FaCircle className='green' onClick={redit} />
             <FaCircle className='red' onClick={greenit}/>
             <MdDeleteForever className='delete-icon ' size='1.3em'
             onClick={()=>deleteIt(id)}
             />
            
             
            </div>
        </div> 

    )
}

export default Note;