// App.js
import { useEffect, useState } from "react";
import axios from 'axios';
import NotesList from "./components/NotesList";
import Search from "./components/Search";
import Header from "./components/Header";
import Auth from "./components/Auth";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [backgroundColor, setBackgroundColor] = useState("");

    // Fetch notes when component mounts and authentication changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotes();
        }
    }, [isAuthenticated]);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/notes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const addNote = async (text) => {
        try {
            const token = localStorage.getItem('token');
            const date = new Date().toLocaleDateString();
            
            const response = await axios.post('http://localhost:3000/api/notes', 
                { text, date },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            setNotes([...notes, response.data]);
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    const deleteit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setNotes([]);
    };

    // Color management functions
    const greenit = () => setBackgroundColor("lightgreen");
    const redit = () => setBackgroundColor("lightcoral");
    const yellowit = () => setBackgroundColor("gold");
    const blueit = () => setBackgroundColor("lightblue");

    const [change, setChange] = useState(false);
    const [vvalue, setValue] = useState("My Notes");

    const changeit = () => setChange(true);

    const keydown = (event) => {
        if (event.key === "Enter") {
            setChange(false);
        }
    };

    if (!isAuthenticated) {
        return <Auth setIsAuthenticated={setIsAuthenticated} />;
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <Header 
                        change={change} 
                        vvalue={vvalue} 
                        setValue={setValue} 
                        changeit={changeit} 
                        keydown={keydown} 
                    />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h5">
                            Welcome, {localStorage.getItem('username')}!
                        </span>
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
};

export default App;