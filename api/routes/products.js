const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')


// Create an uploads folder, and the define the destination and filename methods
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

// Create a filter for uploads, allowing only the specified file types(e.g. jpeg, png)
const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        // Reject a file
        cb(new Error({ message: "Unsupported file type" }), false)
    }

}

// Instantiate a multer instance for use in post router parameters
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const Product = require('../models/product')

const PRODUCTS_URL = 'http://localhost:3000/products/'

router.get('/', (req, res, next) => {
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
})

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
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
})

router.get('/:productId', (req, res, next) => {
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
})

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    const props = req.body
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
})

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
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
})

module.exports = router