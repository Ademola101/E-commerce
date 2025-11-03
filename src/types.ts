export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

const DISCOUNT_THRESHOLD = 3; 
const DISCOUNT_PERCENTAGE = 0.1; 
const DELIVERY_FEE = 5; 
export { DISCOUNT_THRESHOLD, DISCOUNT_PERCENTAGE, DELIVERY_FEE };