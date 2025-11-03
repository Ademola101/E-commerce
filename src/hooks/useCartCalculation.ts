import { useMemo } from 'react';
import { DISCOUNT_THRESHOLD, ProductType,
    DISCOUNT_PERCENTAGE, DELIVERY_FEE
 } from '../types';



type CartItem = ProductType & { quantity: number };

interface CartCalculation {
  subtotal: number;
  discount: number;
  total: number;
}

export const useCartCalculation = (products: CartItem[]): CartCalculation => {
  const { subtotal, discount, total } = useMemo(() => {
    let subtotalAmount = 0;
    let discountAmount = 0;

    const productGroups = products.reduce((acc, product) => {
      if (!acc[product.id]) {
        acc[product.id] = { ...product, totalQuantity: 0 };
      }
      acc[product.id].totalQuantity += product.quantity || 0;
      return acc;
    }, {} as Record<string, ProductType & { totalQuantity: number }>);

    products.forEach((product) => {
      const itemTotal = product.price * product.quantity;
      subtotalAmount += itemTotal;

      const productGroup = productGroups[product.id];
      if (productGroup.totalQuantity >= DISCOUNT_THRESHOLD) {
        discountAmount += itemTotal * DISCOUNT_PERCENTAGE;
      }
    });

    const totalAmount = subtotalAmount - discountAmount + DELIVERY_FEE;

    return {
      subtotal: subtotalAmount,
      discount: discountAmount,
      total: totalAmount,
    };
  }, [products]);

  return { subtotal, discount, total };
};