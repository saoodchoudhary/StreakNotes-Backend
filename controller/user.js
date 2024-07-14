const generateUsername = require("../helpers/generateUsername");

const bcrypt = require('bcryptjs');
const UserModel = require("../model/UserModel");
const jwt = require('jsonwebtoken');
const checkAchievements = require("../helpers/checkAchievments");
const StreakModel = require("../model/StreakModel");
const { sendOtpEmail } = require("../helpers/otpEmail");
const OtpVerifyModel = require("../model/OtpVerify");


const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  };


  const handleOtpSendtoUser = async (req, res) => {
    const {email} = req.body;
    console.log(req.body);
    try{
        const user = await UserModel.findOne({email: email});
        if (user){
            return res.status(400).json({message: "email already exists"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        sendOtpEmail(email, otp);
        const newOtp = new OtpVerifyModel({email, otp});
        await newOtp.save();
        res.status(200).json({message: "otp sent"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

// Register a new user --
const handleOtpRegisterUser = async (req, res) => {
    const {fullName, email, password, otp} = req.body;
    console.log(req.body)

    const otpVerify = await OtpVerifyModel.findOne({email, otp});
    if (!otpVerify){
        return res.status(400).json({message: "otp is incorrect"});
    }


    try{
        const username = await generateUsername(fullName);
        console.log(username);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({fullName, username, email, password: hashedPassword});
        const token = generateToken(newUser);

        
        
        const saveUser =   await newUser.save();

        const newStreak = new StreakModel({userId: saveUser._id});
        await saveUser.streaks.push(newStreak._id);
        await saveUser.save();
        await newStreak.save();
        console.log(saveUser , token);


        res.status(201).json({ uid: saveUser._id, token });

    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const handleResendOtp = async (req, res) => {
    console.log(req.body);
    const { email } = req.body.data;
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        const alreadySavedOtp = await OtpVerifyModel.findOne({ email });
        sendOtpEmail(email, otp);
        if (alreadySavedOtp) {
            await OtpVerifyModel.findByIdAndUpdate(alreadySavedOtp._id, {
                otp: otp,
            });
        } else {
            await OtpVerifyModel.create({ email, otp: otp });
        }
        res.status(200).json({ mssg: "OTP sent successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
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
        const user = await UserModel.findById(uid).populate("streaks").populate("streaks");
        if (!user){
            return res.status(400).json({message: "user does not exist"});
        }

        res.status(200).json(user);
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
            // user unfollow
            await UserModel.findByIdAndUpdate(userId, { $pull: { following: followUserId } });
            await UserModel.findByIdAndUpdate(followUserId, { $pull: { followers: userId } });
            res.status(200).json({message: "user unfollowed"});
        }else{

      

        await UserModel.findByIdAndUpdate(userId, { $push: { following: followUserId } });
        await UserModel.findByIdAndUpdate(followUserId, { $push: { followers: userId } });

        res.status(200).json({message: "user followed"}); 
     }
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
        const users = await UserModel.find({username: {$regex: term, $options: 'i'}}).select("fullName username profileImage");
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

const handleGetFollowerFollowingUser = async (req, res) => {
    const {uid} = req.params;
    console.log(uid);
    try{
        const user = await UserModel.findById(uid).select("followers following");
        if (!user){
            return res.status(400).json({message: "user does not exist"});
        }
        const followers = user.followers;
        const following = user.following;
        const followersList = await UserModel.find({_id: {$in: followers}}).select("fullName username profileImage");
        const followingList = await UserModel.find({_id: {$in: following}}).select("fullName username profileImage");
        res.status(200).json({followers: followersList, following: followingList});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}


const handleGetAllUsers = async (req, res) => {
    try{
        const users = await UserModel.find().select("fullName username profileImage");
        res.status(200).json(users);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}



module.exports = {
    handleOtpSendtoUser,
     handleOtpRegisterUser,
     handleResendOtp,
     handleLoginUser,
      handleGetProfile ,
       handleGetSuggestionsUser,
        handlePostFollowUser,
         handleGetSendUserForNotes, 
    handleGetSearchUser,
    handleGetSomeUser,
    handleGetFollowerFollowingUser,
    handleGetAllUsers
}