const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true, // Ensure username is unique
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
    },
    userIP: {
        type: String,
        unique: true, // Ensure userIP is unique
    },
});

// Add unique index for userIP
userSchema.index({userIP: 1}, {unique: true});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to check if the provided password matches the stored password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
