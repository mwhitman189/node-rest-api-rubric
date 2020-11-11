const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY)
        req.userData = decoded
        // next() was attempting to set headers a second time. Calling res.end() fixes this
        return next()
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized"
        })
    }
}