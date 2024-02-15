const User = require('./schemas');
const hashData = require('../../hashData');

const createNewUser = async (data) => { 
    try {
        const {name, email, password} = data;
        const existingUser = await User.findOne({email});
        console.log("🚀 ~ createNewUser ~ existingUser:", existingUser)

        if (existingUser) 
            throw new Error(`${email} already exists in the system`);

        // hash password
        const hashedPassword = await hashData(password);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
         });

        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};

module.exports = createNewUser;