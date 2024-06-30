const UserModel = require("../model/UserModel");


const generateUsername = async (name) => {
    const baseUsername = name.toLowerCase().replace(/\s/g, '');  

    let username = baseUsername;
    let counter =1;

    // Check for uniqueness and append a counter if necessary
    while (await UserModel.findOne({username})){
        username = `${baseUsername}${counter}`;
        counter++;
    }

    return username;

};

module.exports = generateUsername;