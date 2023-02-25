
const router = require("express").Router();
const {signup, getbill } = require("../controller/appCon");

  


router.post("/signup", signup);
router.post("/getbill", getbill);




module.exports = router;