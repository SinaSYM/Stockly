export type Product = { id: string; name: string; price: number; stock: number; lowStockThreshold: number; color: string };
export type OrderStatus = "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled";
export type OrderItem = { productId: string; productName?: string; qty: number; unitPrice: number };
export type Order = { id: string; customerName: string; customerPhone: string; items: OrderItem[]; status: OrderStatus; createdAt: string };
