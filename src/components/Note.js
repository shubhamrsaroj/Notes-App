import {MdDeleteForever} from 'react-icons/md';


 
const Note=({id,notes,date,deleteIt})=>{
    return(
        
        <div className="note">
            <span>{notes}</span>
            <div className="note-footer">
             <span>{date}</span>
             <MdDeleteForever className='delete-icon ' size='1.3em'
             onClick={()=>deleteIt(id)}
             />
             
            </div>
        </div> 

    )
}

export default Note;