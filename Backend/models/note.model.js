import mongoose from 'mongoose';


const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags:{type: [String], default: []},
    createdOn:{type: Date, default: new Date().getTime()},
    isPinned:{type: Boolean, default: false},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
})

const note = mongoose.model('Note', noteSchema);
export default note;