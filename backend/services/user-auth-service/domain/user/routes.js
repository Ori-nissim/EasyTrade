const express = require('express');
const router = express.Router();
const {createNewTrade,createNewUser, authenticateUser} = require('./controller');
const auth = require('../../middleware/auth');
const User = require('./schemas');

// example route to check for the auth middleware
router.get('/getEmail', auth, async (req,res) => {
    res.status(200)
        .send(`Hello ${req.currentUser.email}`);
});

// sign up
router.post('/signup',  async (req, res) => {
    try {
        let { name, email, password} = req.body; // destructe request parameters
        
        // remove  spaces
        name = name.trim();
        email = email.trim();
        password = password.trim();

        validateSignUpInput(name, email, password);
        console.log(name, email, password);
        data = { name, email, password}

        const newUser = await createNewUser(data);

        res.status(200).json(newUser);

    } catch (error) {
        res.status(400).json(error.message);
    }
});

const validateSignUpInput = (name, email, password) => {
    // check that all fiels are not empty
    if (!(name&&email&&password))
        throw new Error("Input field missing");

    // validate user name contains only letters
    else if (!/^[a-zA-Z ]*$/.test(name))
        throw new Error("Invalid user name");

    // validate email format
    else if (!/^[a-zA-Z0-9._]+@([\w-]+\.+[\w-]{2,4})$/.test(email))
        throw new Error("Invalid email");

    else if (password.length < 8) 
        throw new Error("Password is too short");

};

// Login User

router.post('/login', async (req, res) => {
    try {
        let {email, password} = req.body;
        email = email.trim();
        password = password.trim();
        
        if (!(email && password))
            throw new Error("Empty email or password");

        user = await authenticateUser(email, password);
        console.log("🚀 ~ router.post ~ user:", user)
        if (!user) 
            throw new Error("Error authenticating user");
        
        res.status(200).json(user);
        
    } catch (error) {
        res.status(401).json(error.message);
    }
});


// Define route to get all users
router.get('/getAll', async (req, res) => {
    try {
        // Query the database to find all users
        const users = await User.find();

        // If users are found, return them as JSON response
        res.status(200).json(users);
    } catch (error) {
        // If an error occurs, return an error response
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add Trade to user
// add validation for input and check for errors
router.post('/addTrade', auth, async (req, res) => {
   
        let email = req.currentUser.email; // email comes from auth middleware, has to be valid
        console.log("🚀 ~ router.post ~ email:", email)
        let {symbol, transactionType, quantity,price, timestamp,reasonForTransaction} = req.body;
        let tradeData = {symbol, transactionType, quantity, price, timestamp,reasonForTransaction};
        // verify all fields are valid
        // TODO - handle missing fields in the front end
        
        // get current user
        const currentUser = await User.findOne({ email: email});
        if (!currentUser) {
            throw new Error("Email not found in the system");
        }

        // create new trade
        const newTrade = await createNewTrade(currentUser,tradeData);
        res.status(200).json(newTrade);

});
// get all trades by user
router.get('/getTrades', auth, async (req, res) => {
    const email = req.currentUser.email; // email comes from auth middleware, has to be valid

    // Get current user
    const currentUser = await User.findOne({ email: email });
    if (!currentUser) {
        throw new Error("Email not found in the system");
    }

    const trades = currentUser.trades;
    res.status(200).json(trades);
});


// Delete Trade from user
router.delete('/deleteTrade/:tradeId', auth, async (req, res) => {
    try {
        const email = req.currentUser.email; // email comes from auth middleware, has to be valid
        const tradeId = req.params.tradeId; // Extract tradeId from URL parameter

        // Get current user
        const currentUser = await User.findOne({ email: email });
        if (!currentUser) {
            throw new Error("Email not found in the system");
        }

        // Delete it
        currentUser.trades.id(tradeId).deleteOne();

        // Save the updated user object
        await currentUser.save();

        res.status(200).json({ message: "Trade deleted successfully" });
    } catch (error) {
        console.error('Error deleting trade:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;