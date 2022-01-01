import { db } from './db.server'

export const createUserCart = async ({ userId }: { userId: string }) => {
  if (!userId || typeof userId !== 'string') {
    return null
  }
  const userCart = await db.userCart.create({
    data: {
      userId,
      totalPrice: 0,
    },
  })
  return userCart
}
