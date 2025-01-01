import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectToMongodb, getdb } from './db.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectToMongodb()
    .then(() => {
        const db = getdb();
        
        // API Routes
        app.post('/api/signup', async (req, res) => {
            try {
                const { username, email, password } = req.body;

                // Check if user already exists
                const existingUser = await db.collection('users').findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Create new user
                const result = await db.collection('users').insertOne({
                    username,
                    email,
                    password: hashedPassword,
                    createdAt: new Date()
                });

                // Create JWT token
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

                // Find user
                const user = await db.collection('users').findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Check password
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Create JWT token
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

        // Serve static files from the React app
        // Note the path change here - going up one directory to reach frontend/build
        app.use(express.static(join(__dirname, '../frontend/build')));

        // The "catchall" handler
        app.get('*', (req, res) => {
            res.sendFile(join(__dirname, '../frontend/build/index.html'));
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
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