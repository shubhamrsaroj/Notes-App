import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectToMongodb, getdb } from './db.config.js';
import { ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

// Connect to MongoDB
connectToMongodb()
    .then(() => {
        const db = getdb();
        
        // Existing authentication routes
        app.post('/api/signup', async (req, res) => {
            try {
                const { username, email, password } = req.body;

                const existingUser = await db.collection('users').findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const result = await db.collection('users').insertOne({
                    username,
                    email,
                    password: hashedPassword,
                    createdAt: new Date()
                });

                const token = jwt.sign(
                    { userId: result.insertedId, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.status(201).json({
                    message: 'User created successfully',
                    token,
                    username
                });
            } catch (error) {
                console.error('Signup error:', error);
                res.status(500).json({ message: 'Error creating user' });
            }
        });

        app.post('/api/login', async (req, res) => {
            try {
                const { email, password } = req.body;

                const user = await db.collection('users').findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { userId: user._id, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'Login successful',
                    token,
                    username: user.username
                });
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ message: 'Error logging in' });
            }
        });

        // New Notes API endpoints
        // Get all notes for a user
        app.get('/api/notes', authenticateToken, async (req, res) => {
            try {
                const notes = await db.collection('notes')
                    .find({ userId: new ObjectId(req.user.userId) })
                    .toArray();
                res.json(notes);
            } catch (error) {
                console.error('Error fetching notes:', error);
                res.status(500).json({ message: 'Error fetching notes' });
            }
        });

        // Create a new note
        app.post('/api/notes', authenticateToken, async (req, res) => {
            try {
                const { text, date } = req.body;
                const result = await db.collection('notes').insertOne({
                    userId: new ObjectId(req.user.userId),
                    text,
                    date,
                    createdAt: new Date()
                });

                const newNote = await db.collection('notes').findOne({
                    _id: result.insertedId
                });

                res.status(201).json(newNote);
            } catch (error) {
                console.error('Error creating note:', error);
                res.status(500).json({ message: 'Error creating note' });
            }
        });

        // Delete a note
        app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
            try {
                const result = await db.collection('notes').deleteOne({
                    _id: new ObjectId(req.params.id),
                    userId: new ObjectId(req.user.userId)
                });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Note not found or unauthorized' });
                }

                res.json({ message: 'Note deleted successfully' });
            } catch (error) {
                console.error('Error deleting note:', error);
                res.status(500).json({ message: 'Error deleting note' });
            }
        });

        // Update a note
        app.put('/api/notes/:id', authenticateToken, async (req, res) => {
            try {
                const { text } = req.body;
                const result = await db.collection('notes').updateOne(
                    {
                        _id: new ObjectId(req.params.id),
                        userId: new ObjectId(req.user.userId)
                    },
                    {
                        $set: {
                            text,
                            updatedAt: new Date()
                        }
                    }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'Note not found or unauthorized' });
                }

                const updatedNote = await db.collection('notes').findOne({
                    _id: new ObjectId(req.params.id)
                });

                res.json(updatedNote);
            } catch (error) {
                console.error('Error updating note:', error);
                res.status(500).json({ message: 'Error updating note' });
            }
        });

        // Serve static files from the React app
        app.use(express.static(join(__dirname, '../frontend/build')));
        app.use(express.static(join(__dirname, './file')));

        // The "catchall" handler
        app.get('*', (req, res) => {
            res.sendFile(join(__dirname, '../frontend/build/index.html'));
        });

        app.listen(3000, () => {
            console.log(`Server running on port 3000`);
        });
    })
    .catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});