const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

mongoose.connect(
    `mongodb://mileswhitman01:${process.env.MONGO_ATLAS_PW}@cluster0-shard-00-00.ak81c.gcp.mongodb.net:27017,cluster0-shard-00-01.ak81c.gcp.mongodb.net:27017,cluster0-shard-00-02.ak81c.gcp.mongodb.net:27017/test?ssl=true&replicaSet=atlas-18uqmr-shard-0&authSource=admin&retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
// Use default node.js promises to prevent deprecation warning
mongoose.Promise = global.Promise

app.use(morgan('dev'))
// Make 'uploads' folder available publicly so images can be viewed via url
app.use('/uploads', express.static('uploads'))
// Allow for extraction of url encoded data
app.use(bodyParser.urlencoded({ extended: false }))
// Allow for extraction and parsing of json data
app.use(bodyParser.json())

// Handle CORS (Cross Origin Resource Sharing)
app.use((req, res, next) => {
    // Using Postman or Curl, etc., data can be accessed, so '*' is not much
    // less secure than a limited access schema
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    // Would block incoming request, so must call 'next()'
    next()
})

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)

// If above routes are not reached, catch all errors
app.use((req, res, next) => {
    const error = new Error("Not found")
    error.status = 404
    next(error)
})

// Handle above error or any other error thrown in application
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            msg: error.message
        }
    })
})

module.exports = app