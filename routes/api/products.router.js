const { Router, response } = require('express')
const ProductManager = require('../../managers/ProductManager')

const productManager = new ProductManager('productos.json')
const router = Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const products = await productManager.getById(id);

  res.send(products)
})

router.get('/', async (req, res) => {
  const { limit } = req.query;
  console.log(`Buscando ${limit || 'todos los'} productos`);
  const products = await productManager.getAll();
  let filtrados = products;
  if (limit) {
    filtrados = filtrados.slice(0, parseInt(limit));
  }

  res.send(filtrados);
})

router.post('/', async (req, res) => {
  const { body } = req
  const product = await productManager.create(body)
  if (await product == undefined) {
    res.sendStatus(404)
    return
  }
  else {
    res.status(201).send(product)
    console.log("Producto creado con exito")
    return
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  if (!await productManager.getById(id)) {
    res.sendStatus(404)
    return
  }
  await productManager.delete(id)

  res.sendStatus(200)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  if (req.body.id) {
    console.log("No es necesario que envie el id dentro de la peticion, si usted desea cambiarlo es imposible")
  }
  try {
    if (!await productManager.getById(id)) {
      res.sendStatus(404)
      return
    }
    await productManager.save(id, body)
    res.sendStatus(202)
  }
  catch (e) {
    res.status(500).send({
      message: "Ha ocurrido un error en el servidor",
      exception: e.stack
    })
  }
})

module.exports = router