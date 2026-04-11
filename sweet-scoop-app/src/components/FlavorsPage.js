import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FlavorCatalog from "./FlavorCatalog";
import OrderList from "./OrderList";
import { getAuthState } from "../auth";
import {
  addToCart,
  fetchCart,
  fetchFlavors,
  placeOrder,
  removeCartItem,
  updateCartQuantity,
} from "../api";

function FlavorsPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [catalogFlavors, setCatalogFlavors] = useState([]);
  const [catalogMessage, setCatalogMessage] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");
  const [orderMessageType, setOrderMessageType] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    const loadInitialData = async () => {
      const authState = getAuthState();

      if (!authState?.userId) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setCatalogLoading(true);
        const [backendFlavors, backendCart] = await Promise.all([
          fetchFlavors(),
          fetchCart(authState.userId),
        ]);

        if (isCancelled) {
          return;
        }

        setCatalogFlavors(backendFlavors);
        setOrderItems(backendCart);
        setCatalogMessage("");
      } catch (error) {
        if (!isCancelled) {
          setCatalogMessage(error instanceof Error ? error.message : "Unable to load page data.");
        }
      } finally {
        if (!isCancelled) {
          setCatalogLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  const handleAddToOrder = useCallback(async (flavor) => {
    const authState = getAuthState();

    if (!authState?.userId) {
      navigate("/login", { replace: true });
      return;
    }

    setOrderMessage("");

    try {
      const existingItem = orderItems.find(
        (item) => Number(item.flavorId || item.id) === Number(flavor.id)
      );

      const updatedCart = existingItem
        ? await updateCartQuantity(
            authState.userId,
            Number(flavor.id),
            Number(existingItem.quantity) + 1
          )
        : await addToCart(authState.userId, Number(flavor.id));

      setOrderItems(updatedCart);
      setOrderMessageType("success");
      setOrderMessage("Cart updated.");
    } catch (error) {
      setOrderMessageType("error");
      setOrderMessage(error instanceof Error ? error.message : "Unable to update cart.");
    }
  }, [navigate, orderItems]);

  const handleRemoveItem = useCallback(async (flavorId) => {
    const authState = getAuthState();

    if (!authState?.userId) {
      navigate("/login", { replace: true });
      return;
    }

    setOrderMessage("");

    try {
      const updatedCart = await removeCartItem(authState.userId, Number(flavorId));
      setOrderItems(updatedCart);
      setOrderMessageType("success");
      setOrderMessage("Item removed.");
    } catch (error) {
      setOrderMessageType("error");
      setOrderMessage(error instanceof Error ? error.message : "Unable to remove item.");
    }
  }, [navigate]);

  const handlePlaceOrder = useCallback(async () => {
    const authState = getAuthState();

    if (!authState?.userId) {
      navigate("/login", { replace: true });
      return;
    }

    if (orderItems.length === 0) {
      setOrderMessageType("error");
      setOrderMessage("Add at least one item before placing an order.");
      return;
    }

    setIsPlacingOrder(true);
    setOrderMessage("");

    try {
      const response = await placeOrder(authState.userId);

      setOrderMessageType("success");
      setOrderMessage(response?.message || "Order placed successfully.");
      setOrderItems([]);
    } catch (error) {
      setOrderMessageType("error");
      setOrderMessage(error instanceof Error ? error.message : "Unable to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  }, [navigate, orderItems]);

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
