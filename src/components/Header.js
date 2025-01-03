import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
const Header=({change,vvalue,setValue,changeit,keydown})=>{

    const[toggle,setToggle]=useState("white");

    

    const toggleit=()=>{
       
        setToggle(toggle==="white"?"black":"white");

        document.body.style.backgroundColor=toggle==="white"?"black":"white";
        
    
    }



    return(
        <div className="header">
            <FaRegEdit size="1.1rem" className="myedit" onClick={changeit}/>
            { 
              
              change?     
             (<input type="text" value={vvalue}  className="myinput"  onKeyDown={keydown}  onChange={(e)=>setValue(e.target.value)}></input>
                           
            ):(<h1 className="headerStyle">{vvalue}</h1>
               
             
              )  }  
            <button className="toggleit" onClick={toggleit}>Toggle Mode</button>

        </div>
    )
}

export default Header;

