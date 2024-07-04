const generateUsername = require("../helpers/generateUsername");

const bcrypt = require('bcryptjs');
const UserModel = require("../model/UserModel");
const jwt = require('jsonwebtoken');
const checkAchievements = require("../helpers/checkAchievments");


const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  };

// Register a new user --
const handleRegisterUser = async (req, res) => {
    const {fullName, email, password} = req.body;
    console.log(req.body)

    try{
        const username = await generateUsername(fullName);
        console.log(username);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({fullName, username, email, password: hashedPassword});
        const token = generateToken(newUser);

        await newUser.save();
        res.status(201).json({ uid: newUser._id, token });

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

        const token = generateToken(user);
        res.status(201).json({ uid: user._id, token });

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }


}

const handleGetProfile = async (req, res) => {
    const {uid} = req.params;
    
    // checkAchievements(uid);
    

    try{
        const user = await UserModel.findById(uid);
        if (!user){
            return res.status(400).json({message: "user does not exist"});
        }

        res.status(200).json( {fullName: user.fullName, email: user.email, username: user.username, followers: user.followers.length, following: user.following.length , streaks: user.streaks.length, score: user.score, profileType: user.profileType, profileImage: user.profileImage, profileBannerImage: user.profileBannerImage, totalNotes: user.totalNotes, createdAt: user.createdAt, updatedAt: user.updatedAt});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }

}
module.exports = { handleRegisterUser, handleLoginUser, handleGetProfile }