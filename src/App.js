import { useEffect, useState } from "react";
import NotesList from "./components/NotesList";
import { nanoid } from 'nanoid';
import Search from "./components/Search";
import Header from "./components/Header";
import Auth from "./components/Auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

  
const [notes, setNotes] = useState(() => {
    try {
        const savedNotes = localStorage.getItem('react-notes-app');
        const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [
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
        return Array.isArray(parsedNotes) ? parsedNotes : [];
    } catch (error) {
        console.error("Error loading notes:", error);
        return [];
    }
});
    

    // UI states
    const [search, setSearch] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('react-notes-app', JSON.stringify(notes));
        } catch (error) {
            console.error("Error saving notes:", error);
        }
    }, [notes]);

    // Note management functions
    const addNote = (text) => {
        const date = new Date();
        const newNote = {
            id: nanoid(),
            text: text,
            date: date.toLocaleDateString(),
        }
        setNotes(prevNotes => [...prevNotes, newNote]);
    }

    const deleteit = (id) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }

    // Color management functions
    const greenit = () => setBackgroundColor("lightgreen");
    const redit = () => setBackgroundColor("lightcoral");
    const yellowit = () => setBackgroundColor("gold");
    const blueit = () => setBackgroundColor("lightblue");

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    // State for editing notes
    const [change, setChange] = useState(false);
    const [vvalue, setValue] = useState("Shubham's note");

    const changeit = () => setChange(true);

    const keydown = (event) => {
        if (event.key === "Enter") {
            setChange(false);
        }
    };

    // Render the Auth component if not authenticated
    if (!isAuthenticated) {
        return <Auth setIsAuthenticated={setIsAuthenticated} />;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                <Header change={change} vvalue={vvalue} setValue={setValue} changeit={changeit} keydown={keydown} />
                    <div className="d-flex justify-content-end mb-3">
                        <button 
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                    <Search handleSearch={setSearch} />
                    <NotesList
                        notes={notes.filter(note => 
                            note.text.toLowerCase().includes(search.toLowerCase())
                        )}
                        handleAddNote={addNote}
                        deleteIt={deleteit}
                        greenit={greenit}
                        redit={redit}
                        blueit={blueit}
                        yellowit={yellowit}
                        backgroundColor={backgroundColor}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;