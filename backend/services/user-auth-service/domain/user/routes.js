const express = require('express');
const router = express.Router();
const createNewUser = require('./controller');

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
    else if (!/^[\w-\*]+@([\w-]+\.+[\w-]{2,4})$/.test(email))
        throw new Error("Invalid email");

    else if (password.length < 8) 
        throw new Error("Password is too short");

};

module.exports = router;