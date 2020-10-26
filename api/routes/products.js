const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: "Handling GET requests to /products"
    })
})

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        msg: "Handling POST requests to /products",
        product: product
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        msg: `Product with id of "${id}" is available!`,
        id: id
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        msg: "Update successful!"
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        msg: "Delete successful!"
    })
})

module.exports = router