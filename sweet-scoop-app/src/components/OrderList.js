import { useEffect } from "react";
import OrderItem from "./OrderItem";

const STORAGE_KEY = "sweetScoopOrder";

function OrderList({
  orderItems,
  onRemoveItem,
  onLoadOrder,
  onPlaceOrder,
  isPlacingOrder,
  orderMessage,
  orderMessageType,
}) {
  useEffect(() => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);

    if (!savedOrder) {
      return;
    }

    try {
      const parsedOrder = JSON.parse(savedOrder);
      if (Array.isArray(parsedOrder)) {
        onLoadOrder(parsedOrder);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [onLoadOrder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orderItems));
  }, [orderItems]);

  const totalOrderPrice = orderItems
    .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="order-list">
      <h2>Your Order</h2>
      <div className="order-box">
        {orderItems.length === 0 ? (
          <p className="order-empty">No items in your order.</p>
        ) : (
          <>
            {orderItems.map((item) => (
              <OrderItem key={item.id} item={item} onRemoveItem={onRemoveItem} />
            ))}
            <h3 className="order-total">Total: ${totalOrderPrice}</h3>
            <button
              className="place-order"
              type="button"
              onClick={onPlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </>
        )}

        {orderMessage ? (
          <p className={`page-status ${orderMessageType === "success" ? "status-success" : "status-error"}`}>
            {orderMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default OrderList;
