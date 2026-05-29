// src/store/cart.ts
import { atom } from 'nanostores';

// 1. Exportamos la estructura del dato (interface)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// 2. Exportamos el almacén (store)
export const cartItems = atom<CartItem[]>([]);

// 3. Exportamos la función para agregar
export function addProduct(product: { id: string, name: string, price: number }) {
  const currentItems = cartItems.get();
  const existingEntry = currentItems.find((item) => item.id === product.id);

  if (existingEntry) {
    cartItems.set(
      currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  } else {
    cartItems.set([...currentItems, { ...product, quantity: 1 }]);
  }
}

export function removeProduct(id: string) {
  cartItems.set(cartItems.get().filter((item) => item.id !== id));
}

export function updateQuantity(id: string, delta: number) {
  const currentItems = cartItems.get();
  const item = currentItems.find((i) => i.id === id);
  if (!item) return;
  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeProduct(id);
  } else {
    cartItems.set(currentItems.map((i) => i.id === id ? { ...i, quantity: newQty } : i));
  }
}