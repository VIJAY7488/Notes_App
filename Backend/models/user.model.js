import mongoose, { model } from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {type: String},
    email: {type: String},
    password: {type: String},
    createdOn: {type: Date, default: new Date().getTime()},
})

const user = mongoose.model('User', userSchema);
export default user;