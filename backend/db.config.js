import { MongoClient } from 'mongodb';

const url = "mongodb://127.0.0.1:27017/notes-app";
let client;



export const connectToMongodb = async () => {
    try {
        // Create a new MongoClient instance without deprecated options
        client = new MongoClient(url);
        await client.connect(); // Connect to the MongoDB server
        console.log("Connected to MongoDB successfully");
        return client;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Rethrow the error for further handling
    }
};

export const getdb = () => {
    if (!client) {
        throw new Error("Database not initialized - call connectToMongodb first");
    }
    return client.db(); // Return the database instance //in this my db is reaact-app
};

export const closeConnection = async () => {
    if (client) {
        await client.close(); // Close the MongoDB connection
        console.log("MongoDB connection closed");
        client = null; // Reset the client to null after closing
    }
};

