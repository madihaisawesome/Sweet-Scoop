import OrderItem from "./OrderItem";

function OrderList({
  orderItems,
  onRemoveItem,
  onPlaceOrder,
  isPlacingOrder,
  orderMessage,
  orderMessageType,
}) {
  const totalOrderPrice = orderItems
    .reduce((sum, item) => sum + Number(item.price || item.unitPrice || 0) * Number(item.quantity || 0), 0)
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
