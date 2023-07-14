const { Router } = require('express')
const CartManager = require('../../managers/CartManager')

const cartManager = new CartManager('carts.json')
const router = Router()

router.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const carts = await cartManager.getByCid(cid);

    res.send(carts);
})

router.get('/', async (req, res) => {
    console.log(`Buscando todos los carts`);
    const carts = await cartManager.getAll();

    res.send(carts);
})

router.post('/', async (req, res) => {
    const { body } = req
    const cart = await cartManager.create(body)

    res.status(202).send(cart)
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    if (!await cartManager.getByCid(cid)) {
        res.sendStatus(404)
        return
    }
    await cartManager.delete(cid)

    res.sendStatus(200)
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    await cartManager.save(cid, pid)

    res.sendStatus(201)
})

module.exports = router
