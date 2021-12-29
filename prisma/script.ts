import { db } from '~/utils/db.server'
import products from './data.json'

const add_products = () => {
  products.forEach((product) => {
    db.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
      },
    })
  })
}
