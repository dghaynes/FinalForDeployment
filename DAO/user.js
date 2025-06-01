const bcrypt = require('bcrypt');
const user = require('../models/user');

module.exports = {};

module.exports.createUser = async (email, password) => {

   // console.log('In DAO: user and password', email, password);


    const hashedPassword = await bcrypt.hash(password, 10);

    return await user.create( {email, password: hashedPassword});
};

module.exports.login = async (email, password) => {

    //console.log('user and password in DAO', email, password);

    try {
        const userRecord = await user.findOne({email});

        if (!userRecord) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, userRecord.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        return userRecord;
    } catch (err){
        throw new Error('Error logging in: ' + err.message)
    }
};




