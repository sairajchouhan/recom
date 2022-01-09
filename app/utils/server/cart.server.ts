import { db } from './db.server'
import { Prisma, Size } from '@prisma/client'
import { redirect } from 'remix'
import { CartItem } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'

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

export const addItemToCart = async ({
  userId,
  productId,
  size,
}: {
  userId: string
  productId: string
  size: Size
}) => {
  let userCart = await db.userCart.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      totalItems: true,
      totalPrice: true,
    },
  })

  if (!userCart) {
    userCart = await createUserCart({ userId })
  }

  const cartItemSearch = await db.cartItem.findMany({
    where: {
      productId,
      userCart: {
        id: userCart.id,
      },
      size,
    },
  })

  let cartItem:
    | (CartItem & {
        product: {
          price: Decimal
        }
      })
    | null = null

  if (cartItemSearch.length > 0) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItemSearch[0].id,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    })
  } else {
    cartItem = await db.cartItem.create({
      data: {
        productId,
        userCartId: userCart.id,
        size: size,
        quantity: 1,
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    })
  }

  await db.userCart.update({
    where: {
      id: userCart.id,
    },
    data: {
      totalPrice: {
        increment: cartItem.product.price,
      },
      totalItems: {
        increment: 1,
      },
    },
  })

  return cartItem
}

export const getCartSummary = async ({
  userId,
  taxPercentage,
}: {
  userId: string
  taxPercentage: number
}) => {
  let userCart = await db.userCart.findFirst({
    where: {
      userId,
    },
  })

  if (!userCart) {
    userCart = await createUserCart({ userId })
  }

  const tax = new Prisma.Decimal(userCart.totalPrice)
    .mul(taxPercentage)
    .toFixed(2)
  const deliveryCharge = new Prisma.Decimal(5).toFixed(2)
  const totalPriceForProducts = new Prisma.Decimal(userCart.totalPrice).toFixed(
    2
  )
  const total = new Prisma.Decimal(totalPriceForProducts)
    .add(tax)
    .add(deliveryCharge)
    .toFixed(2)

  const returnData =
    userCart.totalItems > 0
      ? {
          totalItems: userCart.totalItems,
          deliveryCharge,
          totalPriceForProducts,
          tax,
          total,
        }
      : null
  return returnData
}
