import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import DisplayStatus from "./DisplayStatus";
import { getAuthState } from "../auth";
import { fetchOrderHistory } from "../api";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const loadOrders = async () => {
      const authState = getAuthState();

      if (!authState?.userId) {
        if (!isCancelled) {
          setOrders([]);
          setMessageType("error");
          setMessage("Login is required.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const loadedOrders = await fetchOrderHistory(authState.userId);
        if (!isCancelled) {
          setOrders(loadedOrders);
          setMessage("");
          setMessageType("");
        }
      } catch (error) {
        if (!isCancelled) {
          setMessageType("error");
          setMessage(error instanceof Error ? error.message : "Unable to load order history.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <Header />
      <main className="mainsection">
        <section>
          <h2>Order History</h2>
          {isLoading ? <p className="page-status">Loading order history...</p> : null}
          {message ? <DisplayStatus type={messageType} message={message} /> : null}

          {!isLoading && !message && orders.length === 0 ? (
            <p className="page-status">No previous orders found.</p>
          ) : null}

          {!isLoading && !message
            ? orders.map((order) => (
                <div key={order.orderId} className="history-order">
                  <h3>Order #{order.orderId}</h3>
                  <p>
                    <strong>Total:</strong> ${Number(order.total || 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Date:</strong> {order.timestamp || order.date || "N/A"}
                  </p>
                  <ul className="history-items">
                    {(order.items || []).map((item) => (
                      <li key={`${order.orderId}-${item.flavorId || item.name}`}>
                        {item.name} — Qty: {item.quantity} — ${Number(item.price || 0).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OrderHistoryPage;
