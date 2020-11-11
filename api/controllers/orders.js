const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

const ORDERS_URL = 'http://localhost:3000/orders/'

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: ORDERS_URL + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            console.log(product)
            if (!product) {
                return res.status(404).json({
                    msg: "Product was not found",

                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            console.log(order)
            order.save()
                .then(result => {
                    res.status(201).json({
                        msg: "Order stored",
                        request: {
                            type: 'GET',
                            createdOrder: {
                                _id: result._id,
                                product: result.product,
                                quantity: result.quantity
                            },
                            url: ORDERS_URL + result._id
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        })
}

exports.orders_get_one = (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    msg: "Order was not found"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: ORDERS_URL
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
}

exports.orders_delete = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                msg: "Order was successfully deleted",
                request: {
                    type: 'GET',
                    url: ORDERS_URL,
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}