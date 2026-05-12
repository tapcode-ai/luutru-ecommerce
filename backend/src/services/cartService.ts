import { v4 as uuidv4 } from "uuid";
import { Cart, CartItem, AddToCartDTO, UpdateCartItemDTO } from "../types";
import { mockCarts } from "./mockData";
import { productService } from "./productService";

let carts: Cart[] = [...mockCarts];

export const cartService = {
  getCart(userId: string): Cart {
    let cart = carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        id: `cart-${uuidv4().slice(0, 8)}`,
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      carts.push(cart);
    }
    return cart;
  },

  addItem(userId: string, dto: AddToCartDTO): Cart {
    const cart = this.getCart(userId);
    const product = productService.getById(dto.productId);

    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }

    if (product.stock < dto.quantity) {
      throw new Error("Sản phẩm không đủ số lượng trong kho");
    }

    const existingItem = cart.items.find(
      (item) => item.productId === dto.productId
    );

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      if (existingItem.quantity > product.stock) {
        throw new Error("Sản phẩm không đủ số lượng trong kho");
      }
    } else {
      const newItem: CartItem = {
        id: `cart-item-${uuidv4().slice(0, 8)}`,
        productId: dto.productId,
        product,
        quantity: dto.quantity,
        addedAt: new Date().toISOString(),
      };
      cart.items.push(newItem);
    }

    cart.updatedAt = new Date().toISOString();
    return cart;
  },

  updateItem(userId: string, productId: string, dto: UpdateCartItemDTO): Cart {
    const cart = this.getCart(userId);
    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    if (dto.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      const product = productService.getById(productId);
      if (product && dto.quantity > product.stock) {
        throw new Error("Sản phẩm không đủ số lượng trong kho");
      }
      item.quantity = dto.quantity;
    }

    cart.updatedAt = new Date().toISOString();
    return cart;
  },

  removeItem(userId: string, productId: string): Cart {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  },

  clearCart(userId: string): Cart {
    const cart = this.getCart(userId);
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    return cart;
  },

  getCartTotal(cart: Cart): {
    totalPrice: number;
    shippingFee: number;
    grandTotal: number;
    itemCount: number;
  } {
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingFee = productService.getShippingFee(totalPrice);
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalPrice,
      shippingFee,
      grandTotal: totalPrice + shippingFee,
      itemCount,
    };
  },
};