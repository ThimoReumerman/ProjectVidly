const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    //Get token
    const token = req.header('token');

    //Check if token exists
    if(!token) return res.status(401).send('Access denied. No token provided.');

    //Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        console.log('decoded', decoded);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.')
    }
}

module.exports = auth;