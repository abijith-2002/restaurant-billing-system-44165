import React, { useState, useMemo } from "react";
import "./App.css";

/* -------------------------------------------------------------------------- *
| Theme Colors (as specified)
*  Accent:   #FFA726 (Light Orange)
*  Primary:  #FF7043 (Deep Orange)
*  Secondary:#37474F (Blue-Gray)
*  Used mainly via inline styles to override CSS variables as needed.
*---------------------------------------------------------------------------*/

// Simulated menu data (in a real app, fetch from API)
const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    description: "Fresh basil, mozzarella & tomato sauce on thin crust.",
    price: 8.99,
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Pasta, bacon, creamy egg sauce, cracked pepper.",
    price: 11.5,
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, house caesar dressing.",
    price: 7.0,
  },
  {
    id: 4,
    name: "Grilled Salmon",
    description: "Salmon fillet, lemon dill butter, vegetables.",
    price: 15.2,
  },
  {
    id: 5,
    name: "Avocado Toast",
    description: "Multigrain bread, smashed avocado, radish, arugula.",
    price: 6.75,
  },
  {
    id: 6,
    name: "Lemonade",
    description: "Fresh squeezed lemon, classic or sparkling.",
    price: 2.5,
  },
];

// PUBLIC_INTERFACE
function App() {
  // Cart: {id, name, price, qty}
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false); // cart sidebar/modal
  const [showSummary, setShowSummary] = useState(false); // order summary dialog
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Theme: only light mode, but accent applied via CSS vars and inline.
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", "#FFA726");  // accent
    document.documentElement.style.setProperty("--primary", "#FF7043"); // primary
    document.documentElement.style.setProperty("--secondary", "#37474F");// secondary
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  // PUBLIC_INTERFACE
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((it) => it.id === item.id);
      if (exists) {
        // Increase quantity
        return prev.map((it) =>
          it.id === item.id ? { ...it, qty: it.qty + 1 } : it
        );
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
  };

  // PUBLIC_INTERFACE
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // PUBLIC_INTERFACE
  const updateQty = (id, diff) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Math.max(1, item.qty + diff) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // PUBLIC_INTERFACE
  const placeOrder = () => {
    setShowSummary(false);
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => setOrderPlaced(false), 3000);
  };

  // Order totals and summary
  const cartTotal = useMemo(
    () =>
      cart
        .reduce((sum, item) => sum + item.qty * item.price, 0)
        .toLocaleString(undefined, { style: "currency", currency: "USD" }),
    [cart]
  );

  // Resets when placing a new order
  const handleCheckout = () => {
    setShowSummary(true);
    setCartOpen(false);
  };

  /* Main layout: AppBar, MenuGrid, CartSidebar/Modal, SummaryModal */
  return (
    <div className="App" style={{
      backgroundColor: "#fff",
      color: "#222",
      minHeight: "100vh"
    }}>
      {/* App Bar */}
      <nav className="appbar"
        style={{
          background: "var(--primary)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 600,
          fontSize: 24,
          padding: "0 32px",
          height: 64,
          boxShadow: "0 1px 8px 0 rgba(36,37,38,0.06)",
          letterSpacing: "-1px"
        }}
      >
        <span>
          <span style={{ color: "var(--accent)" }}>☕</span> Kavia Restaurant
        </span>
        <button
          className="cart-btn"
          aria-label="Open cart"
          style={{
            background: "var(--secondary)",
            color: "#fff",
            border: 0,
            borderRadius: 18,
            fontWeight: 600,
            fontSize: 16,
            padding: "8px 18px",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(36,37,38,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            outline: "none",
          }}
          onClick={() => setCartOpen((open) => !open)}
        >
          🛒 Cart
          {cart.length > 0 && (
            <span
              style={{
                background: "var(--accent)",
                color: "#fff",
                borderRadius: 14,
                padding: "2px 8px",
                marginLeft: 2,
                fontSize: 14,
                minWidth: 20,
                display: "inline-block",
              }}
              aria-label="Number of items in cart"
            >
              {cart.reduce((a, b) => a + b.qty, 0)}
            </span>
          )}
        </button>
      </nav>
      <main className="main-content" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 8px 64px 8px" }}>
        <h1 style={{
          fontWeight: 700,
          fontSize: 36,
          margin: "24px 0 4px 0",
          letterSpacing: "-2px",
          color: "var(--secondary)"
        }}>Menu</h1>
        <p style={{ color: "#555", fontSize: 18, margin: "0 0 16px 0" }}>
          Browse our menu and add items to your order.
        </p>
        {/* Menu Grid */}
        <section
          className="menu-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "28px 20px",
            margin: "14px 0 40px 0"
          }}>
          {MENU_ITEMS.map((item) => (
            <article
              key={item.id}
              className="menu-item-card"
              style={{
                background: "#fff",
                border: "1.5px solid #eee",
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(36,37,38,0.06)",
                padding: "24px 22px 18px 22px",
                textAlign: "left",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
              <header>
                <h2 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--primary)",
                  margin: "0 0 2px 0"
                }}>{item.name}</h2>
                <p style={{ fontSize: 14, color: "#757575", margin: "0 0 13px 0" }}>{item.description}</p>
              </header>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: 17
                }}>
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="add-btn"
                  aria-label={`Add ${item.name} to cart`}
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 15,
                    border: "none",
                    borderRadius: 18,
                    padding: "7px 16px",
                    boxShadow: "0 1px 4px rgba(255,167,38,0.13)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  + Add
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
      {/* Cart Sidebar Modal */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        total={cartTotal}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />
      {/* Order Summary Modal */}
      {showSummary && (
        <OrderSummaryModal
          cart={cart}
          total={cartTotal}
          onPlaceOrder={placeOrder}
          onClose={() => setShowSummary(false)}
        />
      )}
      {/* Snackbar order placed notification */}
      <div
        aria-live="polite"
        role="status"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 36,
          zIndex: 1201,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none"
        }}>
        {orderPlaced && (
          <div style={{
            background: "var(--accent)",
            color: "#fff",
            padding: "18px 36px",
            borderRadius: 18,
            fontSize: 20,
            fontWeight: 700,
            boxShadow: "0 4px 15px 0 rgba(255,167,38,0.09)"
          }}>
            ✅ Order placed! Thank you.
          </div>
        )}
      </div>
      <footer style={{
        textAlign: "center",
        color: "#c1a77e",
        fontSize: 15,
        padding: "36px 0 10px 0",
        background: "#fff"
      }}>
        Kavia Billing &middot; Modern React Demo
      </footer>
    </div>
  );
}


// Cart Sidebar/Modal (for mobile <600px width, modal; desktop, right sidebar)
function CartSidebar({
  open,
  onClose,
  cart,
  total,
  updateQty,
  removeFromCart,
  onCheckout,
}) {
  // Responsive: Render modal on small screens, sidebar otherwise
  const [mobile, setMobile] = React.useState(window.innerWidth < 600);

  React.useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!open) return null;

  return (
    <aside
      className="cart-sidebar"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: mobile ? "100vw" : 370,
        height: "100vh",
        background: "#fff",
        boxShadow: mobile
          ? "0 6px 22px 0 rgba(55,71,79,0.09)"
          : "-7px 0 26px 0 rgba(255,112,67,0.11)",
        zIndex: 1105,
        transition: "right 0.3s",
        borderLeft: "3px solid var(--primary)",
        display: "flex",
        flexDirection: "column",
        animation: "cartslidein 0.27s cubic-bezier(.47,1.64,.41,.8)",
        maxWidth: "100vw"
      }}
    >
      <header style={{
        padding: "18px 24px 10px 26px",
        borderBottom: "1.7px solid #f1ede1",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{
          color: "var(--primary)",
          fontWeight: 800,
          fontSize: 22,
        }}>
          <span role="img" aria-label="cart">🛒</span> Your Cart
        </span>
        <button
          onClick={onClose}
          aria-label="Close cart"
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontWeight: 600,
            fontSize: 28,
            cursor: "pointer",
            padding: 0,
          }}>×</button>
      </header>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px 10px 22px"
        }}>
        {cart.length === 0 ? (
          <div style={{ color: "#bbb", textAlign: "center", marginTop: 60 }}>
            <span style={{ fontSize: 48, display: "block", marginBottom: 8 }}>🛍️</span>
            Cart is empty. Add something delicious!
          </div>
        ) : (
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {cart.map((item) => (
              <li
                key={item.id}
                style={{
                  marginBottom: "22px",
                  borderBottom: "1px solid #f5e8df",
                  paddingBottom: 7,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                <div style={{
                  flex: "1 1 auto",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{ fontWeight: 650, fontSize: 16 }}>{item.name}</div>
                  <div style={{ color: "#777", fontSize: 13 }}>{item.qty} × ${item.price.toFixed(2)}</div>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>
                  <button
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 17,
                      fontSize: 18,
                      padding: "0 10px",
                      margin: "0 2px",
                      width: 28,
                      height: 28,
                      lineHeight: "28px",
                      cursor: "pointer"
                    }}
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => updateQty(item.id, -1)}
                  >−</button>
                  <button
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 17,
                      fontSize: 18,
                      padding: "0 10px",
                      margin: "0 2px",
                      width: 28,
                      height: 28,
                      lineHeight: "28px",
                      cursor: "pointer"
                    }}
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQty(item.id, +1)}
                  >＋</button>
                </div>
                <button
                  style={{
                    marginLeft: 14,
                    background: "none",
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: 20,
                    border: "none",
                    cursor: "pointer"
                  }}
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => removeFromCart(item.id)}
                >×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <footer style={{
        padding: "18px 28px",
        borderTop: "1.5px solid #f2e5d4"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15
        }}>
          <span style={{
            fontWeight: 700,
            fontSize: 20,
            color: "#555"
          }}>Total:</span>
          <span style={{
            color: "var(--accent)",
            fontWeight: 700,
            fontSize: 22,
          }}>{total}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="checkout-btn"
          style={{
            width: "100%",
            padding: "15px 0",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            border: "none",
            borderRadius: 15,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            opacity: cart.length === 0 ? 0.63 : 1,
            boxShadow: "0 1px 6px 0 rgba(255,112,67,0.13)"
          }}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout &rarr;
        </button>
      </footer>
    </aside>
  );
}

/**
 * OrderSummaryModal: minimal summary of selected items & total.
 * On "Place Order", calls onPlaceOrder and closes.
 */
function OrderSummaryModal({ cart, total, onPlaceOrder, onClose }) {
  // Trap focus and block scroll for accessibility
  React.useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; }
  }, []);

  return (
    <div className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(55,71,79,0.22)",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <section
        className="order-summary-modal"
        style={{
          width: "90vw",
          maxWidth: 390,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 6px 28px 0 rgba(55,71,79,0.24)",
          padding: "30px 32px 22px 32px",
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          position: "relative"
        }}>
        <button
          onClick={onClose}
          aria-label="Close order summary"
          style={{
            position: "absolute",
            top: 12,
            right: 20,
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontWeight: 600,
            fontSize: 29,
            cursor: "pointer",
            padding: 0,
          }}>×</button>
        <h2 style={{
          fontWeight: 800,
          fontSize: 24,
          margin: "0 0 18px 0",
          color: "var(--secondary)"
        }}>
          Order Summary
        </h2>
        <ul style={{
          padding: 0,
          margin: 0,
          listStyle: "none"
        }}>
          {cart.map(item => (
            <li key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 0",
                fontSize: 16,
                borderBottom: "1px solid #f5e3dd"
              }}>
              <span>
                {item.name} × {item.qty}
              </span>
              <span style={{
                color: "var(--accent)",
                fontWeight: 600
              }}>${(item.price * item.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 19,
            marginTop: 17,
            borderTop: "2px solid #eee",
            paddingTop: 12,
            color: "#333"
          }}>
          <span>Total</span>
          <span style={{ color: "var(--accent)" }}>{total}</span>
        </div>
        <button
          onClick={onPlaceOrder}
          className="placeorder-btn"
          style={{
            marginTop: 28,
            width: "100%",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 16,
            fontWeight: 700,
            fontSize: 18,
            padding: "13px 0",
            boxShadow: "0 2px 8px 0 rgba(255,167,38,0.11)",
            cursor: "pointer"
          }}
          aria-label="Place order"
        >
          Place Order
        </button>
      </section>
    </div>
  );
}

export default App;
