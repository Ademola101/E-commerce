import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage, zustandStorage } from "../../config/mmkv";
import { ProductType } from "../types";


type ProductState = {
  products: ProductType[];
  addProduct: (product: ProductType) => void;
  removeProduct: (id: string) => void;
  updateProduct: (updatedProduct: ProductType) => void;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
        })),
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export const useCartStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      updateProduct: (updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
        })),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);