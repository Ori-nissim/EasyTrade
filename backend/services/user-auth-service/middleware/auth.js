const jwt = require('jsonwebtoken');
const { TOKEN_KEY } = process.env;
const verifyToken = async(req, res,next) => {
    
    // get the token
    const token = 
        req.body.token || 
        req.query.token ||
        req.headers["x-access-token"];

    // check if the token was provided
    if (!token) 
        return res.status(403).send("An authentication token was not provided");
    
    // verify
    try {
        const decodedToken = await jwt.verify(token, TOKEN_KEY);
        console.log("🚀 ~ verifyToken ~ decodedToken:", decodedToken)
        req.currentUser = decodedToken; // assign the decoded token to the request parameters
    } catch (error) {
        return res.status(401).send("Invalid token provided");
    }

    //proceed to the next
    return next();


};

module.exports = verifyToken;

