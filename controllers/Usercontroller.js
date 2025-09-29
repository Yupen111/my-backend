const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, password} = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

         // 💡 CHANGE HERE: create user with default role "user"
         //💡 CHANGE HERE: create user with default role "user"
        const user = await User.create({ firstname, lastname, email, password, role: "user" });

        // 💡 CHANGE HERE: generate token with role
        const token = jwt.sign(
            { id: user._id, role: user.role },   // 👈 role added
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { firstname, lastname, email, role: user.role },   // 👈 role included
           // token   // 👈 return token
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

    //     // Create user
    //     const user = await User.create({ firstname, lastname, email, password });
    //     res.status(201).json({ message: "User registered successfully", user: { firstname, lastname, email } });
    // } catch (err) {
    //     res.status(500).json({ message: "Server error", error: err.message });
    // }


// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // // Optional: create token
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET , { expiresIn: "1h" });
        // 💡 CHANGE HERE: create token with role
        const token = jwt.sign(
            { id: user._id, role: user.role },   // 👈 role added
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Profile (protected)
exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// 💡 Temporary admin creation route (optional, for testing)
exports.createAdmin = async (req, res) => {
    try {
        const { firstname, lastname, email, password} = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        // 💡 CHANGE HERE: hash password for admin
        const hashed = await bcrypt.hash(password, 10);

        // 💡 CHANGE HERE: hard-coded role = "admin"
        const user = await User.create({
            firstname,
            lastname,
            email,
            password,
            role: "admin"
        });

        // 💡 CHANGE HERE: generate token with admin role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "Admin user created successfully",
            user: { firstname, lastname, email, role: user.role },
            
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
