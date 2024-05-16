const User = require('./schemas');
const {hashData, compareData} = require('../../utils/hashing');
const createToken = require('../../utils/create-token');

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

authenticateUser = async (email, password) => {
    try {

        const user = await User.findOne({ email: email});
        if (!user) {
            throw new Error("Email not found in the system");
        }

        const hashedPassword = user.password;
        const passwordMatch = await compareData(hashedPassword, password);
        if (!passwordMatch)
        {
            throw new Error("Invalid email or password");
        }
        // create a new token for the user
        const tokenData = {userId: user._id , email};
        const token = await createToken(tokenData);
        user.token = token;
        return user;
    }
    catch (err) {
        throw(err);
    }

}

const createNewTrade = async (currentUser, tradeData) => { 
    try {
        // Create a new trade object
        const newTrade = {
            symbol: tradeData.symbol,
            transactionType: tradeData.transactionType,
            quantity: tradeData.quantity,
            price: tradeData.price,
            timestamp: tradeData.timestamp || Date.now(), // Use provided timestamp or current time
            reasonForTransaction: tradeData.reasonForTransaction
        };

        // Push the new trade object into the trades array of the current user
        currentUser.trades.push(newTrade);

        // Save the updated user object
        await currentUser.save();

        return newTrade; // Return the newly created trade
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};


module.exports = {createNewTrade, createNewUser, authenticateUser };