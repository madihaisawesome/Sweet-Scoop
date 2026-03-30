function OrderItem({ item, onRemoveItem }) {
  const linePrice = (item.unitPrice * item.quantity).toFixed(2);

  return (
    <div className="order-item">
      <h4>{item.name}</h4>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${linePrice}</p>
      <button className="remove" onClick={() => onRemoveItem(item.id)}>
        Remove Item
      </button>
    </div>
  );
}

export default OrderItem;
