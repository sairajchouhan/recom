import products from './data.json'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:password@localhost:5432/recom?schema=public',
    },
  },
})

const add_products = async () => {
  const men_tshirts_category_ids = (await db.category.findMany({})).map(
    (item) => item.id
  )

  const promises: Array<Promise<any>> = []

  products.forEach((product) => {
    promises.push(
      db.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          color: product.color,
          url: product.url,
          category: {
            connect: men_tshirts_category_ids.map((item) => ({ id: item })),
          },
        },
      })
    )
  })
  await Promise.all(promises)
}

const add_categories = async () => {
  const categories = [
    {
      name: 'men',
      description: 'for men',
    },
    {
      name: 'tshirt',
      description: 'tshirt',
    },
  ]

  await db.category.createMany({
    data: categories,
  })
}

add_products()
  .then(() => {
    console.log('✅')
  })
  .catch((err) => {
    console.error(err)
  })
