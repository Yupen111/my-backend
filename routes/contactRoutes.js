const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Public route: submit contact form
router.post("/", contactController.submitContact);

// Admin route: get all messages
router.get("/View", verifyToken,verifyAdmin,contactController.getContacts);

module.exports = router;
