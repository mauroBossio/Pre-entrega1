const { Router } = require('express')
const ProductRouter = require('./api/products.router')
const UsersRouter = require('./api/usuarios.router')
const CartRouter = require('./api/carts.router')
const HomeRouter = require('./home.router')

const router = Router()

router.use('/products', ProductRouter)

router.use('/users', UsersRouter)

router.use('/carts', CartRouter)

module.exports = {
  api: router,
  home: HomeRouter
}