const express = require("express");
const { route } = require("./test_routes");
const UserController = require('../controllers/user_controller');
const userAuth  = require('../middlewar/auth_middleware');
const router = express.Router();

router.put('/update-user' , userAuth , UserController.updateUserController);


module.exports = router;