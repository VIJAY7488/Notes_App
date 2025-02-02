import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import mongoose from 'mongoose';
import authenticateToken from './utilities.js';
import User from './models/user.model.js';
import Note from './models/note.model.js';
import bcrypt from 'bcrypt';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const PORT = process.env.PORT || 4000;
const app = express();


mongoose.connect(config.connectionString)
.then(() => console.log("MongoDb connected successfully"))
.catch((err) => console.log('Error in MongoDb connection ' + err))

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

//create Account
app.post('/create-account', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName) return res.status(400).json({ Error: true, msg: "Full Name is required" });
        if (!email) return res.status(400).json({ Error: true, msg: "Email is required" });
        if (!password) return res.status(400).json({ Error: true, msg: "Password is required" });

        const isUser = await User.findOne({ email });

        if (isUser) return res.status(400).json({ Error: true, msg: "Email already registered." });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT Token with only necessary data
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({ success: true, msg: "Account created successfully", accessToken });

    } catch (error) {
        console.error("Error creating account:", error);
        return res.status(500).json({ success: false, msg: "Internal server error" });
    }
});

//Login
app.post('/login', async(req, res) => {
    const {email, password} = req.body;

    if(!email) return res.status(401).json({Error: true, msg: "Email is required"});

    if(!password) return res.status(401).json({Error: true, msg: "Password is required"});
     
    const userInfo = await User.findOne({email});

    if(!userInfo) return res.status(400).json({msg: "User not found."});

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, userInfo.password);

    if(!isMatch){
        return res.status(401).json({ Error: true, msg: "Invalid credentials." });
    }
    const accessToken = jwt.sign(
        { _id: userInfo._id, email: userInfo.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    return res.status(201).json({ success: true, msg: "Login successfully", email, accessToken });
});

//Get User
app.get('/get-user', authenticateToken, async(req, res) => {
    try {
        const userId = req.user._id;
        const user = req.user;

        const isUser = await User.findOne({ _id: userId });

        if(!isUser){
            return res.status(400).json({msg: 'User not Found'});
        } 


        return res.status(201).json({ success: true, user:{
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
            user
        }});
 

    } catch (error) {
        console.error("Get User", error);
        return res.status(500).json({ success: false, msg: "Internal server issue" });
    }
})


//Note
app.post('/add-note', authenticateToken, async(req, res) => {
    const {title, content, tags = []} = req.body;
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({ Error: true, msg: "User ID is missing." });
    }

    if(!title) return res.status(400).json({Error: true, msg: "Title is required."});

    if(!content) return res.status(400).json({Error: true, msg: "Content is required."});

    
    const validatedTags = Array.isArray(tags) ? tags.map(tag => String(tag)) : [];
    try {
        const note = new Note({
            title,
            content,
            tags: validatedTags,
            userId,
        });

        await note.save();

        return res.status(201).json({ success: true, msg: "Note Added Successfully", note});

    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(402).json({ success: false, msg: "Internal server issue"});
    }
});


//Edit note
app.put('/edit-note/:noteId', authenticateToken, async(req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const userId = req.user._id;


    if(!title && !content && !tags) return res.status(400).json({Error: true, msg: "No changes provided."});

    try {
        const note = await Note.findOne({_id: noteId, userId});

        if(!note) return res.status(400).json({Error: true, msg: "Note not found."});

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.status(201).json({ success: true, msg: "Note Updated Successfully.", note});
    } catch (error) {
        console.error("Error Editing note: ", error);
        return res.status(402).json({ success: false, msg: "Internal server issue"});
    }


    
});


//Get all notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const notes = await Note.find({ userId }).sort({ isPinned: -1 });

        res.status(200).json({ Error: false, notes, msg: "Notes retrieved successfully." });
    } catch (error) {
        console.error("Error in retrieving notes:", error);
        res.status(500).json({ success: false, msg: "Internal server issue" });
    }
});



//Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const noteId = req.params.noteId;

        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({ Error: true, msg: 'Note not found.' });
        }

        await Note.deleteOne({ _id: noteId, userId });

        res.status(201).json({ Error: false, note, msg: "Note deleted successfully." });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ success: false, msg: "Internal server issue" });
    }
});



//Update isPinned value
app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.user._id;
        const { isPinned } = req.body;

        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({ Error: true, msg: 'Note not found.' });
        }

        note.isPinned = isPinned ?? false; 

        await note.save();

        return res.status(201).json({ success: true, msg: "Note Updated Successfully.", note });
    } catch (error) {
        console.error("Error Editing note:", error);
        return res.status(500).json({ success: false, msg: "Internal server issue" });
    }
});


//Search Notes
app.get('/search-notes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id; 
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: true, msg: 'Search query is required' });
        }

        const matchingNotes = await Note.find({
            userId: userId,
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { content: { $regex: new RegExp(query, 'i') } }
            ]
        });

        return res.status(200).json({ success: true, msg: "Notes retrieved successfully.", notes: matchingNotes });

    } catch (error) {
        console.error("Error in search-notes:", error);
        return res.status(500).json({ error: true, msg: "Internal server error" });
    }
});




app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});