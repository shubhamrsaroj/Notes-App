import {MdDeleteForever} from 'react-icons/md';
import { FaCircle } from "react-icons/fa";
import { FcBookmark } from "react-icons/fc";
import { useState } from 'react';
 
const Note=({id,notes,date,deleteIt})=>{

    
    const[backgroundColor,setBackgroundColor]=useState("");


    const greenit=()=>{
        setBackgroundColor("lightgreen");
    }

    const redit=()=>{
        setBackgroundColor("lightcoral");
    }

    const yellowit=()=>{
        setBackgroundColor("gold");
    }


    const blueit=()=>{
        setBackgroundColor("lightblue");
    }


    


    

    return(
        
        <div className="note" style={{backgroundColor}}>
            <span>{notes}</span>
            <div className="note-footer">
             <span>{date}</span>
             
             < FcBookmark size="1.1em"/>
             <FaCircle className='green' onClick={greenit} />
             <FaCircle className='red' onClick={redit}/>
             <FaCircle className='yellow' onClick={yellowit}/>
             <FaCircle className='blue' onClick={blueit}/>
             <MdDeleteForever className='delete-icon ' size='1.3em'
             onClick={()=>deleteIt(id)}
             />
             
            
            
            </div>
        
           
           
        </div> 

    )
}

export default Note;