const express = require('express');
const router = express.Router();
const {createNewUser, authenticateUser} = require('./controller');
const auth = require('../../middleware/auth');

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

        validateInput(name, email, password);
        console.log(name, email, password);
        data = { name, email, password}
        const newUser = await createNewUser(data);
        res.status(200).json(newUser);

    } catch (error) {
        res.status(400).send(error.message);
    }
});

const validateInput = (name, email, password) => {
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
        if (!user) 
            throw new Error("Error authenticating user");
        
        res.status(200).json(user);

    } catch (error) {
        res.send(error.message);
    }
});

module.exports = router;