const generateUsername = require("../helpers/generateUsername");

const bcrypt = require('bcryptjs');
const UserModel = require("../model/UserModel");


// Register a new user --
const handleRegisterUser = async (req, res) => {
    const {fullName, email, password} = req.body;
    console.log(req.body)

    try{
        const username = await generateUsername(fullName);
        console.log(username);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({fullName, username, email, password: hashedPassword});

        await newUser.save();
        res.status(201).json({message: "User created successfully"});

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Login a user --
const handleLoginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await UserModel.findOne({email});
        if (!user){
            return res.status(400).json({message: "email does not exist"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({message: "password is incorrect"});
        }

        res.status(200).json({message: "Login successful"});

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }

}

module.exports = { handleRegisterUser, handleLoginUser }