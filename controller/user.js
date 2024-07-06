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


const handleGetSuggestionsUser = async (req, res) => {
    
    try {
        const { uid } = req.params;

        // Fetch the current user to get their following list
        const currentUser = await UserModel.findById(uid).select('following');
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find users that are not in the current user's following list and not the user themselves
        const suggestions = await UserModel.find({ 
            _id: { $ne: uid, $nin: currentUser.following } 
        }).select('fullName username profileImage ').limit(5);

        res.status(200).json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    
}


const handlePostFollowUser = async (req, res) => {

    const {userId, followUserId} = req.body;
    console.log(req.body);
    try{
        const user = await UserModel.findById(userId);
        const followUser = await UserModel.findById(followUserId);
        if (!user || !followUser){
            return res.status(400).json({message: "user does not exist"});
        }

        if (user.following.includes(followUserId)){
            return res.status(400).json({message: "user already followed"});
        }

        await UserModel.findByIdAndUpdate(userId, { $push: { following: followUserId } });
        await UserModel.findByIdAndUpdate(followUserId, { $push: { followers: userId } });

        res.status(200).json({message: "user followed"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const handleGetSendUserForNotes = async (req, res) => {
    const {uid} = req.params;
    try{
        const user = await UserModel.findById(uid).select("following");
        if (!user){
            return res.status(400).json({message: "user does not exist"});
        }
        const following = user.following;
        const users = await UserModel.find({_id: {$in: following}}).select("fullName username profileImage");
        console.log(users);
        res.status(200).json(users);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }

};


const handleGetSearchUser = async (req, res) => {
    const {term} = req.query;
    try{
        const users = await UserModel.find({fullName: {$regex: term, $options: 'i'}}).select("fullName username profileImage");
        res.status(200).json(users);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
};

const handleGetSomeUser = async (req, res) => {
    const { uid } = req.params;

    // Fetch the current user to get their following list
    const currentUser = await UserModel.findById(uid).select('following');
    if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Find users that are not in the current user's following list and not the user themselves
    const suggestions = await UserModel.find({ 
        _id: { $ne: uid, $nin: currentUser.following } 
    }).select('fullName username profileImage ').limit(15);

    res.status(200).json(suggestions)
}



module.exports = { handleRegisterUser, handleLoginUser, handleGetProfile , handleGetSuggestionsUser, handlePostFollowUser, handleGetSendUserForNotes, 
    handleGetSearchUser,
    handleGetSomeUser
}