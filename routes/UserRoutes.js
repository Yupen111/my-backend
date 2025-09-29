const express = require("express");
const router = express.Router();
const Usercontroller = require("../controllers/Usercontroller");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", Usercontroller.register);
router.post("/login", Usercontroller.login);
router.get("/profile", verifyToken, Usercontroller.profile);
// 💡 CHANGE HERE: Temporary Admin creation route (testing only)
router.post("/create-admin", Usercontroller.createAdmin);  

module.exports = router;
