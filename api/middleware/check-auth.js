const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        // Check for token in headers, then remove whitespace between 'Bearer' and token
        const token = req.headers.authorization.split(" ")[ 1 ]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized"
        })
    }
}