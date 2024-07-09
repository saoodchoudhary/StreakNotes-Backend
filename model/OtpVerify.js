const mongoose = require('mongoose');

const OtpVerifySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
    },
},{timestamps: true});

const OtpVerifyModel = mongoose.model('otpVerify', OtpVerifySchema);


module.exports = OtpVerifyModel;