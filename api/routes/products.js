const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')

const checkAuth = require('../middleware/check-auth')

const ProductsController = require('../controllers/products')

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

router.get('/', ProductsController.products_get_all)

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create)

router.get('/:productId', ProductsController.products_get_one)

router.patch('/:productId', checkAuth, ProductsController.products_edit)

router.delete('/:productId', checkAuth, ProductsController.products_delete)

module.exports = router