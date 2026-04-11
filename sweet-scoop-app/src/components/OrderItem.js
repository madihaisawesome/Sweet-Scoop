function OrderItem({ item, onRemoveItem }) {
  const unitPrice = Number(item.price || item.unitPrice || 0);
  const linePrice = (unitPrice * Number(item.quantity || 0)).toFixed(2);
  const flavorId = item.flavorId || item.id;

  return (
    <div className="order-item">
      <h4>{item.name}</h4>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${linePrice}</p>
      <button className="remove" onClick={() => onRemoveItem(flavorId)}>
        Remove Item
      </button>
    </div>
  );
}

export default OrderItem;
