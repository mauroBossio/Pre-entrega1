const fs = require('fs/promises')
const path = require('path')

class CartManager {
    #carts = []

    constructor(filename) {
    this.filename = filename
    this.filepath = path.join(__dirname, '../data', this.filename)
    }

    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8')
        this.#carts = JSON.parse(data)
    }

    #writeFile = async() => {
        const data = JSON.stringify(this.#carts, null, 2)
        await fs.writeFile(this.filepath, data)
    }

    async getAll() {
        await this.#readFile()

        return this.#carts
    }

    async getByCid(cid) {
        await this.#readFile()
        const c = this.#carts.find(c => c.cid == cid)
        return c
    }

    async create(cart) {
        await this.#readFile()
        const products = []
        const cid = parseInt((this.#carts[this.#carts.length - 1]?.cid || 0)) + 1
        const newCart = {
          products,
          cid
        }
        this.#carts.push(newCart)
        await this.#writeFile()
    
        return newCart
    }

    async save(cid, pid) {
        const cart = await this.getByCid(cid)
        let index = cart.products.findIndex(( p => p.product == pid))
        if (index !== -1) {
            cart.products[index].quantity++
            await this.#writeFile()
        }
        else {
            cart.products.push({
                product: parseInt(pid),
                quantity: 1
            })
            await this.#writeFile()
        }
    }
}

module.exports = CartManager