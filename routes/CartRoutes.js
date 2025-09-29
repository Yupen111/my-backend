const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cartController");
const verifyToken = require("../middleware/verifyToken");

// Guest → use x-session-id
// Login → use Bearer Token
router.post("/",verifyToken,cartCtrl.addItem);
router.get("/", cartCtrl.getCart);
router.put("/:itemId", cartCtrl.updateItem);
router.delete("/:itemId", cartCtrl.removeItem);
router.delete("/", cartCtrl.clearCart);
//router.post("/multiple", cartCtrl.addItems); // new route



module.exports = router;        
