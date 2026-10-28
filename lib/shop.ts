export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

export type WishlistItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
};

const CART_KEY = "knltc_cart";
const WISHLIST_KEY = "knltc_wishlist";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("knltc-cart-updated"));
}

export function addToCart(item: CartItem) {
  const existing = readCart();
  const matched = existing.find((entry) => entry.productId === item.productId);
  if (matched) {
    matched.quantity += item.quantity;
    writeCart([...existing]);
    return;
  }
  writeCart([...existing, item]);
}

export function removeFromCart(productId: string) {
  writeCart(readCart().filter((item) => item.productId !== productId));
}

export function updateCartQuantity(productId: string, quantity: number) {
  if (quantity <= 0) return removeFromCart(productId);
  const next = readCart().map((item) => (item.productId === productId ? { ...item, quantity } : item));
  writeCart(next);
}

export function clearCart() {
  writeCart([]);
}

export function readWishlist(): WishlistItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeWishlist(items: WishlistItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("knltc-wishlist-updated"));
}

export function toggleWishlist(item: WishlistItem) {
  const current = readWishlist();
  const exists = current.some((entry) => entry.productId === item.productId);
  const wishRowId = `wish-${item.productId}`;
  if (exists) {
    writeWishlist(current.filter((entry) => entry.productId !== item.productId));
    if (isBrowser()) {
      fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          table: "wishlist_items",
          id: wishRowId,
        }),
      }).catch(() => {});
    }
    return false;
  }
  writeWishlist([...current, item]);
  if (isBrowser()) {
    fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPSERT",
        table: "wishlist_items",
        payload: {
          id: wishRowId,
          session_id: "browser-wishlist",
          product_id: item.productId,
          product_slug: item.slug,
          product_title: item.name,
          customer_phone: "",
          created_at: new Date().toISOString(),
        },
      }),
    }).catch(() => {});
  }
  return true;
}
