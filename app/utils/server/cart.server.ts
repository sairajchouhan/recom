import { db } from './db.server'

export const createUserCart = async ({ userId }: { userId: string }) => {
  const userCart = await db.userCart.create({
    data: {
      userId,
      totalPrice: 0,
    },
  })
  return userCart
}
