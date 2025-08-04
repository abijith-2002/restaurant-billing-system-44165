import React, { useState, useMemo } from "react";
import "./App.css";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Classic Margherita Pizza",
    description: "Fresh basil, mozzarella & tomato sauce on thin crust.",
    price: 8.99,
    image: null
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    description: "Pasta, bacon, creamy egg sauce, cracked pepper.",
    price: 11.5,
    image: null
  },
  {
    id: 3,
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, house caesar dressing.",
    price: 7.0,
    image: null
  },
  {
    id: 4,
    name: "Grilled Salmon",
    description: "Salmon fillet, lemon dill butter, vegetables.",
    price: 15.2,
    image: null
  },
  {
    id: 5,
    name: "Avocado Toast",
    description: "Multigrain bread, smashed avocado, radish, arugula.",
    price: 6.75,
    image: null
  },
  {
    id: 6,
    name: "Lemonade",
    description: "Fresh squeezed lemon, classic or sparkling.",
    price: 2.5,
    image: null
  },
];

function IconMenu({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22">
      <rect x="2" y="5" width="18" height="2.4" rx="1.1" fill={color} />
      <rect x="2" y="10" width="18" height="2.4" rx="1.1" fill={color} />
      <rect x="2" y="15" width="12" height="2.4" rx="1.1" fill={color} />
    </svg>
  );
}

function IconCart({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22">
      <circle cx="8" cy="18" r="2" fill={color} />
      <circle cx="16" cy="18" r="2" fill={color} />
      <rect x="4.5" y="6" width="13" height="7" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="2.2" y="2.6" width="17.6" height="2.6" rx="1.2" fill={color} />
    </svg>
  );
}

function IconDish({ size = 44, color = "#516177" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="19" fill={color} fillOpacity=".13"/>
      <ellipse cx="22" cy="28" rx="13" ry="5" stroke={color} strokeWidth="2" fill="none"/>
      <circle cx="22" cy="18" r="8" fill={color} fillOpacity=".19"/>
      <circle cx="22" cy="18" r="5.5" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  React.useEffect(() => {
    // Set theme root vars for fallback
    document.body.style.background = "var(--bg-dark)";
  }, []);

  // PUBLIC_INTERFACE
  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((it) => it.id === item.id);
      if (exists) {
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
    setTimeout(() => setOrderPlaced(false), 2800);
  };

  const cartTotal = useMemo(
    () =>
      cart
        .reduce((sum, item) => sum + item.qty * item.price, 0)
        .toLocaleString(undefined, { style: "currency", currency: "USD" }),
    [cart]
  );

  const handleCheckout = () => {
    setShowSummary(true);
    setCartOpen(false);
  };

  // Only one category for demonstration: Pizza (add your own categories as needed)
  return (
    <div className="App">
      {/* Header */}
      <nav className="appbar">
        <div className="appbar__logo">
          {/* Logo, optionally swapped for icon */}
          <span role="img" aria-label="logo" style={{fontSize: 23, marginRight: 7}}>🍽️</span>
          <span>Bistro Deluxe</span>
        </div>
        <div className="appbar__actions">
          <button className="header-btn" style={{minWidth: 80}} aria-label="Main menu">
            <IconMenu size={18} />
            Menu
          </button>
          <button
            className="header-btn"
            style={{minWidth: 80, position: "relative"}}
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            <IconCart size={18} />
            Cart
            {cart.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -7,
                  right: 9,
                  background: "var(--bg-dark)",
                  color: "var(--accent-blue)",
                  border: "2px solid #fff",
                  borderRadius: "50%",
                  fontWeight: 700,
                  fontSize: 12,
                  minWidth: 22,
                  height: 22,
                  lineHeight: "18px",
                  textAlign: "center",
                  zIndex: 4,
                  boxShadow: "0 1px 2px #2223"
                }}
                aria-label="Number of items in cart"
              >
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>
      {/* Main Section */}
      <section className="main-section">
        <header>
          <h1 className="section-title">Our Menu</h1>
          <div className="section-subtitle">
            Discover our delicious selection of dishes
          </div>
        </header>
        {/* If you want categories, add <div className="category-title">Pizza</div> */}
        <div className="category-title" style={{marginTop: 34}}>Pizza</div>
        {/* Menu Grid */}
        <section className="menu-grid" style={{marginTop: 6}}>
          {MENU_ITEMS.map((item) => (
            <article
              key={item.id}
              className="menu-item-card"
            >
              <div className="menu-card-image">
                {/* Placeholder icon for food */}
                <IconDish />
              </div>
              <div className="menu-item-title">{item.name}</div>
              <div className="menu-item-desc">{item.description}</div>
              <div className="menu-card-bottom">
                <span className="menu-price">${item.price.toFixed(2)}</span>
                <button
                  className="add-btn"
                  aria-label={`Add ${item.name} to cart`}
                  onClick={() => addToCart(item)}
                >
                  + Add
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>
      {/* Cart Sidebar */}
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        total={cartTotal}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        onCheckout={handleCheckout}
      />
      {showSummary && (
        <OrderSummaryModal
          cart={cart}
          total={cartTotal}
          onPlaceOrder={placeOrder}
          onClose={() => setShowSummary(false)}
        />
      )}
      {/* Snackbar */}
      <div
        aria-live="polite"
        role="status"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 36,
          zIndex: 1511,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
        {orderPlaced && (
          <div style={{
            background: "var(--accent-blue)",
            color: "#fff",
            padding: "15px 30px",
            borderRadius: 14,
            fontSize: 20,
            fontWeight: 700,
            boxShadow: "0 4px 15px 0 rgba(24,119,242,0.09)"
          }}>
            ✅ Order placed! Thank you.
          </div>
        )}
      </div>
      <footer>
        Bistro Deluxe &middot; Modern Restaurant Demo
      </footer>
    </div>
  );
}

// Cart Sidebar/Modal
function CartSidebar({ open, onClose, cart, total, updateQty, removeFromCart, onCheckout }) {
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
        zIndex: 1405,
        transition: "right 0.3s",
        display: "flex",
        flexDirection: "column",
        animation: "cartslidein 0.27s cubic-bezier(.47,1.64,.41,.8)",
        maxWidth: "100vw",
      }}
    >
      <header style={{
        padding: "20px 28px 8px 28px",
        borderBottom: "1.7px solid #2f3950",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{
          fontWeight: 800,
          fontSize: 22,
          color: "var(--primary-text)"
        }}>
          <span role="img" aria-label="cart" style={{marginRight: 6}}>🛒</span>
          Your Cart
        </span>
        <button
          onClick={onClose}
          aria-label="Close cart"
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-blue)",
            fontWeight: 700,
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
          <div style={{ color: "#6b7d99", textAlign: "center", marginTop: 60 }}>
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
                  borderBottom: "1px solid #304060",
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
                  <div style={{ color: "#9eb0d1", fontSize: 13 }}>{item.qty} × ${item.price.toFixed(2)}</div>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}>
                  <button
                    style={{
                      background: "var(--accent-blue)",
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
                      background: "var(--accent-blue)",
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
                    color: "var(--accent-blue)",
                    fontWeight: 700,
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
        borderTop: "1.5px solid #2f3950"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15
        }}>
          <span style={{
            fontWeight: 700,
            fontSize: 19,
            color: "#adb5bd"
          }}>Total:</span>
          <span style={{
            color: "var(--accent-blue)",
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
            padding: "13px 0",
            background: "var(--accent-blue)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            border: "none",
            borderRadius: 8,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            opacity: cart.length === 0 ? 0.56 : 1,
            boxShadow: "0 1px 6px 0 rgba(24,119,242,0.16)"
          }}
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout &rarr;
        </button>
      </footer>
    </aside>
  );
}

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
        zIndex: 1600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
      <section
        className="order-summary-modal"
        style={{
          width: "90vw",
          maxWidth: 400,
          background: "var(--bg-card)",
          borderRadius: 18,
          boxShadow: "0 6px 28px 0 rgba(55,71,79,0.24)",
          padding: "33px 34px 24px 34px",
          minHeight: 200,
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
            top: 10,
            right: 16,
            background: "none",
            border: "none",
            color: "var(--accent-blue)",
            fontWeight: 700,
            fontSize: 30,
            cursor: "pointer",
            padding: 0,
          }}>×</button>
        <h2 style={{
          fontWeight: 800,
          fontSize: 24,
          margin: "0 0 18px 0",
          color: "var(--primary-text)"
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
                padding: "8px 0",
                fontSize: 16,
                borderBottom: "1px solid #2e3954"
              }}>
              <span>
                {item.name} × {item.qty}
              </span>
              <span style={{
                color: "var(--accent-blue)",
                fontWeight: 700
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
            fontSize: 18,
            marginTop: 14,
            borderTop: "2px solid #36415b",
            paddingTop: 10,
            color: "#dadada"
          }}>
          <span>Total</span>
          <span style={{ color: "var(--accent-blue)" }}>{total}</span>
        </div>
        <button
          onClick={onPlaceOrder}
          className="placeorder-btn"
          style={{
            marginTop: 26,
            width: "100%",
            background: "var(--accent-blue)",
            color: "#fff",
            border: "none",
            borderRadius: 13,
            fontWeight: 700,
            fontSize: 18,
            padding: "11px 0",
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
