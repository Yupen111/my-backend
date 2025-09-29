const Contact = require("../models/Contact");

// Submit contact form
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({ name, email, subject, message });

        res.status(201).json({
            message: "Contact message submitted successfully",
            contact
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all messages (admin only)
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
