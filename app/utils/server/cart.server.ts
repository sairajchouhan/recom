import { db } from './db.server'
import { Prisma } from '@prisma/client'
import { redirect } from 'remix'

export const createUserCart = async ({ userId }: { userId: string }) => {
  const userCart = await db.userCart.create({
    data: {
      userId,
      totalPrice: 0,
    },
  })
  return userCart
}

export const getCartItems = async (userId: string) => {
  const cartItems = await db.cartItem.findMany({
    where: {
      userCart: {
        userId,
      },
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  return cartItems
}

export const removeCartItem = async (toRemoveCartItemId: string) => {
  const removedCartItem = await db.cartItem.delete({
    where: {
      id: toRemoveCartItemId,
    },
    include: {
      product: {
        select: {
          price: true,
        },
      },
    },
  })

  await db.userCart.update({
    where: {
      id: removedCartItem.userCartId,
    },
    data: {
      totalPrice: {
        decrement: new Prisma.Decimal(removedCartItem.product.price).mul(
          removedCartItem.quantity
        ),
      },
      totalItems: {
        decrement: removedCartItem.quantity,
      },
    },
  })
}

export const updateQuantityOfCartItem = async (
  cartId: string,
  quantity: number
) => {
  const previousCartItem = await db.cartItem.findUnique({
    where: {
      id: cartId,
    },
    select: {
      quantity: true,
    },
  })

  if (!previousCartItem) {
    throw redirect('/checkout/cart')
  }

  const updatedCartItem = await db.cartItem.update({
    where: {
      id: cartId,
    },
    data: {
      quantity,
    },
    include: {
      product: {
        select: {
          price: true,
        },
      },
    },
  })

  const changeInQuantity = updatedCartItem.quantity - previousCartItem.quantity

  let totalPriceUpdate: any = {}
  let totalQuantityUpdate: any = {}

  if (changeInQuantity > 0) {
    totalPriceUpdate = {
      increment: new Prisma.Decimal(updatedCartItem.product.price).mul(
        changeInQuantity
      ),
    }
    totalQuantityUpdate = {
      increment: changeInQuantity,
    }
  }
  if (changeInQuantity < 0) {
    totalPriceUpdate = {
      decrement: new Prisma.Decimal(updatedCartItem.product.price)
        .mul(changeInQuantity)
        .mul(-1),
    }
    totalQuantityUpdate = {
      decrement: -1 * changeInQuantity,
    }
  }

  if (changeInQuantity === 0) {
    throw redirect('/checkout/cart')
  }

  await db.userCart.update({
    where: {
      id: updatedCartItem.userCartId,
    },
    data: {
      totalPrice: totalPriceUpdate,
      totalItems: totalQuantityUpdate,
    },
  })
}
