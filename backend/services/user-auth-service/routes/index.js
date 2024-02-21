const express = require('express');
const router = express.Router();

const userRoutes = require('../domain/user');
router.use("/user",userRoutes);
module.exports = router;