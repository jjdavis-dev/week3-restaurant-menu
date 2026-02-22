import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Menu from "./pages/Menu";
import OrderPage from "./pages/OrderPage";
import Chatbot from "./pages/Chatbot";

function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Home</h1>
      <p>Welcome! Use the Menu link to browse items.</p>
    </div>
  );
}

const navLinkStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontWeight: isActive ? 700 : 500,
  background: isActive ? "#f2f2f2" : "transparent",
});

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12, flexWrap: "wrap" }}>
        <NavLink to="/" style={navLinkStyle}>
          Home
        </NavLink>
        <NavLink to="/menu" style={navLinkStyle}>
          Menu
        </NavLink>
        <NavLink to="/order" style={navLinkStyle}>
          Order
        </NavLink>
        <NavLink to="/chat" style={navLinkStyle}>
          Chatbot
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}