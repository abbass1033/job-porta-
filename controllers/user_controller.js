const UserModel = require('../models/auth_model');
const UserController = {

     updateUserController: async(req, res , next)=>{
        const {name , lastName , email , location} = req.body;
    
         if (!name || !email || !lastName || !location) {
         return res.json({success : false , message : "Please provide all the fields!"})
  }

        const user = await UserModel.findOne({_id : req.user.userId}).select('+password');
        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.location = location;
        user.password = undefined;

        await user.save();
        res.status(401).send({success : true , message : user});
    
    }
};

module.exports = UserController;