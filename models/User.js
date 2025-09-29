const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname:  { type: String, required: true },
    email:     { type: String, required: true, unique: true,lowercase: true,match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]},
    password:  { type: String, required: true, minlength: 6 },
    // 👇 ADD THIS
  role: { type: String, enum: ["user", "admin"], default: "user" },

    
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("User", userSchema);
