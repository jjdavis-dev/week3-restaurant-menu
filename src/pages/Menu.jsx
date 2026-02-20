import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("menu_items")
        .select("id, name, price, category, image_url")
        .order("id", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
        setItems([]);
      } else {
        setItems(data ?? []);
      }

      setLoading(false);
    };

    fetchMenuItems();
  }, []);

  const breakfastItems = items.filter((item) => item.category === "breakfast");
  const lunchItems = items.filter((item) => item.category === "lunch");
  const dinnerItems = items.filter((item) => item.category === "dinner");
  const drinkItems = items.filter((item) => item.category === "drinks");

  if (loading) return <p style={{ padding: 16 }}>Loading menu...</p>;
  if (errorMsg) return <p style={{ padding: 16 }}>Error: {errorMsg}</p>;

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Menu</h1>

      <MenuSection title="Breakfast" items={breakfastItems} />
      <MenuSection title="Lunch" items={lunchItems} />
      <MenuSection title="Dinner" items={dinnerItems} />
      <MenuSection title="Beverages & Drinks" items={drinkItems} />
    </div>
  );
}

function MenuSection({ title, items }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 12,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  overflow: "hidden",
                  borderRadius: 10,
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
              </div>

              <h3 style={{ marginTop: 10, marginBottom: 6 }}>{item.name}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
