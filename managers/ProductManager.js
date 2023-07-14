const fs = require('fs/promises')
const path = require('path')

class ProductManager {

  #products = []

  constructor(filename) {
    this.filename = filename
    this.filepath = path.join(__dirname, '../data', this.filename)
  }

  #readFile = async () => {
    const data = await fs.readFile(this.filepath, 'utf-8')
    this.#products = JSON.parse(data)
  }

  #writeFile = async() => {
    const data = JSON.stringify(this.#products, null, 2)
    await fs.writeFile(this.filepath, data)
  }

  async getAll() {
    await this.#readFile()

    return this.#products
  }

  async getById(id) {
    await this.#readFile()

    return this.#products.find(p => p.id == id)
  }

  async create(product) {
    await this.#readFile()
    const id = (this.#products[this.#products.length - 1]?.id || 0) + 1
    if (product.status !== false) {
      product.status = true
    }
    const newProduct = {
      ...product,
      id,
    }
    if (
      typeof newProduct.title === "string" &&
      typeof newProduct.description === "string" &&
      typeof newProduct.code === "string" &&
      typeof newProduct.price === "number" &&
      typeof newProduct.stock === "number" &&
      typeof newProduct.category === "string"
    ) {
      this.#products.push(newProduct)
      await this.#writeFile()

      return newProduct
    }
    else {
      const response = console.log("Rellene todos los capos obligatorios con el tipo de dato correcto")

      return response
    }
  }

  async save(id, product) {
    await this.#readFile()
    const existing = await this.getById(id)
    if (!existing) {
      return
    }
    const {
      title,
      description,
      price,
      stock,
      code,
      category,
      status = true,
      thumbnails
    } = product
    existing.title = title
    existing.description = description
    existing.price = price
    existing.stock = stock
    existing.code = code
    existing.category = category
    existing.status = status
    existing.thumbnails = thumbnails
    await this.#writeFile()
  }
  async delete(id) {
    await this.#readFile()
    this.#products = this.#products.filter(p => p.id != id)
    await this.#writeFile()
  }
}

module.exports = ProductManager
