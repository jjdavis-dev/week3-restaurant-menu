import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/order">Order Now</Link>
        <Link to="/chat">AI Assistant</Link>
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
