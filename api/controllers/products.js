const mongoose = require('mongoose')
const Product = require('../models/product')

const PRODUCTS_URL = 'http://localhost:3000/products/'


exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(({ _id, name, price, productImage }) => {
                    return {
                        _id: _id,
                        name: name,
                        price: price,
                        productImage: productImage,
                        request: {
                            type: 'GET',
                            url: `${PRODUCTS_URL}${_id}`
                        }
                    }
                })
            }
            return res.status(200).json(response)
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.products_create = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        user: req.userData.userId
    })
    if (req.file !== undefined) {
        product.productImage = req.file.path
    }
    product.save()
        .then(({ _id, name, price }) => {
            return res.status(201).json({
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
            return res.status(500).json({ error: err })
        })
}

exports.products_get_one = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        desc: "GET_ALL_PRODUCTS",
                        url: PRODUCTS_URL
                    }
                })
            } else {
                return res.status(404).json({ msg: `No valid entry was found for ID '${id}'` })
            }
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
}

exports.products_edit = (req, res, next) => {
    const props = req.body
    const userId = req.userData.userId
    const id = req.params.productId
    // Check if the product with the same user exists
    // Use 'find()' with 'limit()' rather than 'findOne' because 'findOne' returns the doc,
    // slowing query. Find doesn't
    if (Product.find({ _id: id, user: userId }).limit(1)) {
        Product.update({ _id: id }, props)
            .select('-__v')
            .exec()
            .then(doc => {
                return res.status(200).json({
                    msg: "Product updated",
                    request: {
                        type: 'GET',
                        url: `${PRODUCTS_URL}${id}`
                    }
                })
            }).catch(err => {
                return res.status(500).json({ error: err })
            })
    } else {
        res.status(403).json({
            message: "You are not authorized to edit this product"
        })
    }
}

exports.products_delete = (req, res, next) => {
    const userId = req.userData.userId
    const id = req.params.productId
    // Check if the product with the same user exists
    // Use 'find()' with 'limit()' rather than 'findOne' because 'findOne' returns the doc,
    // slowing query. Find doesn't
    Product.exists({ _id: id, user: userId }, (err, result) => {
        if (err) {
            res.status(500).json({
                error: err
            })
        } else if (result) {
            Product.findByIdAndDelete(id)
                .exec()
                .then(result => {
                    return res.status(200).json({
                        msg: "Deletion successful",
                        url: PRODUCTS_URL
                    })
                }).catch(err => {
                    return res.status(500).json({ error: err })
                })
        } else {
            res.status(401).json({
                message: "You do not have permission to delete that item"
            })
        }
    })
}