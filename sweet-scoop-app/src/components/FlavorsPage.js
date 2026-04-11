import { useCallback, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FlavorCatalog from "./FlavorCatalog";
import OrderList from "./OrderList";
import localFlavors from "../flavors";
import { fetchFlavors, submitOrder } from "../api";

function FlavorsPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [catalogFlavors, setCatalogFlavors] = useState(localFlavors);
  const [catalogMessage, setCatalogMessage] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderMessageType, setOrderMessageType] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadFlavors = async () => {
      try {
        setCatalogLoading(true);
        const backendFlavors = await fetchFlavors();

        if (isCancelled) {
          return;
        }

        if (backendFlavors.length > 0) {
          setCatalogFlavors(backendFlavors);
          setCatalogMessage("");
        } else {
          setCatalogFlavors(localFlavors);
          setCatalogMessage("Using the built-in flavor list.");
        }
      } catch {
        if (!isCancelled) {
          setCatalogFlavors(localFlavors);
          setCatalogMessage("Using the built-in flavor list.");
        }
      } finally {
        if (!isCancelled) {
          setCatalogLoading(false);
        }
      }
    };

    loadFlavors();

    return () => {
      isCancelled = true;
    };
  }, []);

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

  const handlePlaceOrder = useCallback(async () => {
    if (orderItems.length === 0) {
      setOrderMessageType("error");
      setOrderMessage("Add at least one item before placing an order.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderMessage("");

    try {
      await submitOrder({
        items: orderItems,
        total: Number.parseFloat(
          orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)
        ),
      });

      setOrderMessageType("success");
      setOrderMessage("Order submitted successfully.");
    } catch (error) {
      setOrderMessageType("error");
      setOrderMessage(error instanceof Error ? error.message : "Unable to submit order.");
    } finally {
      setIsPlacingOrder(false);
    }
  }, [orderItems]);

  return (
    <div className="flavors-page">
      <Header />
      <div className="content">
        {catalogLoading ? (
          <p className="page-status">Loading flavors...</p>
        ) : null}

        {catalogMessage ? <p className="page-status">{catalogMessage}</p> : null}

        <FlavorCatalog flavors={catalogFlavors} onAddToOrder={handleAddToOrder} />
        <OrderList
          orderItems={orderItems}
          onRemoveItem={handleRemoveItem}
          onLoadOrder={handleLoadOrder}
          onPlaceOrder={handlePlaceOrder}
          isPlacingOrder={isPlacingOrder}
          orderMessage={orderMessage}
          orderMessageType={orderMessageType}
        />
      </div>
      <Footer />
    </div>
  );
}

export default FlavorsPage;
