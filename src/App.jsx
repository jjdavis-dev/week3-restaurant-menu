import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Menu from "./pages/Menu";

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
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  );
}
