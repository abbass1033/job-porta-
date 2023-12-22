const UserModel = require("../models/auth_model");
const authModel = require("../models/auth_model");
const bcrypt = require('bcrypt');
const AuthController = {
    register : async function(req , res){
        try{
            const userData = req.body;
            const username = userData.name;
            const email = userData.email;
            const password = userData.password;
            if(!username){
                  return res.status(401).send({success : false , message : "User name is required"});
            }
            if(!email){
                return res.status(401).send({success : false , message : "Email name is required"});
            }
             if(!password){
                return res.status(401).send({success : false , message : "Password name is required"});
            }
            const existingUser = await UserModel.findOne({"email" : email});

            if(existingUser){
                 return res.status(401).send({success : false , message : "User already exists!"});
            }
            const newUser = new UserModel(userData);
            
            const token = newUser.createJWT();

            await newUser.save();
            
            return res.json({ success: true, data: newUser, message: "User created!", token : token } );

        }
        catch(ex){
            return res.status(401).send({success : false , message : ex});
        }
    },

     signIn: async function(req, res){
        try{

            const {email , password} = req.body;
            console.log(req.body);
            const foundUser = await UserModel.findOne({email : email}).select('+password');
            if(!foundUser){
                return res.json({success : false , message : "User not found!"});
            }
            const passwordsMatch = bcrypt.compareSync(password , foundUser.password);

            if(!passwordsMatch){
                return res.json({success : false , message : "Incorrect Password!"});
            }

            foundUser.password = undefined;
             const token = foundUser.createJWT();
            return res.json({success : true , data : foundUser , token : token});

        }
        catch(ex){
            return res.json({success : false , message : ex});
        }
    }
}

module.exports = AuthController;