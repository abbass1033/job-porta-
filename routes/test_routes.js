
const express = require('express');
const testPostController  = require('../controllers/test_controller');
const userAuth = require('../middlewar/auth_middleware');
//router object
const router = express.Router();

//routes
router.post("/test-post", userAuth, testPostController);

//export
module.exports = router;
