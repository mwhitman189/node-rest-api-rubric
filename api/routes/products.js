const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Product = require('../models/product')

const PRODUCTS_URL = 'http://localhost:3000/products/'

router.get('/', (req, res, next) => {
    Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(({ _id, name, price }) => {
                    return {
                        _id: _id,
                        name: name,
                        price: price,
                        request: {
                            type: 'GET',
                            url: `${PRODUCTS_URL}${_id}`
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(({ _id, name, price }) => {
            res.status(201).json({
                msg: "Product successfully added",
                product: {
                    _id: _id,
                    name: name,
                    price: price
                },
                request: {
                    type: 'GET',
                    url: `${PRODUCTS_URL}${_id}`
                }
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        desc: "GET_ALL_PRODUCTS",
                        url: PRODUCTS_URL
                    }
                })
            } else {
                res.status(404).json({ msg: `No valid entry was found for ID '${id}'` })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const props = req.body
    Product.update({ _id: id }, props)
        .select('-__v')
        .exec()
        .then(doc => {
            res.status(200).json({
                msg: "Product updated",
                request: {
                    type: 'GET',
                    url: `${PRODUCTS_URL}${id}`
                }
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findByIdAndDelete(id)
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "Deletion successful",
                url: PRODUCTS_URL
            })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
})

module.exports = router