export type CartItem = {
  id: string;
  name: string;
  priceInr: number;
  quantityAvailable: number;
  quantity: number;
};

export const CART_KEY = "artisanal_hearth:cart:v1";

export function cartItemTotal(item: CartItem): number {
  return item.priceInr * item.quantity;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemTotal(item), 0);
}
