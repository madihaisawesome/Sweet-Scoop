import { useCallback, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FlavorCatalog from "./FlavorCatalog";
import OrderList from "./OrderList";
import flavors from "../flavors";

function FlavorsPage() {
  const [orderItems, setOrderItems] = useState([]);

  const handleAddToOrder = useCallback((flavor) => {
    const unitPrice = Number.parseFloat(flavor.price.replace("$", ""));

    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === flavor.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === flavor.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prevItems,
        {
          id: flavor.id,
          name: flavor.name,
          unitPrice,
          quantity: 1,
        },
      ];
    });
  }, []);

  const handleRemoveItem = useCallback((flavorId) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === flavorId);

      if (!existingItem) {
        return prevItems;
      }

      if (existingItem.quantity <= 1) {
        return prevItems.filter((item) => item.id !== flavorId);
      }

      return prevItems.map((item) =>
        item.id === flavorId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  }, []);

  const handleLoadOrder = useCallback((loadedOrder) => {
    setOrderItems(loadedOrder);
  }, []);

  return (
    <div className="flavors-page">
      <Header />
      <div className="content">
        <FlavorCatalog flavors={flavors} onAddToOrder={handleAddToOrder} />
        <OrderList
          orderItems={orderItems}
          onRemoveItem={handleRemoveItem}
          onLoadOrder={handleLoadOrder}
        />
      </div>
      <Footer />
    </div>
  );
}

export default FlavorsPage;
