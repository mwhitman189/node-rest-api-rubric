const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../models/product')

router.get('/', (req, res, next) => {
    res.status(200).json({
        msg: "Handling GET requests to /products"
    })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    })
    product.save().then(result => {
        res.status(201).json({
            msg: "Handling POST requests to /products",
            product: result
        })
    }).catch(err => console.log(err))
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    res.status(200).json({
        msg: `Product with id of "${id}" is available!`,
        id: id
    })
    Product.findById(id).exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
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