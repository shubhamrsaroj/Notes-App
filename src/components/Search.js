import { useState } from "react";
import { MdSearch } from "react-icons/md"

const Search=({handleSearch})=>{

    

     return (
     <div className="search">

        <MdSearch className="search-icons" size="2.2em"/>
        <input  className="inputit"type="text" 
         
         onChange={(event)=>handleSearch(event.target.value)}
           
        placeholder="Type to Search "/>
    
    </div>
     );
};

export default Search;