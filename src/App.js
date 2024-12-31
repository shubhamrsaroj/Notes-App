import { useEffect, useState } from "react";
import NotesList from "./components/NotesList";
import { nanoid } from 'nanoid';
import Search from "./components/Search";
import Header from "./components/Header";

const App = () => {
    const [notes, setNotes] = useState(() => {
       
        const savedNotes = JSON.parse(localStorage.getItem('react-notes-app-data')) || [
            {
                id: nanoid(),
                text: "hello brother",
                date: "12/5/34"
            },
            {
                id: nanoid(),
                text: "hello jiju",
                date: "12/5/34"
            },
            {
                id: nanoid(),
                text: "hello saala",
                date: "12/5/34"
            }
        ];
        return savedNotes;
    });

    const [search, setSearch] = useState("");

    const deleteit = (id) => {
        const newnotes = notes.filter((note) => note.id !== id);
        setNotes(newnotes);
    }

    useEffect(() => {
        localStorage.setItem('react-notes-app-data', JSON.stringify(notes));
    }, [notes]);




    const addNote = (text) => {
        const date = new Date();
        const newnote = {
            id: nanoid(),
            text: text,
            date: date.toLocaleDateString(),
        }
        const mynewnote = [...notes, newnote];
        setNotes(mynewnote);
    }

    return (
        <div className="container">
            <Header />
            <Search handleSearch={setSearch} />
            <NotesList
                notes={notes.filter((note) => note.text.toLowerCase().includes(search))}
                handleAddNote={addNote}
                deleteIt={deleteit}
            />
        </div>
    )
}

export default App;



